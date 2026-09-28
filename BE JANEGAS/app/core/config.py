from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Elpis Smart Supply-Demand System"
    API_V1_STR: str = "/api/v1"
    
    # Database Configuration
    # Defaults to local SQLite file for development.
    # In Vercel, this will be overridden by the DATABASE_URL environment variable (PostgreSQL)
    DATABASE_URL: str = "sqlite:///./database.db"
    
    # Security (Placeholder for JWT Auth)
    SECRET_KEY: str = "supersecretkeyforelpisstartupdemandforecastingsystem"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # Gemini AI Configuration
    GEMINI_API_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

