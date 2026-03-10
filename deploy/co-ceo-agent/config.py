"""CO-CEO Agent configuration — 10 premium model definitions."""

import os
from dataclasses import dataclass

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    coceo_api_port: int = 8002
    coceo_api_host: str = "0.0.0.0"
    database_url: str = "postgresql://singularity:pass@postgres:5432/singularity"
    redis_url: str = "redis://redis:6379/2"
    qdrant_host: str = "qdrant"
    qdrant_port: int = 6333
    qdrant_collection: str = "singularity_memory"

    openai_api_key: str = ""
    anthropic_api_key: str = ""
    xai_api_key: str = ""
    google_api_key: str = ""
    deepseek_api_key: str = ""
    mistral_api_key: str = ""
    qwen_api_key: str = ""
    serper_api_key: str = ""

    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    crewai_api_url: str = "http://crewai-api:8001"
    n8n_api_url: str = "http://n8n-editor:5678"
    n8n_api_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()


@dataclass
class PremiumModel:
    name: str
    provider: str
    api_key_env: str
    base_url: str
    model_id: str
    cost_per_m_input: float
    cost_per_m_output: float
    context_window: int
    best_for: list[str]


PREMIUM_MODELS: list[PremiumModel] = [
    PremiumModel(
        name="GPT-5.4",
        provider="openai",
        api_key_env="OPENAI_API_KEY",
        base_url="https://api.openai.com/v1",
        model_id="gpt-5.4",
        cost_per_m_input=2.50,
        cost_per_m_output=15.00,
        context_window=1000000,
        best_for=["strategy", "complex_reasoning", "general"],
    ),
    PremiumModel(
        name="Claude-Opus-4.6",
        provider="anthropic",
        api_key_env="ANTHROPIC_API_KEY",
        base_url="https://api.anthropic.com",
        model_id="claude-opus-4-6",
        cost_per_m_input=5.00,
        cost_per_m_output=25.00,
        context_window=1000000,
        best_for=["deep_analysis", "writing", "marketing_copy"],
    ),
    PremiumModel(
        name="Grok-4.1-Fast",
        provider="xai",
        api_key_env="XAI_API_KEY",
        base_url="https://api.x.ai/v1",
        model_id="grok-4.1-fast",
        cost_per_m_input=0.20,
        cost_per_m_output=0.50,
        context_window=2000000,
        best_for=["real_time_data", "large_context", "competitor_intel"],
    ),
    PremiumModel(
        name="o4-mini",
        provider="openai",
        api_key_env="OPENAI_API_KEY",
        base_url="https://api.openai.com/v1",
        model_id="o4-mini",
        cost_per_m_input=1.10,
        cost_per_m_output=4.40,
        context_window=200000,
        best_for=["math", "logic", "hard_reasoning", "financial_analysis"],
    ),
    PremiumModel(
        name="Claude-Sonnet-4.5",
        provider="anthropic",
        api_key_env="ANTHROPIC_API_KEY",
        base_url="https://api.anthropic.com",
        model_id="claude-sonnet-4-5-20250514",
        cost_per_m_input=3.00,
        cost_per_m_output=15.00,
        context_window=200000,
        best_for=["coding", "tool_use", "code_generation"],
    ),
    PremiumModel(
        name="GPT-5-Mini",
        provider="openai",
        api_key_env="OPENAI_API_KEY",
        base_url="https://api.openai.com/v1",
        model_id="gpt-5-mini",
        cost_per_m_input=0.25,
        cost_per_m_output=2.00,
        context_window=400000,
        best_for=["quick_tasks", "general", "fast"],
    ),
    PremiumModel(
        name="Gemini-3.1-Pro",
        provider="google",
        api_key_env="GOOGLE_API_KEY",
        base_url="https://generativelanguage.googleapis.com/v1beta",
        model_id="gemini-3.1-pro",
        cost_per_m_input=2.00,
        cost_per_m_output=12.00,
        context_window=1000000,
        best_for=["multimodal", "image_analysis", "long_context"],
    ),
    PremiumModel(
        name="DeepSeek-V3.2",
        provider="deepseek",
        api_key_env="DEEPSEEK_API_KEY",
        base_url="https://api.deepseek.com/v1",
        model_id="deepseek-chat",
        cost_per_m_input=0.28,
        cost_per_m_output=0.42,
        context_window=128000,
        best_for=["cheap_coding", "batch_processing", "cost_sensitive"],
    ),
    PremiumModel(
        name="Grok-4",
        provider="xai",
        api_key_env="XAI_API_KEY",
        base_url="https://api.x.ai/v1",
        model_id="grok-4",
        cost_per_m_input=3.00,
        cost_per_m_output=15.00,
        context_window=256000,
        best_for=["complex_reasoning", "always_on"],
    ),
    PremiumModel(
        name="Mistral-Medium-3",
        provider="mistral",
        api_key_env="MISTRAL_API_KEY",
        base_url="https://api.mistral.ai/v1",
        model_id="mistral-medium-latest",
        cost_per_m_input=0.40,
        cost_per_m_output=2.00,
        context_window=256000,
        best_for=["eu_compliance", "gdpr", "european"],
    ),
]

TASK_MODEL_MAP: dict[str, str] = {
    "strategy": "GPT-5.4",
    "deep_analysis": "Claude-Opus-4.6",
    "writing": "Claude-Opus-4.6",
    "marketing_copy": "Claude-Opus-4.6",
    "real_time_data": "Grok-4.1-Fast",
    "large_context": "Grok-4.1-Fast",
    "competitor_intel": "Grok-4.1-Fast",
    "math": "o4-mini",
    "logic": "o4-mini",
    "financial_analysis": "o4-mini",
    "coding": "Claude-Sonnet-4.5",
    "code_generation": "Claude-Sonnet-4.5",
    "quick_tasks": "GPT-5-Mini",
    "multimodal": "Gemini-3.1-Pro",
    "image_analysis": "Gemini-3.1-Pro",
    "cheap_coding": "DeepSeek-V3.2",
    "batch_processing": "DeepSeek-V3.2",
    "complex_reasoning": "Grok-4",
    "eu_compliance": "Mistral-Medium-3",
    "general": "GPT-5.4",
}
