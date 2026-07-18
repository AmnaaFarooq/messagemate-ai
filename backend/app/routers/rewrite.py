from fastapi import APIRouter, Depends, Request

from app.core.config import Settings, get_settings
from app.core.exceptions import EmptyMessageError, MessageTooLongError
from app.core.limiter import limiter
from app.models.schemas import RewriteRequest, RewriteResponse
from app.services.ai_provider import get_ai_provider

router = APIRouter(tags=["rewrite"])


@router.post("/api/rewrite", response_model=RewriteResponse)
@limiter.limit(lambda: f"{get_settings().rate_limit_per_minute}/minute")
async def rewrite_message(
    request: Request,
    body: RewriteRequest,
    settings: Settings = Depends(get_settings),
) -> RewriteResponse:
    if not body.text:
        raise EmptyMessageError("Message cannot be empty.")
    if len(body.text) > settings.max_input_characters:
        raise MessageTooLongError(
            f"Message exceeds the {settings.max_input_characters}-character limit."
        )

    provider = get_ai_provider(settings)
    result = await provider.rewrite(body.text, body.tone)
    return RewriteResponse(result=result)
