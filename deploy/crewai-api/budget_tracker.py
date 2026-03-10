"""Redis-backed spend tracking with auto-reload alerts and budget enforcement."""

import json
import os
from datetime import datetime, timezone

import httpx
import redis
import structlog

logger = structlog.get_logger()


class BudgetTracker:
    """Redis-backed spend tracking with auto-reload alerts."""

    DAILY_CAP_PER_PROVIDER: float = float(os.getenv("BUDGET_DAILY_CAP_PER_PROVIDER", "25.0"))
    MONTHLY_HARD_CAP: float = float(os.getenv("BUDGET_MONTHLY_HARD_CAP", "83.33"))
    RELOAD_THRESHOLD: float = float(os.getenv("BUDGET_RELOAD_THRESHOLD", "10.0"))

    MODEL_COSTS: dict[str, dict[str, float]] = {
        "GLM-4.7-Flash": {"input": 0.0, "output": 0.0},
        "Gemini-2.0-Flash-Lite": {"input": 0.0, "output": 0.0},
        "DeepSeek-V3.2": {"input": 0.28, "output": 0.42},
        "Qwen-Flash": {"input": 0.05, "output": 0.40},
        "GPT-4.1-Nano": {"input": 0.10, "output": 0.40},
        "GPT-5-Mini": {"input": 0.25, "output": 2.00},
        "GPT-5.4": {"input": 2.50, "output": 15.00},
        "Claude-Opus-4.6": {"input": 5.00, "output": 25.00},
        "Grok-4.1-Fast": {"input": 0.20, "output": 0.50},
        "o4-mini": {"input": 1.10, "output": 4.40},
        "Claude-Sonnet-4.5": {"input": 3.00, "output": 15.00},
        "Gemini-3.1-Pro": {"input": 2.00, "output": 12.00},
        "Grok-4": {"input": 3.00, "output": 15.00},
        "Mistral-Medium-3": {"input": 0.40, "output": 2.00},
    }

    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url, decode_responses=True)
        self._telegram_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self._telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID", "")

    def _today(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")

    def _this_month(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m")

    def can_spend(self, model: str) -> bool:
        """Check if we can make another call to this model."""
        daily_key = f"budget:{model}:{self._today()}"
        monthly_key = f"budget:monthly:{self._this_month()}"
        daily = float(self.redis.get(daily_key) or 0)
        monthly = float(self.redis.get(monthly_key) or 0)
        return (daily < self.DAILY_CAP_PER_PROVIDER and monthly < self.MONTHLY_HARD_CAP)

    def calculate_cost(self, model: str, input_tokens: int, output_tokens: int) -> float:
        """Calculate the cost of a model call in USD."""
        costs = self.MODEL_COSTS.get(model, {"input": 0.10, "output": 0.40})
        return (input_tokens * costs["input"] / 1_000_000) + (output_tokens * costs["output"] / 1_000_000)

    def log_spend(self, model: str, input_tokens: int, output_tokens: int) -> float:
        """Log spend and check thresholds. Returns cost in USD."""
        cost = self.calculate_cost(model, input_tokens, output_tokens)
        if cost == 0:
            return 0.0

        daily_key = f"budget:{model}:{self._today()}"
        monthly_key = f"budget:monthly:{self._this_month()}"

        pipe = self.redis.pipeline()
        pipe.incrbyfloat(daily_key, cost)
        pipe.expire(daily_key, 86400 * 2)
        pipe.incrbyfloat(monthly_key, cost)
        pipe.expire(monthly_key, 86400 * 35)
        results = pipe.execute()

        daily_total = float(results[0])
        monthly_total = float(results[2])

        # Log the spend event
        event = {
            "model": model,
            "cost": round(cost, 6),
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "daily_total": round(daily_total, 4),
            "monthly_total": round(monthly_total, 4),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self.redis.lpush("budget:events", json.dumps(event))
        self.redis.ltrim("budget:events", 0, 9999)

        remaining_daily = self.DAILY_CAP_PER_PROVIDER - daily_total
        if remaining_daily < self.RELOAD_THRESHOLD and remaining_daily > 0:
            self._alert_telegram(
                f"[BUDGET] {model}: ${remaining_daily:.2f} remaining today. "
                f"Cap resets at midnight UTC."
            )

        if monthly_total > self.MONTHLY_HARD_CAP * 0.8 and monthly_total <= self.MONTHLY_HARD_CAP:
            self._alert_telegram(
                f"[BUDGET WARNING] Monthly: ${monthly_total:.2f} / "
                f"${self.MONTHLY_HARD_CAP:.2f}"
            )

        if monthly_total > self.MONTHLY_HARD_CAP:
            self._kill_non_essential()
            self._alert_telegram(
                "[BUDGET CRITICAL] Monthly cap hit. Non-essential services stopped."
            )

        return cost

    def get_daily_spend(self) -> dict[str, float]:
        """Get today's spend by model."""
        result = {}
        for model in self.MODEL_COSTS:
            key = f"budget:{model}:{self._today()}"
            val = self.redis.get(key)
            if val:
                result[model] = round(float(val), 4)
        return result

    def get_monthly_spend(self) -> float:
        """Get current month's total spend."""
        key = f"budget:monthly:{self._this_month()}"
        return round(float(self.redis.get(key) or 0), 4)

    def get_provider_breakdown(self) -> dict[str, dict[str, float]]:
        """Get spend breakdown by provider."""
        providers: dict[str, dict[str, float]] = {}
        provider_map = {
            "GLM-4.7-Flash": "zhipu",
            "Gemini-2.0-Flash-Lite": "google",
            "DeepSeek-V3.2": "deepseek",
            "Qwen-Flash": "alibaba",
            "GPT-4.1-Nano": "openai",
            "GPT-5-Mini": "openai",
            "GPT-5.4": "openai",
            "Claude-Opus-4.6": "anthropic",
            "Claude-Sonnet-4.5": "anthropic",
            "Grok-4.1-Fast": "xai",
            "Grok-4": "xai",
            "o4-mini": "openai",
            "Gemini-3.1-Pro": "google",
            "Mistral-Medium-3": "mistral",
        }
        for model, provider in provider_map.items():
            key = f"budget:{model}:{self._today()}"
            val = float(self.redis.get(key) or 0)
            if provider not in providers:
                providers[provider] = {"daily": 0.0, "monthly": 0.0}
            providers[provider]["daily"] += val
        monthly = self.get_monthly_spend()
        for provider in providers:
            providers[provider]["daily"] = round(providers[provider]["daily"], 4)
            providers[provider]["monthly"] = round(monthly, 4)
        return providers

    def get_alert_level(self) -> str:
        """Return current alert level: ok, warning, critical."""
        monthly = self.get_monthly_spend()
        if monthly > self.MONTHLY_HARD_CAP:
            return "critical"
        if monthly > self.MONTHLY_HARD_CAP * 0.8:
            return "warning"
        return "ok"

    def _alert_telegram(self, message: str) -> None:
        """Send an alert to Telegram."""
        if not self._telegram_token or not self._telegram_chat_id:
            logger.warning("telegram_not_configured", message=message)
            return
        try:
            url = f"https://api.telegram.org/bot{self._telegram_token}/sendMessage"
            httpx.post(url, json={"chat_id": self._telegram_chat_id, "text": message}, timeout=10)
        except Exception as exc:
            logger.error("telegram_alert_failed", error=str(exc))

    def _kill_non_essential(self) -> None:
        """Signal to stop non-essential services when budget is exhausted."""
        self.redis.set("budget:kill_non_essential", "1", ex=3600)
        logger.critical("budget_exhausted_killing_non_essential")
