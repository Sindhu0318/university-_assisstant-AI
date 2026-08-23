import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "University AI Assistant"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super-secret-university-jwt-key-2026-secure-random-token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./university_assistant.db")
    
    # AI / LLM Configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    EMBEDDING_PROVIDER: str = os.getenv("EMBEDDING_PROVIDER", "hybrid_local") # 'gemini', 'openai', 'hybrid_local'
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini_or_grounded") # 'gemini', 'openai', 'gemini_or_grounded'
    
    # Storage & Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = 25
    
    # Multilingual & Voice
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: list[str] = ["en", "te", "hi"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
