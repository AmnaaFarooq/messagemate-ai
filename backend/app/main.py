from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import get_settings
from app.core.exceptions import (
    EmptyMessageError,
    InvalidAPIKeyError,
    MessageMateError,
    MessageTooLongError,
    ProviderRateLimitError,
    ProviderTimeoutError,
    ProviderUnavailableError,
)
from app.core.limiter import limiter
from app.routers import health, rewrite

settings = get_settings()

app = FastAPI(
    title="MessageMate AI",
    description="Rewrite informal messages into professional communication.",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(rewrite.router)


# --- Friendly, consistent error responses -----------------------------------

_ERROR_STATUS_MAP: dict[type[MessageMateError], int] = {
    EmptyMessageError: 400,
    MessageTooLongError: 413,
    InvalidAPIKeyError: 401,
    ProviderRateLimitError: 429,
    ProviderTimeoutError: 504,
    ProviderUnavailableError: 502,
}


@app.exception_handler(MessageMateError)
async def messagemate_error_handler(request: Request, exc: MessageMateError) -> JSONResponse:
    status_code = _ERROR_STATUS_MAP.get(type(exc), 500)
    return JSONResponse(
        status_code=status_code,
        content={"error": exc.__class__.__name__, "detail": exc.message},
    )


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"error": "InternalServerError", "detail": "Something went wrong. Please try again."},
    )
