from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.utils.seed_data import seed_database
from backend.app.routers import (
    auth,
    chat,
    assessments,
    documents,
    notices,
    scholarships,
    calendar,
    fees,
    placements,
    admin,
    voice
)

# Initialize DB tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="2.0.0",
    description="Production-Ready Multilingual University AI Assistant & Hybrid RAG Knowledge Platform"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(assessments.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(notices.router, prefix=settings.API_V1_STR)
app.include_router(scholarships.router, prefix=settings.API_V1_STR)
app.include_router(calendar.router, prefix=settings.API_V1_STR)
app.include_router(fees.router, prefix=settings.API_V1_STR)
app.include_router(placements.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(voice.router, prefix=settings.API_V1_STR)

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.on_event("startup")
def on_startup():
    try:
        seed_database()
    except Exception as e:
        print(f"[STARTUP ERROR] Seeding: {e}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": "2.0.0",
        "languages": settings.SUPPORTED_LANGUAGES,
        "providers": {
            "embedding": settings.EMBEDDING_PROVIDER,
            "llm": settings.LLM_PROVIDER
        }
    }

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API. Visit /docs for OpenAPI specifications.",
        "version": "2.0.0"
    }
