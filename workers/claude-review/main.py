"""
APPLIVIA — Claude Adversarial Review Sidecar
Challenges assumptions, reviews outputs, hunts failures.
Uses Anthropic API through LiteLLM.
"""

import os
import uuid
import time
import json
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import asyncpg

# ============================================
# CONFIG
# ============================================

LITELLM_BASE_URL = os.getenv("LITELLM_BASE_URL", "http://maestro-litellm:4000")
LITELLM_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "anthropic/claude-sonnet-4-20250514")

DB_HOST = os.getenv("POSTGRES_HOST", "maestro-postgres")
DB_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
DB_NAME = os.getenv("POSTGRES_DB", "maestroapp")
DB_USER = os.getenv("POSTGRES_USER", "maestro")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "")

# ============================================
# DATABASE
# ============================================

db_pool: Optional[asyncpg.Pool] = None


async def get_db_pool() -> asyncpg.Pool:
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(
            host=DB_HOST, port=DB_PORT, database=DB_NAME,
            user=DB_USER, password=DB_PASS, min_size=2, max_size=5
        )
    return db_pool


async def log_run(agent, model, action, status, duration_ms, input_summary, output_summary, error_summary="", cost_usd=0, tokens_in=0, tokens_out=0):
    run_id = str(uuid.uuid4())
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO runs (id, agent, model, action, status, duration_ms,
                input_summary, output_summary, error_summary, cost_usd,
                tokens_input, tokens_output, completed_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        """, run_id, agent, model, action, status, duration_ms,
            input_summary[:500], output_summary[:1000], error_summary[:500],
            cost_usd, tokens_in, tokens_out,
            datetime.now(timezone.utc) if status in ('success', 'error') else None
        )
    return run_id


async def log_audit(actor, action, resource_type=None, resource_id=None, details=None):
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO audit_events (actor, action, resource_type, resource_id, details)
            VALUES ($1, $2, $3, $4, $5)
        """, actor, action, resource_type, resource_id, json.dumps(details or {}))


# ============================================
# LLM CLIENT
# ============================================

async def call_claude(messages, model=None, max_tokens=4096):
    model = model or CLAUDE_MODEL
    start = time.time()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{LITELLM_BASE_URL}/v1/chat/completions",
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": max_tokens,
            },
            headers={
                "Authorization": f"Bearer {LITELLM_API_KEY}",
                "Content-Type": "application/json",
            },
            timeout=120.0,
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()
        duration_ms = int((time.time() - start) * 1000)
        usage = data.get("usage", {})
        return {
            "content": data["choices"][0]["message"]["content"],
            "model": data.get("model", model),
            "tokens_input": usage.get("prompt_tokens", 0),
            "tokens_output": usage.get("completion_tokens", 0),
            "duration_ms": duration_ms,
        }


# ============================================
# REVIEW PROMPTS
# ============================================

REVIEW_PROMPTS = {
    "adversarial": """You are an adversarial reviewer. Your job is to find flaws, assumptions, risks, and blind spots in the following content. Be thorough and constructive.

Score each issue found:
- Severity: critical / high / medium / low
- Type: factual_error / assumption / risk / blind_spot / inefficiency / security

Content to review:
{content}

{context}

Respond with a structured JSON:
{{
  "overall_score": 1-10,
  "issues": [
    {{"severity": "...", "type": "...", "description": "...", "suggestion": "..."}}
  ],
  "summary": "..."
}}""",

    "code_review": """You are a senior code reviewer focused on security, correctness, and maintainability. Review the following code:

{content}

{context}

Respond with structured JSON:
{{
  "overall_score": 1-10,
  "issues": [
    {{"severity": "...", "type": "...", "line_hint": "...", "description": "...", "fix": "..."}}
  ],
  "summary": "..."
}}""",

    "decision_review": """You are a strategic decision reviewer. Challenge the following decision or plan:

{content}

{context}

Consider: alternatives missed, hidden costs, second-order effects, failure modes, regulatory risks.

Respond with structured JSON:
{{
  "overall_score": 1-10,
  "alternatives": ["..."],
  "risks": [
    {{"risk": "...", "probability": "high/medium/low", "impact": "high/medium/low", "mitigation": "..."}}
  ],
  "blind_spots": ["..."],
  "recommendation": "..."
}}""",

    "output_review": """You are reviewing an AI agent's output for quality, accuracy, and completeness.

Agent output:
{content}

Original task context:
{context}

Check for: hallucinations, incomplete answers, wrong assumptions, missing caveats, overconfidence.

Respond with structured JSON:
{{
  "quality_score": 1-10,
  "accuracy_score": 1-10,
  "completeness_score": 1-10,
  "issues": [
    {{"type": "...", "description": "...", "suggestion": "..."}}
  ],
  "verdict": "pass / needs_revision / reject"
}}""",
}


# ============================================
# MODELS
# ============================================

class ReviewRequest(BaseModel):
    content: str
    review_type: str = "adversarial"
    context: Optional[str] = None
    run_id: Optional[str] = None


class ReviewResponse(BaseModel):
    review_run_id: str
    review_type: str
    result: Dict[str, Any]
    model: str
    duration_ms: int
    tokens_input: int
    tokens_output: int


# ============================================
# APP
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await get_db_pool()
    except Exception as e:
        print(f"DB pool init warning: {e}")
    yield
    if db_pool:
        await db_pool.close()


app = FastAPI(
    title="Applivia Claude Review Sidecar",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    db_ok = False
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        db_ok = True
    except Exception:
        pass
    return {
        "status": "healthy" if db_ok else "degraded",
        "service": "claude-review",
        "db": "connected" if db_ok else "disconnected",
        "model": CLAUDE_MODEL,
    }


@app.post("/review", response_model=ReviewResponse)
async def review(request: ReviewRequest, background_tasks: BackgroundTasks):
    """Perform adversarial review using Claude."""
    prompt_template = REVIEW_PROMPTS.get(request.review_type, REVIEW_PROMPTS["adversarial"])
    prompt = prompt_template.format(
        content=request.content,
        context=f"Additional context: {request.context}" if request.context else ""
    )

    messages = [
        {"role": "system", "content": "You are Claude, an adversarial review sidecar. Always respond with valid JSON."},
        {"role": "user", "content": prompt},
    ]

    result = await call_claude(messages)

    # Parse JSON response
    try:
        parsed = json.loads(result["content"])
    except json.JSONDecodeError:
        parsed = {"raw_response": result["content"], "parse_error": True}

    # Estimate cost (Claude Sonnet: ~$3/1M input, $15/1M output)
    cost_usd = (result["tokens_input"] * 3 + result["tokens_output"] * 15) / 1_000_000

    # Log run
    run_id = await log_run(
        "claude-review", result["model"], f"review_{request.review_type}",
        "success", result["duration_ms"],
        request.content[:500], json.dumps(parsed)[:1000],
        cost_usd=cost_usd, tokens_in=result["tokens_input"], tokens_out=result["tokens_output"]
    )

    # Audit
    background_tasks.add_task(
        log_audit, "claude-review", f"review_{request.review_type}",
        "run", request.run_id or run_id,
        {"review_type": request.review_type, "reviewed_run": request.run_id}
    )

    return ReviewResponse(
        review_run_id=run_id,
        review_type=request.review_type,
        result=parsed,
        model=result["model"],
        duration_ms=result["duration_ms"],
        tokens_input=result["tokens_input"],
        tokens_output=result["tokens_output"],
    )


@app.get("/review-types")
async def list_review_types():
    return {"types": list(REVIEW_PROMPTS.keys())}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8011)
