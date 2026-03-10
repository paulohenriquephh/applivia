"""Base crew class — all 10 crews inherit from this."""

import os
from abc import ABC, abstractmethod
from typing import Any

import httpx
import structlog

logger = structlog.get_logger()


class BaseCrew(ABC):
    """Abstract base class for all CrewAI crews."""

    DESCRIPTION: str = "Base crew"
    AGENT_NAMES: list[str] = []

    def __init__(self, llm_router: Any = None):
        self.llm_router = llm_router
        self._telegram_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self._telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID", "")
        self._serper_key = os.getenv("SERPER_API_KEY", "")

    @abstractmethod
    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        """Execute the crew's primary task pipeline. Must return a result dict."""

    def _llm_call(self, prompt: str, system_prompt: str = "", task_type: str = "general") -> dict[str, Any]:
        """Synchronous wrapper for LLM router calls."""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    result = pool.submit(
                        asyncio.run,
                        self.llm_router.call(prompt, task_type=task_type, system_prompt=system_prompt)
                    ).result()
            else:
                result = asyncio.run(
                    self.llm_router.call(prompt, task_type=task_type, system_prompt=system_prompt)
                )
        except Exception as exc:
            logger.error("llm_call_failed", error=str(exc))
            return {"text": f"LLM call failed: {exc}", "model": "none", "cost": 0.0}

        return {
            "text": result.text,
            "model": result.model,
            "cost": result.cost,
            "latency_ms": result.latency_ms,
        }

    def _search_web(self, query: str, num_results: int = 10) -> list[dict[str, str]]:
        """Search the web using Serper API."""
        if not self._serper_key:
            return [{"title": "Search unavailable", "snippet": "SERPER_API_KEY not configured", "link": ""}]
        try:
            resp = httpx.post(
                "https://google.serper.dev/search",
                headers={"X-API-KEY": self._serper_key, "Content-Type": "application/json"},
                json={"q": query, "num": num_results},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            results = []
            for item in data.get("organic", [])[:num_results]:
                results.append({
                    "title": item.get("title", ""),
                    "snippet": item.get("snippet", ""),
                    "link": item.get("link", ""),
                })
            return results
        except Exception as exc:
            logger.error("search_failed", query=query, error=str(exc))
            return [{"title": "Search error", "snippet": str(exc), "link": ""}]

    def _send_telegram(self, message: str) -> bool:
        """Send a message to Telegram."""
        if not self._telegram_token or not self._telegram_chat_id:
            logger.warning("telegram_not_configured")
            return False
        try:
            url = f"https://api.telegram.org/bot{self._telegram_token}/sendMessage"
            resp = httpx.post(url, json={
                "chat_id": self._telegram_chat_id,
                "text": message,
                "parse_mode": "Markdown",
            }, timeout=10)
            return resp.status_code == 200
        except Exception as exc:
            logger.error("telegram_send_failed", error=str(exc))
            return False

    def _call_n8n_webhook(self, path: str, data: dict[str, Any]) -> dict[str, Any]:
        """Trigger an n8n workflow via webhook."""
        try:
            resp = httpx.post(
                f"http://n8n-webhooks:5678/webhook/{path}",
                json=data,
                timeout=30,
            )
            resp.raise_for_status()
            return resp.json()
        except Exception as exc:
            logger.error("n8n_webhook_failed", path=path, error=str(exc))
            return {"error": str(exc)}
