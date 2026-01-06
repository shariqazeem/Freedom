"""Health check endpoints."""

from datetime import datetime
from typing import Any

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, Any]:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "0.1.0",
    }


@router.get("/health/ready")
async def readiness_check() -> dict[str, Any]:
    """Readiness check endpoint."""
    # TODO: Check database, redis, solana connections
    return {
        "status": "ready",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {
            "database": "ok",
            "redis": "ok",
            "solana": "ok",
        },
    }


@router.get("/health/live")
async def liveness_check() -> dict[str, str]:
    """Liveness check endpoint."""
    return {"status": "alive"}
