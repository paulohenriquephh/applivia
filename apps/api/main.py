"""
APPLIVIA — Dashboard API
Serves real data from Postgres to the Next.js dashboard.
"""

import os
import json
from datetime import datetime, timezone
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import asyncpg

# ============================================
# CONFIG
# ============================================

DB_HOST = os.getenv("POSTGRES_HOST", "maestro-postgres")
DB_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
DB_NAME = os.getenv("POSTGRES_DB", "maestroapp")
DB_USER = os.getenv("POSTGRES_USER", "maestro")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "")

db_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(
            host=DB_HOST, port=DB_PORT, database=DB_NAME,
            user=DB_USER, password=DB_PASS, min_size=2, max_size=10
        )
    return db_pool


def row_to_dict(row):
    if row is None:
        return None
    d = dict(row)
    for k, v in d.items():
        if isinstance(v, datetime):
            d[k] = v.isoformat()
        elif hasattr(v, '__str__') and not isinstance(v, (str, int, float, bool)):
            d[k] = str(v)
    return d


# ============================================
# APP
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await get_pool()
    except Exception as e:
        print(f"DB pool warning: {e}")
    yield
    if db_pool:
        await db_pool.close()


app = FastAPI(title="Applivia Dashboard API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# ============================================
# OVERVIEW
# ============================================

@app.get("/api/overview")
async def overview():
    """Dashboard overview data."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        runs_24h = await conn.fetchval("SELECT COUNT(*) FROM runs WHERE created_at > NOW() - INTERVAL '24 hours'")
        runs_7d = await conn.fetchval("SELECT COUNT(*) FROM runs WHERE created_at > NOW() - INTERVAL '7 days'")
        success_24h = await conn.fetchval("SELECT COUNT(*) FROM runs WHERE status='success' AND created_at > NOW() - INTERVAL '24 hours'")
        errors_24h = await conn.fetchval("SELECT COUNT(*) FROM runs WHERE status='error' AND created_at > NOW() - INTERVAL '24 hours'")
        cost_24h = await conn.fetchval("SELECT COALESCE(SUM(cost_usd), 0) FROM cost_tracking WHERE created_at > NOW() - INTERVAL '24 hours'")
        cost_7d = await conn.fetchval("SELECT COALESCE(SUM(cost_usd), 0) FROM cost_tracking WHERE created_at > NOW() - INTERVAL '7 days'")
        pending_approvals = await conn.fetchval("SELECT COUNT(*) FROM approvals WHERE status='pending'")
        open_incidents = await conn.fetchval("SELECT COUNT(*) FROM incidents WHERE status IN ('open', 'investigating', 'mitigating')")
        avg_latency = await conn.fetchval("SELECT COALESCE(AVG(duration_ms), 0) FROM runs WHERE created_at > NOW() - INTERVAL '24 hours'")
        integrations_ok = await conn.fetchval("SELECT COUNT(*) FROM integrations WHERE last_health_status='healthy'")
        integrations_total = await conn.fetchval("SELECT COUNT(*) FROM integrations")

    return {
        "runs_24h": runs_24h or 0,
        "runs_7d": runs_7d or 0,
        "success_24h": success_24h or 0,
        "errors_24h": errors_24h or 0,
        "success_rate_24h": round((success_24h / runs_24h * 100) if runs_24h else 0, 1),
        "cost_24h_usd": float(cost_24h),
        "cost_7d_usd": float(cost_7d),
        "pending_approvals": pending_approvals or 0,
        "open_incidents": open_incidents or 0,
        "avg_latency_ms": round(float(avg_latency), 0),
        "integrations_healthy": integrations_ok or 0,
        "integrations_total": integrations_total or 0,
    }


# ============================================
# RUNS
# ============================================

@app.get("/api/runs")
async def list_runs(limit: int = Query(50, le=200), offset: int = 0, status: Optional[str] = None, agent: Optional[str] = None):
    pool = await get_pool()
    async with pool.acquire() as conn:
        where = []
        args = []
        idx = 1
        if status:
            where.append(f"status = ${idx}")
            args.append(status)
            idx += 1
        if agent:
            where.append(f"agent = ${idx}")
            args.append(agent)
            idx += 1
        where_clause = ("WHERE " + " AND ".join(where)) if where else ""
        args.extend([limit, offset])
        rows = await conn.fetch(
            f"SELECT id, job_id, agent, model, action, status, duration_ms, input_summary, output_summary, error_summary, cost_usd, tokens_input, tokens_output, created_at, completed_at FROM runs {where_clause} ORDER BY created_at DESC LIMIT ${idx} OFFSET ${idx+1}",
            *args
        )
        total = await conn.fetchval(f"SELECT COUNT(*) FROM runs {where_clause}", *args[:-2])
    return {"total": total, "runs": [row_to_dict(r) for r in rows]}


@app.get("/api/runs/{run_id}")
async def get_run(run_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM runs WHERE id = $1", run_id)
    if not row:
        return {"error": "not found"}
    return row_to_dict(row)


# ============================================
# COSTS
# ============================================

@app.get("/api/costs")
async def get_costs(days: int = 30):
    pool = await get_pool()
    async with pool.acquire() as conn:
        by_provider = await conn.fetch("""
            SELECT provider, model, SUM(tokens_input) as tokens_in, SUM(tokens_output) as tokens_out,
                   SUM(cost_usd) as total_cost, COUNT(*) as call_count
            FROM cost_tracking WHERE created_at > NOW() - make_interval(days => $1)
            GROUP BY provider, model ORDER BY total_cost DESC
        """, days)
        by_day = await conn.fetch("""
            SELECT DATE(created_at) as day, SUM(cost_usd) as cost, COUNT(*) as calls
            FROM cost_tracking WHERE created_at > NOW() - make_interval(days => $1)
            GROUP BY DATE(created_at) ORDER BY day DESC
        """, days)
        total = await conn.fetchval("""
            SELECT COALESCE(SUM(cost_usd), 0) FROM cost_tracking
            WHERE created_at > NOW() - make_interval(days => $1)
        """, days)
    return {
        "total_cost_usd": float(total),
        "by_provider": [row_to_dict(r) for r in by_provider],
        "by_day": [row_to_dict(r) for r in by_day],
    }


# ============================================
# APPROVALS
# ============================================

@app.get("/api/approvals")
async def list_approvals(status: Optional[str] = "pending"):
    pool = await get_pool()
    async with pool.acquire() as conn:
        if status:
            rows = await conn.fetch("SELECT * FROM approvals WHERE status = $1 ORDER BY created_at DESC LIMIT 50", status)
        else:
            rows = await conn.fetch("SELECT * FROM approvals ORDER BY created_at DESC LIMIT 50")
    return {"approvals": [row_to_dict(r) for r in rows]}


@app.post("/api/approvals/{approval_id}/decide")
async def decide_approval(approval_id: str, decision: str, approved_by: str = "admin"):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            UPDATE approvals SET status = $1, approved_by = $2, decided_at = NOW()
            WHERE id = $3
        """, decision, approved_by, approval_id)
        await conn.execute("""
            INSERT INTO audit_events (actor, action, resource_type, resource_id, details)
            VALUES ($1, $2, $3, $4, $5)
        """, approved_by, f"approval_{decision}", "approval", approval_id,
            json.dumps({"decision": decision}))
    return {"status": "ok", "decision": decision}


# ============================================
# INCIDENTS
# ============================================

@app.get("/api/incidents")
async def list_incidents(status: Optional[str] = None):
    pool = await get_pool()
    async with pool.acquire() as conn:
        if status:
            rows = await conn.fetch("SELECT * FROM incidents WHERE status = $1 ORDER BY created_at DESC LIMIT 50", status)
        else:
            rows = await conn.fetch("SELECT * FROM incidents ORDER BY created_at DESC LIMIT 50")
    return {"incidents": [row_to_dict(r) for r in rows]}


# ============================================
# INTEGRATIONS
# ============================================

@app.get("/api/integrations")
async def list_integrations():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM integrations ORDER BY name")
    return {"integrations": [row_to_dict(r) for r in rows]}


# ============================================
# ERRORS
# ============================================

@app.get("/api/errors")
async def list_errors(resolved: Optional[bool] = None, limit: int = 50):
    pool = await get_pool()
    async with pool.acquire() as conn:
        if resolved is not None:
            rows = await conn.fetch("SELECT * FROM errors WHERE resolved = $1 ORDER BY created_at DESC LIMIT $2", resolved, limit)
        else:
            rows = await conn.fetch("SELECT * FROM errors ORDER BY created_at DESC LIMIT $1", limit)
    return {"errors": [row_to_dict(r) for r in rows]}


# ============================================
# AUDIT LOG
# ============================================

@app.get("/api/audit")
async def list_audit(limit: int = 100, actor: Optional[str] = None):
    pool = await get_pool()
    async with pool.acquire() as conn:
        if actor:
            rows = await conn.fetch("SELECT * FROM audit_events WHERE actor = $1 ORDER BY created_at DESC LIMIT $2", actor, limit)
        else:
            rows = await conn.fetch("SELECT * FROM audit_events ORDER BY created_at DESC LIMIT $1", limit)
    return {"events": [row_to_dict(r) for r in rows]}


# ============================================
# DEPLOYMENTS
# ============================================

@app.get("/api/deployments")
async def list_deployments(limit: int = 20):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM deployment_events ORDER BY created_at DESC LIMIT $1", limit)
    return {"deployments": [row_to_dict(r) for r in rows]}


# ============================================
# KNOWLEDGE
# ============================================

@app.get("/api/knowledge")
async def list_knowledge():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM knowledge_sources ORDER BY name")
    return {"sources": [row_to_dict(r) for r in rows]}


# ============================================
# HEALTH
# ============================================

@app.get("/health")
async def health():
    db_ok = False
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        db_ok = True
    except Exception:
        pass
    return {"status": "healthy" if db_ok else "degraded", "db": db_ok}


@app.get("/api/system-health")
async def system_health():
    """Check health of all services."""
    import httpx
    services = {
        "brain": "http://maestro-brain:8000/health",
        "litellm": "http://maestro-litellm:4000/health",
        "n8n": "http://maestro-n8n:5678/healthz",
        "openai-worker": "http://openai-worker:8010/health",
        "claude-review": "http://claude-review:8011/health",
    }
    results = {}
    async with httpx.AsyncClient(timeout=5.0) as client:
        for name, url in services.items():
            try:
                r = await client.get(url)
                results[name] = {"status": "healthy" if r.status_code == 200 else "unhealthy", "code": r.status_code}
            except Exception as e:
                results[name] = {"status": "unreachable", "error": str(e)[:100]}
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002)
