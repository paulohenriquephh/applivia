"""
APPLIVIA — OpenAI Spine Worker
Primary reasoning and orchestration engine.
Routes through LiteLLM for cost control.
Traces to Langfuse for observability.
Logs all runs to Postgres ledger.
"""

import os
import uuid
import time
import json
import asyncio
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
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
LITELLM_API_KEY = os.getenv("OPENAI_API_KEY", "")
LANGFUSE_HOST = os.getenv("LANGFUSE_HOST", "http://maestro-langfuse:3100")
LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY", "")
LANGFUSE_SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY", "")

DB_HOST = os.getenv("POSTGRES_HOST", "maestro-postgres")
DB_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
DB_NAME = os.getenv("POSTGRES_DB", "maestroapp")
DB_USER = os.getenv("POSTGRES_USER", "maestro")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "")

PRIMARY_MODEL = os.getenv("PRIMARY_MODEL", "openai/gpt-4o")
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "anthropic/claude-sonnet-4-20250514")

# ============================================
# DATABASE
# ============================================

db_pool: Optional[asyncpg.Pool] = None


async def get_db_pool() -> asyncpg.Pool:
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(
            host=DB_HOST, port=DB_PORT, database=DB_NAME,
            user=DB_USER, password=DB_PASS, min_size=2, max_size=10
        )
    return db_pool


async def log_run(
    job_id: Optional[str], agent: str, model: str, action: str,
    status: str, duration_ms: int, input_summary: str,
    output_summary: str, error_summary: str = "",
    cost_usd: float = 0, tokens_in: int = 0, tokens_out: int = 0
) -> str:
    """Log a run to the authoritative ledger."""
    run_id = str(uuid.uuid4())
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO runs (id, job_id, agent, model, action, status,
                duration_ms, input_summary, output_summary, error_summary,
                cost_usd, tokens_input, tokens_output, completed_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        """, run_id, uuid.UUID(job_id) if job_id else None, agent, model,
            action, status, duration_ms, input_summary[:500],
            output_summary[:1000], error_summary[:500],
            cost_usd, tokens_in, tokens_out,
            datetime.now(timezone.utc) if status in ('success', 'error') else None
        )
    return run_id


async def log_cost(
    run_id: str, provider: str, model: str,
    tokens_in: int, tokens_out: int, cost_usd: float
):
    """Log cost to cost_tracking table."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO cost_tracking (run_id, provider, model, tokens_input, tokens_output, cost_usd)
            VALUES ($1, $2, $3, $4, $5, $6)
        """, uuid.UUID(run_id), provider, model, tokens_in, tokens_out, cost_usd)


async def log_error(run_id: str, error_type: str, message: str, severity: str = "error"):
    """Log error to errors table."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO errors (run_id, error_type, message, severity)
            VALUES ($1, $2, $3, $4)
        """, uuid.UUID(run_id), error_type, message[:2000], severity)


async def log_audit(actor: str, action: str, resource_type: str = None, resource_id: str = None, details: dict = None):
    """Log audit event."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO audit_events (actor, action, resource_type, resource_id, details)
            VALUES ($1, $2, $3, $4, $5)
        """, actor, action, resource_type, resource_id, json.dumps(details or {}))


# ============================================
# LANGFUSE TRACING
# ============================================

async def trace_to_langfuse(trace_data: dict):
    """Send trace to Langfuse. Non-blocking, best-effort."""
    if not LANGFUSE_PUBLIC_KEY or not LANGFUSE_SECRET_KEY:
        return
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{LANGFUSE_HOST}/api/public/ingestion",
                json={"batch": [trace_data]},
                headers={"Authorization": f"Basic {LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}"},
                timeout=5.0,
            )
    except Exception:
        pass  # Best-effort tracing


# ============================================
# LLM CLIENT
# ============================================

async def call_llm(
    messages: List[Dict[str, str]],
    model: str = None,
    temperature: float = 0.7,
    max_tokens: int = 4096,
) -> Dict[str, Any]:
    """Call LLM through LiteLLM with fallback."""
    model = model or PRIMARY_MODEL
    start = time.time()

    async with httpx.AsyncClient() as client:
        # Try primary model
        try:
            response = await client.post(
                f"{LITELLM_BASE_URL}/v1/chat/completions",
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
                headers={
                    "Authorization": f"Bearer {LITELLM_API_KEY}",
                    "Content-Type": "application/json",
                },
                timeout=120.0,
            )
            if response.status_code == 200:
                data = response.json()
                duration_ms = int((time.time() - start) * 1000)
                usage = data.get("usage", {})
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "model": data.get("model", model),
                    "tokens_input": usage.get("prompt_tokens", 0),
                    "tokens_output": usage.get("completion_tokens", 0),
                    "duration_ms": duration_ms,
                    "provider": model.split("/")[0] if "/" in model else "openai",
                }
        except Exception:
            pass

        # Fallback
        if model != FALLBACK_MODEL:
            try:
                response = await client.post(
                    f"{LITELLM_BASE_URL}/v1/chat/completions",
                    json={
                        "model": FALLBACK_MODEL,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                    },
                    headers={
                        "Authorization": f"Bearer {LITELLM_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    timeout=120.0,
                )
                if response.status_code == 200:
                    data = response.json()
                    duration_ms = int((time.time() - start) * 1000)
                    usage = data.get("usage", {})
                    return {
                        "content": data["choices"][0]["message"]["content"],
                        "model": data.get("model", FALLBACK_MODEL),
                        "tokens_input": usage.get("prompt_tokens", 0),
                        "tokens_output": usage.get("completion_tokens", 0),
                        "duration_ms": duration_ms,
                        "provider": FALLBACK_MODEL.split("/")[0],
                    }
            except Exception:
                pass

    raise HTTPException(status_code=502, detail="All LLM providers failed")


# ============================================
# AGENT DEFINITIONS
# ============================================

AGENTS = {
    "orchestrator": {
        "system_prompt": """You are the Orchestrator agent for Applivia/Maestro AI Engine.
Your role: coordinate tasks, route to specialized agents, maintain context.
Always respond in a structured way. If a task needs a specialist, say which one.""",
        "model": PRIMARY_MODEL,
    },
    "import_agent": {
        "system_prompt": """You are the Import Agent for luxury goods (watches, bags) from China/Italy to Brazil.
Your expertise: supplier management, logistics, customs, pricing, quality control.""",
        "model": PRIMARY_MODEL,
    },
    "advertising_agent": {
        "system_prompt": """You are the Advertising Agent managing Meta, Google, and TikTok Ads campaigns.
Your expertise: ad creation, targeting, budget optimization, ROAS analysis.""",
        "model": PRIMARY_MODEL,
    },
    "sales_agent": {
        "system_prompt": """You are the Sales/SDR Agent handling WhatsApp and direct sales.
Your expertise: lead qualification, follow-up sequences, closing techniques, CRM.""",
        "model": PRIMARY_MODEL,
    },
    "analytics_agent": {
        "system_prompt": """You are the Analytics Agent providing business intelligence.
Your expertise: data analysis, KPI tracking, trend identification, reporting.""",
        "model": PRIMARY_MODEL,
    },
}


# ============================================
# PYDANTIC MODELS
# ============================================

class TaskRequest(BaseModel):
    task: str
    agent: str = "orchestrator"
    context: Optional[Dict[str, Any]] = None
    model: Optional[str] = None
    job_id: Optional[str] = None


class TaskResponse(BaseModel):
    run_id: str
    result: str
    agent: str
    model: str
    duration_ms: int
    tokens_input: int
    tokens_output: int
    cost_usd: float


class ReviewRequest(BaseModel):
    content: str
    review_type: str = "general"
    context: Optional[str] = None


# ============================================
# APP
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await get_db_pool()
    except Exception as e:
        print(f"DB pool init warning: {e}")
    yield
    # Shutdown
    if db_pool:
        await db_pool.close()


app = FastAPI(
    title="Applivia OpenAI Spine Worker",
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
        "service": "openai-spine",
        "db": "connected" if db_ok else "disconnected",
        "primary_model": PRIMARY_MODEL,
        "fallback_model": FALLBACK_MODEL,
    }


@app.post("/execute", response_model=TaskResponse)
async def execute_task(request: TaskRequest, background_tasks: BackgroundTasks):
    """Execute a task using the specified agent."""
    agent_config = AGENTS.get(request.agent, AGENTS["orchestrator"])
    model = request.model or agent_config["model"]

    messages = [
        {"role": "system", "content": agent_config["system_prompt"]},
    ]
    if request.context:
        messages.append({"role": "system", "content": f"Context: {json.dumps(request.context)}"})
    messages.append({"role": "user", "content": request.task})

    # Call LLM
    result = await call_llm(messages, model=model)

    # Estimate cost (rough: $5/1M input, $15/1M output for GPT-4o)
    cost_usd = (result["tokens_input"] * 5 + result["tokens_output"] * 15) / 1_000_000

    # Log run
    run_id = await log_run(
        job_id=request.job_id, agent=request.agent, model=result["model"],
        action="execute_task", status="success", duration_ms=result["duration_ms"],
        input_summary=request.task[:500], output_summary=result["content"][:1000],
        cost_usd=cost_usd, tokens_in=result["tokens_input"], tokens_out=result["tokens_output"]
    )

    # Log cost (background)
    background_tasks.add_task(
        log_cost, run_id, result["provider"], result["model"],
        result["tokens_input"], result["tokens_output"], cost_usd
    )

    # Audit (background)
    background_tasks.add_task(
        log_audit, request.agent, "execute_task", "run", run_id,
        {"task_preview": request.task[:100], "model": result["model"]}
    )

    return TaskResponse(
        run_id=run_id,
        result=result["content"],
        agent=request.agent,
        model=result["model"],
        duration_ms=result["duration_ms"],
        tokens_input=result["tokens_input"],
        tokens_output=result["tokens_output"],
        cost_usd=round(cost_usd, 6),
    )


@app.get("/agents")
async def list_agents():
    """List available agents."""
    return {name: {"model": cfg["model"]} for name, cfg in AGENTS.items()}


@app.get("/stats")
async def get_stats():
    """Get worker stats from DB."""
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            total = await conn.fetchval("SELECT COUNT(*) FROM runs WHERE agent != 'claude-review'")
            success = await conn.fetchval("SELECT COUNT(*) FROM runs WHERE status='success' AND agent != 'claude-review'")
            total_cost = await conn.fetchval("SELECT COALESCE(SUM(cost_usd), 0) FROM runs WHERE agent != 'claude-review'")
            return {
                "total_runs": total,
                "successful_runs": success,
                "total_cost_usd": float(total_cost),
            }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)
