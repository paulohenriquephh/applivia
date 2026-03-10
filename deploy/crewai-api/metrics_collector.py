"""Prometheus metrics exporter for CrewAI API."""

from prometheus_client import Counter, Gauge, Histogram, generate_latest, CONTENT_TYPE_LATEST


# Counters
TASKS_CREATED = Counter(
    "crewai_tasks_created_total",
    "Total number of tasks created",
    ["crew"],
)
TASKS_COMPLETED = Counter(
    "crewai_tasks_completed_total",
    "Total number of tasks completed",
    ["crew", "status"],
)
LLM_CALLS = Counter(
    "crewai_llm_calls_total",
    "Total LLM API calls",
    ["model", "status"],
)
BUDGET_SPEND = Counter(
    "crewai_budget_spend_usd_total",
    "Total budget spent in USD",
    ["model"],
)

# Gauges
ACTIVE_TASKS = Gauge(
    "crewai_active_tasks",
    "Number of currently running tasks",
)
BUDGET_REMAINING_MONTHLY = Gauge(
    "crewai_budget_remaining_monthly_usd",
    "Remaining monthly budget in USD",
)
BUDGET_REMAINING_DAILY = Gauge(
    "crewai_budget_remaining_daily_usd",
    "Remaining daily budget per provider in USD",
    ["provider"],
)

# Histograms
TASK_DURATION = Histogram(
    "crewai_task_duration_seconds",
    "Task execution duration in seconds",
    ["crew"],
    buckets=[1, 5, 10, 30, 60, 120, 300, 600],
)
LLM_LATENCY = Histogram(
    "crewai_llm_latency_seconds",
    "LLM call latency in seconds",
    ["model"],
    buckets=[0.5, 1, 2, 5, 10, 30],
)


class MetricsCollector:
    """Collects and exposes Prometheus metrics."""

    def record_task_created(self, crew: str) -> None:
        TASKS_CREATED.labels(crew=crew).inc()
        ACTIVE_TASKS.inc()

    def record_task_completed(self, crew: str, status: str, duration_s: float) -> None:
        TASKS_COMPLETED.labels(crew=crew, status=status).inc()
        TASK_DURATION.labels(crew=crew).observe(duration_s)
        ACTIVE_TASKS.dec()

    def record_llm_call(self, model: str, status: str, latency_s: float, cost: float) -> None:
        LLM_CALLS.labels(model=model, status=status).inc()
        LLM_LATENCY.labels(model=model).observe(latency_s)
        if cost > 0:
            BUDGET_SPEND.labels(model=model).inc(cost)

    def update_budget_gauges(self, monthly_remaining: float,
                             daily_remaining: dict[str, float]) -> None:
        BUDGET_REMAINING_MONTHLY.set(monthly_remaining)
        for provider, remaining in daily_remaining.items():
            BUDGET_REMAINING_DAILY.labels(provider=provider).set(remaining)

    def get_metrics(self) -> bytes:
        """Return Prometheus metrics in exposition format."""
        return generate_latest()

    def get_content_type(self) -> str:
        return CONTENT_TYPE_LATEST
