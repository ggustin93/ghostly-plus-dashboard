# Testing Workflow

> **WORK IN PROGRESS**: This testing strategy is currently being implemented.
> 
> Memory Bank remains the single source of truth.

## Current Test Structure

```
tests/
├── backend/unit/      # FastAPI endpoint and service tests
├── e2e/specs/         # Playwright browser tests
└── README.md          # General testing guidance
```

## Run Commands

```bash
# Backend Tests
cd backend && python -m pytest

# E2E Tests
npm run test:e2e       # Headless
npm run test:e2e:ui    # With UI
```

## Backend Testing Patterns

```python
# Endpoint test
def test_endpoint():
    client = TestClient(app)
    response = client.get("/api/health")
    assert response.status_code == 200

# Auth test with mocked JWT verification
def test_protected_endpoint():
    with patch("app.auth.verify_jwt", return_value={"sub": "user-id", "role": "therapist"}):
        response = client.get(
            "/api/protected", 
            headers={"Authorization": "Bearer dummy-token"}
        )
        assert response.status_code == 200

# DB test with mocked query response
def test_data_retrieval():
    with patch("app.db.queries.get_data", return_value={"id": "123", "name": "Test"}):
        response = client.get("/api/data/123")
        assert "id" in response.json()
```

## Implementation Priority

1. **Backend Unit Tests**: Critical API endpoints (auth, patient data) ← Current focus
2. **E2E Tests**: Core user flows (login, patient view)
3. **Frontend Unit Tests**: Planned for post-MVP

## Principles

- **Test critical paths first** (auth flow, data retrieval)
- **Mock external dependencies** (Supabase, databases)
- **Focus on user-facing correctness** over implementation details 