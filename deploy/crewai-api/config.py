"""Configuration for CrewAI API — model tiers, budget limits, and service settings."""

import os
from dataclasses import dataclass, field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    crewai_api_port: int = 8001
    crewai_api_host: str = "0.0.0.0"
    crewai_max_rpm: int = 10
    crewai_log_level: str = "info"

    database_url: str = "postgresql://singularity:pass@postgres:5432/singularity"
    redis_url: str = "redis://redis:6379/0"

    qdrant_host: str = "qdrant"
    qdrant_port: int = 6333

    openai_api_key: str = ""
    anthropic_api_key: str = ""
    deepseek_api_key: str = ""
    google_api_key: str = ""
    qwen_api_key: str = ""
    zhipu_api_key: str = ""
    serper_api_key: str = ""

    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    budget_daily_cap_per_provider: float = 25.0
    budget_monthly_hard_cap: float = 83.33
    budget_reload_threshold: float = 10.0

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()


@dataclass
class ModelConfig:
    """Configuration for a single LLM model."""

    name: str
    provider: str
    api_key_env: str
    base_url: str
    model_id: str
    cost_per_m_input: float
    cost_per_m_output: float
    context_window: int
    priority: int
    tier: str


WORKER_MODELS: list[ModelConfig] = [
    ModelConfig(
        name="GLM-4.7-Flash",
        provider="zhipu",
        api_key_env="ZHIPU_API_KEY",
        base_url="https://open.bigmodel.cn/api/paas/v4",
        model_id="glm-4-flash",
        cost_per_m_input=0.0,
        cost_per_m_output=0.0,
        context_window=128000,
        priority=1,
        tier="worker",
    ),
    ModelConfig(
        name="Gemini-2.0-Flash-Lite",
        provider="google",
        api_key_env="GOOGLE_API_KEY",
        base_url="https://generativelanguage.googleapis.com/v1beta",
        model_id="gemini-2.0-flash-lite",
        cost_per_m_input=0.0,
        cost_per_m_output=0.0,
        context_window=1000000,
        priority=2,
        tier="worker",
    ),
    ModelConfig(
        name="DeepSeek-V3.2",
        provider="deepseek",
        api_key_env="DEEPSEEK_API_KEY",
        base_url="https://api.deepseek.com/v1",
        model_id="deepseek-chat",
        cost_per_m_input=0.28,
        cost_per_m_output=0.42,
        context_window=128000,
        priority=3,
        tier="worker",
    ),
    ModelConfig(
        name="Qwen-Flash",
        provider="alibaba",
        api_key_env="QWEN_API_KEY",
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
        model_id="qwen-turbo",
        cost_per_m_input=0.05,
        cost_per_m_output=0.40,
        context_window=1000000,
        priority=4,
        tier="worker",
    ),
    ModelConfig(
        name="GPT-4.1-Nano",
        provider="openai",
        api_key_env="OPENAI_API_KEY",
        base_url="https://api.openai.com/v1",
        model_id="gpt-4.1-nano",
        cost_per_m_input=0.10,
        cost_per_m_output=0.40,
        context_window=1000000,
        priority=5,
        tier="worker",
    ),
]

FALLBACK_MODELS: list[ModelConfig] = [
    ModelConfig(
        name="GPT-5-Mini",
        provider="openai",
        api_key_env="OPENAI_API_KEY",
        base_url="https://api.openai.com/v1",
        model_id="gpt-5-mini",
        cost_per_m_input=0.25,
        cost_per_m_output=2.00,
        context_window=400000,
        priority=6,
        tier="fallback",
    ),
]

CREW_NAMES: list[str] = [
    "market_research",
    "content",
    "sales",
    "ads",
    "support",
    "finance",
    "outreach",
    "social_media",
    "seo",
    "data_enrichment",
]
