"""AI provider service layer.

Every supported provider (OpenAI, Groq, OpenRouter, Together AI, local Ollama)
exposes an OpenAI-compatible /chat/completions endpoint, so a single HTTP
client implementation is enough — only base_url, api_key, and model_name
differ per provider. This is the ONLY file that needs to change (plus
.env) to add a new provider or switch the active one; the routers and
frontend never talk to a provider directly.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass

import httpx

from app.core.config import Settings, get_settings
from app.core.exceptions import (
    InvalidAPIKeyError,
    ProviderRateLimitError,
    ProviderTimeoutError,
    ProviderUnavailableError,
)
from app.models.schemas import Tone
from app.services.prompts import SYSTEM_PROMPT, build_user_prompt


@dataclass(frozen=True)
class ProviderConfig:
    name: str
    base_url: str
    api_key: str
    model: str
    # Ollama runs locally with no key requirement.
    requires_api_key: bool = True


class AIProvider(ABC):
    """Abstract interface every concrete provider client must satisfy."""

    @abstractmethod
    async def rewrite(self, text: str, tone: Tone) -> str: ...

    @property
    @abstractmethod
    def provider_name(self) -> str: ...

    @property
    @abstractmethod
    def model_name(self) -> str: ...


class OpenAICompatibleProvider(AIProvider):
    """Works for OpenAI, Groq, OpenRouter, Together AI, and Ollama alike."""

    def __init__(self, config: ProviderConfig, timeout_seconds: int):
        self._config = config
        self._timeout = timeout_seconds

    @property
    def provider_name(self) -> str:
        return self._config.name

    @property
    def model_name(self) -> str:
        return self._config.model

    async def rewrite(self, text: str, tone: Tone) -> str:
        headers = {"Content-Type": "application/json"}
        if self._config.api_key:
            headers["Authorization"] = f"Bearer {self._config.api_key}"

        payload = {
            "model": self._config.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(text, tone)},
            ],
            "temperature": 0.6,
        }

        url = f"{self._config.base_url.rstrip('/')}/chat/completions"

        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(url, json=payload, headers=headers)
        except httpx.TimeoutException as exc:
            raise ProviderTimeoutError(
                f"{self._config.name} did not respond in time."
            ) from exc
        except httpx.RequestError as exc:
            raise ProviderUnavailableError(
                f"Could not reach {self._config.name}. Check your network connection."
            ) from exc

        if response.status_code == 401:
            raise InvalidAPIKeyError(
                f"{self._config.name} rejected the configured API key."
            )
        if response.status_code == 429:
            raise ProviderRateLimitError(
                f"{self._config.name} rate limit reached. Please try again shortly."
            )
        if response.status_code >= 500:
            raise ProviderUnavailableError(
                f"{self._config.name} is currently unavailable."
            )
        if response.status_code >= 400:
            raise ProviderUnavailableError(
                f"{self._config.name} returned an unexpected error "
                f"({response.status_code})."
            )

        data = response.json()
        try:
            content: str = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise ProviderUnavailableError(
                f"{self._config.name} returned an unexpected response format."
            ) from exc

        return content.strip()


def _resolve_provider_config(settings: Settings) -> ProviderConfig:
    provider = settings.ai_provider

    if provider == "openai":
        return ProviderConfig(
            name="OpenAI",
            base_url=settings.openai_base_url,
            api_key=settings.openai_api_key,
            model=settings.model_name,
        )
    if provider == "groq":
        return ProviderConfig(
            name="Groq",
            base_url=settings.groq_base_url,
            api_key=settings.groq_api_key,
            model=settings.groq_model_name,
        )
    if provider == "openrouter":
        return ProviderConfig(
            name="OpenRouter",
            base_url=settings.openrouter_base_url,
            api_key=settings.openrouter_api_key,
            model=settings.openrouter_model_name,
        )
    if provider == "together":
        return ProviderConfig(
            name="Together AI",
            base_url=settings.together_base_url,
            api_key=settings.together_api_key,
            model=settings.together_model_name,
        )
    if provider == "ollama":
        return ProviderConfig(
            name="Ollama (local)",
            base_url=settings.ollama_base_url,
            api_key="",
            model=settings.ollama_model_name,
            requires_api_key=False,
        )

    raise ValueError(f"Unknown AI provider: {provider}")


def get_ai_provider(settings: Settings | None = None) -> AIProvider:
    """Factory used by the router (and tests) to obtain the active provider.

    Swapping providers is a one-line .env change (AI_PROVIDER=groq, etc.) —
    nothing in routers/ or the frontend needs to know which one is active.
    """
    settings = settings or get_settings()
    config = _resolve_provider_config(settings)
    return OpenAICompatibleProvider(config, timeout_seconds=settings.request_timeout_seconds)
