"""Task-type based premium model router for CO-CEO agent."""

import os
import time
from typing import Optional

import httpx
import structlog

from config import PREMIUM_MODELS, TASK_MODEL_MAP, PremiumModel, settings

logger = structlog.get_logger()


class COCEORouter:
    """Routes requests to the best premium model based on task type."""

    def __init__(self):
        self._models = {m.name: m for m in PREMIUM_MODELS}

    def get_model_for_task(self, task_type: str) -> PremiumModel:
        """Select the best model for a given task type."""
        model_name = TASK_MODEL_MAP.get(task_type, "GPT-5.4")
        model = self._models.get(model_name)
        if not model:
            model = PREMIUM_MODELS[0]
        return model

    async def call(self, prompt: str, task_type: str = "general",
                   system_prompt: str = "", model_override: Optional[str] = None) -> dict:
        """Call the best model for the task type."""
        if model_override and model_override in self._models:
            model = self._models[model_override]
        else:
            model = self.get_model_for_task(task_type)

        api_key = os.getenv(model.api_key_env, "")
        if not api_key:
            for fallback in PREMIUM_MODELS:
                api_key = os.getenv(fallback.api_key_env, "")
                if api_key:
                    model = fallback
                    break
            if not api_key:
                return {"text": "No API key configured for any model", "model": "none",
                        "cost": 0.0, "latency_ms": 0}

        start = time.monotonic()

        try:
            if model.provider == "anthropic":
                result = await self._call_anthropic(model, prompt, system_prompt, api_key)
            elif model.provider == "google":
                result = await self._call_google(model, prompt, system_prompt, api_key)
            else:
                result = await self._call_openai_compatible(model, prompt, system_prompt, api_key)

            elapsed = int((time.monotonic() - start) * 1000)
            result["latency_ms"] = elapsed
            result["model"] = model.name
            logger.info("coceo_call_success", model=model.name, task_type=task_type, latency_ms=elapsed)
            return result

        except Exception as exc:
            logger.error("coceo_call_failed", model=model.name, error=str(exc))
            for fallback in PREMIUM_MODELS:
                if fallback.name == model.name:
                    continue
                fb_key = os.getenv(fallback.api_key_env, "")
                if not fb_key:
                    continue
                try:
                    if fallback.provider == "anthropic":
                        result = await self._call_anthropic(fallback, prompt, system_prompt, fb_key)
                    elif fallback.provider == "google":
                        result = await self._call_google(fallback, prompt, system_prompt, fb_key)
                    else:
                        result = await self._call_openai_compatible(fallback, prompt, system_prompt, fb_key)
                    elapsed = int((time.monotonic() - start) * 1000)
                    result["latency_ms"] = elapsed
                    result["model"] = fallback.name
                    return result
                except Exception:
                    continue

            return {"text": f"All models failed. Last error: {exc}", "model": "none",
                    "cost": 0.0, "latency_ms": 0}

    async def _call_openai_compatible(self, model: PremiumModel, prompt: str,
                                       system_prompt: str, api_key: str) -> dict:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{model.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={"model": model.model_id, "messages": messages, "max_tokens": 8192, "temperature": 0.7},
                timeout=60,
            )
            resp.raise_for_status()
            data = resp.json()

        usage = data.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        cost = (input_tokens * model.cost_per_m_input + output_tokens * model.cost_per_m_output) / 1_000_000

        return {
            "text": data["choices"][0]["message"]["content"],
            "cost": round(cost, 6),
            "tokens_input": input_tokens,
            "tokens_output": output_tokens,
        }

    async def _call_anthropic(self, model: PremiumModel, prompt: str,
                               system_prompt: str, api_key: str) -> dict:
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model.model_id,
            "max_tokens": 8192,
            "messages": [{"role": "user", "content": prompt}],
        }
        if system_prompt:
            payload["system"] = system_prompt

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{model.base_url}/v1/messages",
                headers=headers,
                json=payload,
                timeout=60,
            )
            resp.raise_for_status()
            data = resp.json()

        usage = data.get("usage", {})
        input_tokens = usage.get("input_tokens", 0)
        output_tokens = usage.get("output_tokens", 0)
        cost = (input_tokens * model.cost_per_m_input + output_tokens * model.cost_per_m_output) / 1_000_000

        text = ""
        for block in data.get("content", []):
            if block.get("type") == "text":
                text += block.get("text", "")

        return {"text": text, "cost": round(cost, 6), "tokens_input": input_tokens, "tokens_output": output_tokens}

    async def _call_google(self, model: PremiumModel, prompt: str,
                            system_prompt: str, api_key: str) -> dict:
        contents = []
        if system_prompt:
            contents.append({"role": "user", "parts": [{"text": system_prompt}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I will follow these instructions."}]})
        contents.append({"role": "user", "parts": [{"text": prompt}]})

        url = f"{model.base_url}/models/{model.model_id}:generateContent?key={api_key}"

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                url,
                json={"contents": contents, "generationConfig": {"maxOutputTokens": 8192, "temperature": 0.7}},
                timeout=60,
            )
            resp.raise_for_status()
            data = resp.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"]
        usage = data.get("usageMetadata", {})
        input_tokens = usage.get("promptTokenCount", 0)
        output_tokens = usage.get("candidatesTokenCount", 0)
        cost = (input_tokens * model.cost_per_m_input + output_tokens * model.cost_per_m_output) / 1_000_000

        return {"text": text, "cost": round(cost, 6), "tokens_input": input_tokens, "tokens_output": output_tokens}

    def list_models(self) -> list[dict]:
        """List all available models with their configurations."""
        result = []
        for m in PREMIUM_MODELS:
            has_key = bool(os.getenv(m.api_key_env, ""))
            result.append({
                "name": m.name,
                "provider": m.provider,
                "model_id": m.model_id,
                "cost_per_m_input": m.cost_per_m_input,
                "cost_per_m_output": m.cost_per_m_output,
                "context_window": m.context_window,
                "best_for": m.best_for,
                "available": has_key,
            })
        return result
