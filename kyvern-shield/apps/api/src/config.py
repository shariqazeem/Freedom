"""Application configuration."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "Kyvern Shield API"
    debug: bool = False
    environment: str = "development"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://shield.kyvernlabs.com",
    ]

    # Database (Legacy - PostgreSQL direct connection)
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/kyvern_shield"

    # Supabase (Primary database for API keys)
    supabase_url: str = ""  # e.g., https://xxxxx.supabase.co
    supabase_service_key: str = ""  # Service role key (bypasses RLS)
    supabase_anon_key: str = ""  # Anonymous key (for client-side, respects RLS)

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Solana
    solana_rpc_url: str = "https://api.mainnet-beta.solana.com"
    solana_ws_url: str = "wss://api.mainnet-beta.solana.com"

    # Security
    api_key_header: str = "X-API-Key"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Rate limiting
    rate_limit_requests: int = 100
    rate_limit_window_seconds: int = 60

    # Analysis
    anomaly_detection_threshold: float = 0.85
    max_transaction_analysis_batch: int = 100

    # Ollama LLM
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"
    ollama_timeout: float = 30.0

    # Shield Analysis
    max_transaction_amount_sol: float = 10.0
    daily_transaction_limit_sol: float = 100.0
    auto_block_risk_threshold: int = 80
    auto_allow_risk_threshold: int = 20


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
