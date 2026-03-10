"""Pydantic models for all CrewAI API endpoints."""

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class KickoffRequest(BaseModel):
    crew: str = Field(..., description="Name of the crew to run")
    task: str = Field(default="default", description="Specific task within the crew")
    inputs: dict[str, Any] = Field(default_factory=dict, description="Input parameters")
    priority: int = Field(default=5, ge=1, le=10, description="Priority 1-10")
    callback_url: Optional[str] = Field(default=None, description="Webhook URL for completion")


class KickoffResponse(BaseModel):
    task_id: str
    crew: str
    status: TaskStatus
    message: str
    created_at: datetime


class TaskStatusResponse(BaseModel):
    task_id: str
    crew: str
    status: TaskStatus
    result: Optional[dict[str, Any]] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cost_usd: float = 0.0
    model_used: Optional[str] = None
    duration_ms: Optional[int] = None


class BudgetResponse(BaseModel):
    daily_spend: dict[str, float]
    monthly_spend: float
    monthly_cap: float
    monthly_remaining: float
    daily_cap_per_provider: float
    providers: dict[str, dict[str, float]]
    alert_level: str  # "ok", "warning", "critical"


class HealthResponse(BaseModel):
    status: str
    services: dict[str, str]
    uptime_seconds: float
    active_tasks: int
    total_completed: int


class CrewListItem(BaseModel):
    name: str
    agents: list[str]
    description: str


class LLMCallResult(BaseModel):
    text: str
    model: str
    cost: float
    latency_ms: int
    tokens_input: int
    tokens_output: int
