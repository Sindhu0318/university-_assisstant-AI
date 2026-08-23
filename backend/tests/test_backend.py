import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import SessionLocal
from backend.app.services.rag_engine import run_rag_pipeline
from backend.app.services.query_router import classify_query

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_auth_login():
    res = client.post("/api/auth/login", json={
        "email": "student@university.edu",
        "password": "Student@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "student"

def test_structured_assessments():
    res = client.get("/api/assessments?module=AAA")
    assert res.status_code == 200
    assessments = res.json()
    assert len(assessments) > 0
    assert assessments[0]["code_module"] == "AAA"

def test_notices_api():
    res = client.get("/api/notices")
    assert res.status_code == 200
    assert len(res.json()) > 0

def test_scholarships_api():
    res = client.get("/api/scholarships")
    assert res.status_code == 200
    assert len(res.json()) > 0

def test_query_router_intent():
    res1 = classify_query("What is the attendance requirement?")
    assert res1["intent"] == "attendance_policy"

    res2 = classify_query("Show me assessments for module AAA")
    assert res2["intent"] == "assessments_structured"
    assert res2["module_code"] == "AAA"

def test_rag_attendance_grounding():
    db = SessionLocal()
    try:
        result = run_rag_pipeline(db, "What happens if my attendance is below 75%?", preferred_language="en")
        assert "75%" in result["answer"] or "condonation" in result["answer"].lower()
        assert len(result["sources"]) > 0
    finally:
        db.close()

def test_rag_multilingual_telugu():
    db = SessionLocal()
    try:
        result = run_rag_pipeline(db, "హాజరు శాతం ఎంత ఉండాలి?", preferred_language="te")
        assert result["language"] == "te"
        assert len(result["sources"]) > 0
    finally:
        db.close()

def test_rag_hallucination_resistance():
    db = SessionLocal()
    try:
        result = run_rag_pipeline(db, "What is the secret recipe of Martian pie on Jupiter?", preferred_language="en")
        assert "couldn't find this information" in result["answer"] or len(result["sources"]) == 0
    finally:
        db.close()
