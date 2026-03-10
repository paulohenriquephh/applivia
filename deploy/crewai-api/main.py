"""CrewAI API — FastAPI service for managing 10 crews with cascading LLM router."""

import asyncio
import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

from budget_tracker import BudgetTracker
from config import CREW_NAMES, settings
from crews import get_crew_runner, list_crews
from llm_factory import LLMRouter
from metrics_collector import MetricsCollector
from models import (
    BudgetResponse,
    CrewListItem,
    HealthResponse,
    KickoffRequest,
    KickoffResponse,
    TaskStatus,
    TaskStatusResponse,
)
from task_manager import TaskManager

logger = structlog.get_logger()

START_TIME = time.time()
task_manager: TaskManager
budget: BudgetTracker
metrics: MetricsCollector
llm_router: LLMRouter


@asynccontextmanager
async def lifespan(app: FastAPI):
    global task_manager, budget, metrics, llm_router
    task_manager = TaskManager(settings.redis_url)
    budget = BudgetTracker(settings.redis_url)
    metrics = MetricsCollector()
    llm_router = LLMRouter(tier="worker")
    logger.info("crewai_api_started", port=settings.crewai_api_port)
    yield
    logger.info("crewai_api_shutdown")


app = FastAPI(
    title="CrewAI API — Singularity V6",
    version="6.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/kickoff", response_model=KickoffResponse)
async def kickoff_crew(req: KickoffRequest):
    """Start a crew task execution."""
    if req.crew not in CREW_NAMES:
        raise HTTPException(status_code=404, detail=f"Crew '{req.crew}' not found. Available: {CREW_NAMES}")

    task_id = task_manager.create_task(
        crew=req.crew,
        task=req.task,
        inputs=req.inputs,
        priority=req.priority,
        callback_url=req.callback_url,
    )
    metrics.record_task_created(req.crew)

    crew_runner = get_crew_runner(req.crew, req.task, llm_router)
    asyncio.create_task(task_manager.execute_crew_task(task_id, crew_runner))

    from datetime import datetime, timezone
    return KickoffResponse(
        task_id=task_id,
        crew=req.crew,
        status=TaskStatus.PENDING,
        message=f"Task queued for crew '{req.crew}'",
        created_at=datetime.now(timezone.utc),
    )


@app.get("/status/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: str):
    """Get the status of a running or completed task."""
    task_data = task_manager.get_task(task_id)
    if not task_data:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
    return TaskStatusResponse(
        task_id=task_data["task_id"],
        crew=task_data["crew"],
        status=TaskStatus(task_data["status"]),
        result=task_data.get("result"),
        error=task_data.get("error") or None,
        started_at=task_data.get("started_at") or None,
        completed_at=task_data.get("completed_at") or None,
        cost_usd=task_data.get("cost_usd", 0.0),
        model_used=task_data.get("model_used") or None,
        duration_ms=task_data.get("duration_ms", 0),
    )


@app.get("/budget/check", response_model=BudgetResponse)
async def check_budget():
    """Check current budget status."""
    daily = budget.get_daily_spend()
    monthly = budget.get_monthly_spend()
    providers = budget.get_provider_breakdown()
    return BudgetResponse(
        daily_spend=daily,
        monthly_spend=monthly,
        monthly_cap=budget.MONTHLY_HARD_CAP,
        monthly_remaining=round(budget.MONTHLY_HARD_CAP - monthly, 4),
        daily_cap_per_provider=budget.DAILY_CAP_PER_PROVIDER,
        providers=providers,
        alert_level=budget.get_alert_level(),
    )


@app.get("/crews", response_model=list[CrewListItem])
async def get_crews():
    """List all available crews."""
    return list_crews()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Service health check."""
    services = {"api": "healthy"}
    try:
        task_manager.redis.ping()
        services["redis"] = "healthy"
    except Exception:
        services["redis"] = "unhealthy"

    return HealthResponse(
        status="healthy" if all(v == "healthy" for v in services.values()) else "degraded",
        services=services,
        uptime_seconds=round(time.time() - START_TIME, 2),
        active_tasks=task_manager.get_active_count(),
        total_completed=task_manager.get_completed_count(),
    )


@app.get("/metrics")
async def prometheus_metrics():
    """Prometheus metrics endpoint."""
    monthly = budget.get_monthly_spend()
    metrics.update_budget_gauges(
        monthly_remaining=budget.MONTHLY_HARD_CAP - monthly,
        daily_remaining={},
    )
    return Response(
        content=metrics.get_metrics(),
        media_type=metrics.get_content_type(),
    )
