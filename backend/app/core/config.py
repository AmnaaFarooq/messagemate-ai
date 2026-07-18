"""Application configuration.

All runtime configuration is read from environment variables (see .env.example
in the project root). Nothing provider-specific is hardcoded here — the
provider itself is selected via AI_PROVIDER and the service layer in
app/services/ maps that to a concrete client.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

Provider = Literal["openai", "groq", "openrouter", "together", "ollama"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- AI provider selection -------------------------------------------------
    ai_provider: Provider = "openai"

    # Generic OpenAI-compatible credentials. Every supported provider speaks
    # the OpenAI /chat/completions wire format, so one client implementation
    # covers all of them — only the base URL, key, and model name change.
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    model_name: str = "gpt-4o-mini"

    groq_api_key: str = ""
    groq_base_url: str = "https://api.groq.com/openai/v1"
    groq_model_name: str = "llama-3.3-70b-versatile"

    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model_name: str = "openai/gpt-4o-mini"

    together_api_key: str = ""
    together_base_url: str = "https://api.together.xyz/v1"
    together_model_name: str = "meta-llama/Llama-3.3-70B-Instruct-Turbo"

    ollama_base_url: str = "http://localhost:11434/v1"
    ollama_model_name: str = "llama3.1"

    # --- App behaviour -----------------------------------------------------
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    rate_limit_per_minute: int = 20
    request_timeout_seconds: int = 30
    max_input_characters: int = 4000
    environment: str = "development"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
