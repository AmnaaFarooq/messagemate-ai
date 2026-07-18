import os

os.environ.setdefault("OPENAI_API_KEY", "test-key")
os.environ.setdefault("AI_PROVIDER", "openai")

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
