from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "JANEGAS Dashboard API"
    API_PREFIX: str = "/api"
    
    # Database Configuration
    # Defaults to local SQLite file for development.
    # In production, this can be overridden by the DATABASE_URL environment variable.
    DATABASE_URL: str = "sqlite:///./database.db"
    
    # Security
    SECRET_KEY: str = "janegas-secret-key-community-biogas-energy-transition"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # Gemini AI Configuration
    GEMINI_API_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

