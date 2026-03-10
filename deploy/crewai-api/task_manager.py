"""Async task queue with Redis for managing crew executions."""

import asyncio
import json
import traceback
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

import redis
import structlog

from models import TaskStatus

logger = structlog.get_logger()


class TaskManager:
    """Manages async crew task execution with Redis-backed state."""

    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url, decode_responses=True)
        self._running_tasks: dict[str, asyncio.Task] = {}

    def create_task(self, crew: str, task: str, inputs: dict[str, Any],
                    priority: int = 5, callback_url: Optional[str] = None) -> str:
        """Create a new task and return its ID."""
        task_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        task_data = {
            "task_id": task_id,
            "crew": crew,
            "task": task,
            "inputs": json.dumps(inputs),
            "priority": priority,
            "callback_url": callback_url or "",
            "status": TaskStatus.PENDING.value,
            "result": "",
            "error": "",
            "created_at": now,
            "started_at": "",
            "completed_at": "",
            "cost_usd": 0.0,
            "model_used": "",
            "duration_ms": 0,
        }
        self.redis.hset(f"task:{task_id}", mapping=task_data)
        self.redis.lpush("task:queue", task_id)
        self.redis.sadd("task:all", task_id)
        self.redis.incr("metrics:tasks_created")
        logger.info("task_created", task_id=task_id, crew=crew)
        return task_id

    def get_task(self, task_id: str) -> Optional[dict[str, Any]]:
        """Get task data by ID."""
        data = self.redis.hgetall(f"task:{task_id}")
        if not data:
            return None
        if data.get("result"):
            try:
                data["result"] = json.loads(data["result"])
            except (json.JSONDecodeError, TypeError):
                data["result"] = {"raw": data["result"]}
        data["cost_usd"] = float(data.get("cost_usd", 0))
        data["duration_ms"] = int(data.get("duration_ms", 0))
        data["priority"] = int(data.get("priority", 5))
        return data

    def update_task(self, task_id: str, **kwargs: Any) -> None:
        """Update task fields."""
        updates = {}
        for key, value in kwargs.items():
            if isinstance(value, dict):
                updates[key] = json.dumps(value)
            elif isinstance(value, (datetime,)):
                updates[key] = value.isoformat()
            else:
                updates[key] = str(value)
        if updates:
            self.redis.hset(f"task:{task_id}", mapping=updates)

    def mark_running(self, task_id: str) -> None:
        """Mark a task as running."""
        now = datetime.now(timezone.utc)
        self.update_task(task_id, status=TaskStatus.RUNNING.value, started_at=now)
        self.redis.incr("metrics:tasks_running")

    def mark_completed(self, task_id: str, result: dict[str, Any],
                       cost_usd: float = 0.0, model_used: str = "",
                       duration_ms: int = 0) -> None:
        """Mark a task as completed with results."""
        now = datetime.now(timezone.utc)
        self.update_task(
            task_id,
            status=TaskStatus.COMPLETED.value,
            result=result,
            completed_at=now,
            cost_usd=cost_usd,
            model_used=model_used,
            duration_ms=duration_ms,
        )
        self.redis.incr("metrics:tasks_completed")
        self.redis.decr("metrics:tasks_running")
        logger.info("task_completed", task_id=task_id, cost=cost_usd, model=model_used)

    def mark_failed(self, task_id: str, error: str) -> None:
        """Mark a task as failed."""
        now = datetime.now(timezone.utc)
        self.update_task(
            task_id,
            status=TaskStatus.FAILED.value,
            error=error,
            completed_at=now,
        )
        self.redis.incr("metrics:tasks_failed")
        self.redis.decr("metrics:tasks_running")
        logger.error("task_failed", task_id=task_id, error=error)

    def get_active_count(self) -> int:
        """Get count of currently running tasks."""
        return int(self.redis.get("metrics:tasks_running") or 0)

    def get_completed_count(self) -> int:
        """Get total completed tasks."""
        return int(self.redis.get("metrics:tasks_completed") or 0)

    async def execute_crew_task(self, task_id: str, crew_runner: Any) -> None:
        """Execute a crew task asynchronously."""
        self.mark_running(task_id)
        task_data = self.get_task(task_id)
        if not task_data:
            return

        try:
            inputs = task_data.get("inputs", {})
            if isinstance(inputs, str):
                inputs = json.loads(inputs)

            start = asyncio.get_event_loop().time()
            result = await asyncio.to_thread(crew_runner, inputs)
            duration = int((asyncio.get_event_loop().time() - start) * 1000)

            self.mark_completed(
                task_id,
                result=result if isinstance(result, dict) else {"output": str(result)},
                cost_usd=result.get("cost", 0.0) if isinstance(result, dict) else 0.0,
                model_used=result.get("model", "") if isinstance(result, dict) else "",
                duration_ms=duration,
            )

            callback_url = task_data.get("callback_url")
            if callback_url:
                await self._send_callback(callback_url, task_id, result)

        except Exception as exc:
            self.mark_failed(task_id, f"{type(exc).__name__}: {exc}\n{traceback.format_exc()}")

    async def _send_callback(self, url: str, task_id: str, result: Any) -> None:
        """Send completion callback to webhook URL."""
        import httpx
        try:
            async with httpx.AsyncClient() as client:
                await client.post(url, json={"task_id": task_id, "result": result}, timeout=10)
        except Exception as exc:
            logger.error("callback_failed", url=url, task_id=task_id, error=str(exc))
