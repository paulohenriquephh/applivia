"""Cascading LLM router with budget-aware model selection for worker tiers."""

import os
import time
from dataclasses import dataclass

import httpx
import structlog

from budget_tracker import BudgetTracker
from config import FALLBACK_MODELS, WORKER_MODELS, ModelConfig, settings

logger = structlog.get_logger()


@dataclass
class LLMResult:
    text: str
    model: str
    cost: float
    latency_ms: int
    tokens_input: int
    tokens_output: int


class AllModelsExhausted(Exception):
    """Raised when no model is available to handle the request."""


class LLMRouter:
    """Cascading LLM router with budget-aware model selection."""

    def __init__(self, tier: str = "worker"):
        self.budget = BudgetTracker(settings.redis_url)
        if tier == "worker":
            self.models = WORKER_MODELS + FALLBACK_MODELS
        else:
            self.models = FALLBACK_MODELS

    async def call(self, prompt: str, task_type: str = "general",
                   min_context: int = 4096, system_prompt: str = "") -> LLMResult:
        """Try models in priority order until one succeeds."""
        errors: list[str] = []
        for model in self.models:
            if model.context_window < min_context:
                continue
            if not self.budget.can_spend(model.name):
                logger.info("budget_exhausted_for_model", model=model.name)
                continue

            api_key = os.getenv(model.api_key_env, "")
            if not api_key:
                continue

            try:
                result = await self._api_call(model, prompt, system_prompt, api_key, timeout=30)
                cost = self.budget.log_spend(model.name, result.tokens_input, result.tokens_output)
                result.cost = cost
                return result
            except Exception as exc:
                err_msg = f"{model.name}: {exc}"
                errors.append(err_msg)
                logger.warning("model_call_failed", model=model.name, error=str(exc))
                continue

        raise AllModelsExhausted(f"No available model. Errors: {'; '.join(errors)}")

    async def _api_call(self, model: ModelConfig, prompt: str,
                        system_prompt: str, api_key: str, timeout: int = 30) -> LLMResult:
        """Make an API call to the given model using OpenAI-compatible format."""
        start = time.monotonic()
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model.model_id,
            "messages": messages,
            "max_tokens": 4096,
            "temperature": 0.7,
        }

        if model.provider == "google":
            return await self._call_google(model, messages, api_key, timeout, start)

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{model.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=timeout,
            )
            resp.raise_for_status()
            data = resp.json()

        elapsed = int((time.monotonic() - start) * 1000)
        choice = data["choices"][0]
        usage = data.get("usage", {})

        return LLMResult(
            text=choice["message"]["content"],
            model=model.name,
            cost=0.0,
            latency_ms=elapsed,
            tokens_input=usage.get("prompt_tokens", 0),
            tokens_output=usage.get("completion_tokens", 0),
        )

    async def _call_google(self, model: ModelConfig, messages: list[dict],
                           api_key: str, timeout: int, start: float) -> LLMResult:
        """Handle Google Gemini API which uses a different format."""
        contents = []
        for msg in messages:
            role = "user" if msg["role"] in ("user", "system") else "model"
            contents.append({"role": role, "parts": [{"text": msg["content"]}]})

        url = (
            f"{model.base_url}/models/{model.model_id}:generateContent"
            f"?key={api_key}"
        )
        payload = {
            "contents": contents,
            "generationConfig": {"maxOutputTokens": 4096, "temperature": 0.7},
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, timeout=timeout)
            resp.raise_for_status()
            data = resp.json()

        elapsed = int((time.monotonic() - start) * 1000)
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        usage = data.get("usageMetadata", {})

        return LLMResult(
            text=text,
            model=model.name,
            cost=0.0,
            latency_ms=elapsed,
            tokens_input=usage.get("promptTokenCount", 0),
            tokens_output=usage.get("candidatesTokenCount", 0),
        )
