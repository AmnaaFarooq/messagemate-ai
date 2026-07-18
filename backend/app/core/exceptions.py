"""Domain-specific exceptions.

These are caught in main.py's exception handlers and translated into
friendly, consistent JSON error responses for the frontend.
"""


class MessageMateError(Exception):
    """Base class for all application-specific errors."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class InvalidAPIKeyError(MessageMateError):
    """Raised when the configured provider rejects our credentials."""


class ProviderRateLimitError(MessageMateError):
    """Raised when the upstream AI provider itself rate-limits us."""


class ProviderTimeoutError(MessageMateError):
    """Raised when the upstream AI provider does not respond in time."""


class ProviderUnavailableError(MessageMateError):
    """Raised for network failures or 5xx responses from the provider."""


class EmptyMessageError(MessageMateError):
    """Raised when the user submits an empty or whitespace-only message."""


class MessageTooLongError(MessageMateError):
    """Raised when the user's message exceeds the configured character limit."""
