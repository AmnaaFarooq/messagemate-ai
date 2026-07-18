import httpx
import respx


def _mock_completion_response(text: str = "Rewritten message.") -> dict:
    return {
        "choices": [{"message": {"content": text}}],
    }


@respx.mock
def test_rewrite_success(client):
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=httpx.Response(200, json=_mock_completion_response("Hello, I am unwell today."))
    )

    response = client.post(
        "/api/rewrite",
        json={"text": "cant come im sick", "tone": "professional"},
    )

    assert response.status_code == 200
    assert response.json() == {"result": "Hello, I am unwell today."}


def test_rewrite_rejects_empty_message(client):
    response = client.post("/api/rewrite", json={"text": "   ", "tone": "professional"})
    assert response.status_code == 400
    assert response.json()["error"] == "EmptyMessageError"


def test_rewrite_rejects_invalid_tone(client):
    response = client.post("/api/rewrite", json={"text": "hello", "tone": "not-a-real-tone"})
    assert response.status_code == 422


@respx.mock
def test_rewrite_handles_invalid_api_key(client):
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=httpx.Response(401, json={"error": "invalid api key"})
    )

    response = client.post("/api/rewrite", json={"text": "hello there", "tone": "formal"})
    assert response.status_code == 401
    assert response.json()["error"] == "InvalidAPIKeyError"


@respx.mock
def test_rewrite_handles_provider_rate_limit(client):
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=httpx.Response(429, json={"error": "rate limited"})
    )

    response = client.post("/api/rewrite", json={"text": "hello there", "tone": "friendly"})
    assert response.status_code == 429
    assert response.json()["error"] == "ProviderRateLimitError"


@respx.mock
def test_rewrite_handles_provider_downtime(client):
    respx.post("https://api.openai.com/v1/chat/completions").mock(
        return_value=httpx.Response(503, json={"error": "unavailable"})
    )

    response = client.post("/api/rewrite", json={"text": "hello there", "tone": "boss"})
    assert response.status_code == 502
    assert response.json()["error"] == "ProviderUnavailableError"


def test_rewrite_rejects_message_too_long(client, monkeypatch):
    from app.core import config

    config.get_settings.cache_clear()
    monkeypatch.setenv("MAX_INPUT_CHARACTERS", "10")
    config.get_settings.cache_clear()

    response = client.post(
        "/api/rewrite",
        json={"text": "this message is definitely longer than ten characters", "tone": "professional"},
    )
    assert response.status_code == 413
    config.get_settings.cache_clear()
