from enum import Enum

from pydantic import BaseModel, Field, field_validator


class Tone(str, Enum):
    PROFESSIONAL = "professional"
    FRIENDLY = "friendly"
    FORMAL = "formal"
    BOSS = "boss"
    CLIENT = "client"
    SHORTER = "shorter"
    LONGER = "longer"
    MORE_POLITE = "more_polite"
    MORE_CONFIDENT = "more_confident"


class RewriteRequest(BaseModel):
    text: str = Field(..., description="The original, informal message to rewrite.")
    tone: Tone = Field(..., description="The target tone/transformation to apply.")

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class RewriteResponse(BaseModel):
    result: str


class HealthResponse(BaseModel):
    status: str
    provider: str
    model: str


class ErrorResponse(BaseModel):
    error: str
    detail: str
