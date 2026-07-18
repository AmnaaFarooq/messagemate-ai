from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.models.schemas import HealthResponse
from app.services.ai_provider import get_ai_provider

router = APIRouter(tags=["health"])


@router.get("/api/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    provider = get_ai_provider(settings)
    return HealthResponse(status="ok", provider=provider.provider_name, model=provider.model_name)
