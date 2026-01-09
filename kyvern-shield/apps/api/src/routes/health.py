"""Health check endpoints."""

from datetime import datetime
from typing import Any

from fastapi import APIRouter

from src.services.circuit_breaker import get_circuit_breaker
from src.config import settings

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
    checks = {
        "api": "ok",
    }

    # Check Circuit Breaker / Solana connection
    if settings.enable_onchain_recording:
        try:
            circuit_breaker = await get_circuit_breaker()
            cb_health = await circuit_breaker.health_check()
            checks["solana"] = cb_health.get("status", "unknown")
            checks["circuit_breaker_program"] = "deployed" if cb_health.get("program_deployed") else "not_found"
        except Exception as e:
            checks["solana"] = f"error: {str(e)[:50]}"
    else:
        checks["solana"] = "disabled"

    overall_status = "ready" if all(v == "ok" or v == "healthy" or v == "deployed" or v == "disabled" for v in checks.values()) else "degraded"

    return {
        "status": overall_status,
        "timestamp": datetime.utcnow().isoformat(),
        "checks": checks,
    }


@router.get("/health/live")
async def liveness_check() -> dict[str, str]:
    """Liveness check endpoint."""
    return {"status": "alive"}


@router.get("/health/circuit-breaker")
async def circuit_breaker_health() -> dict[str, Any]:
    """
    Detailed Circuit Breaker / Solana integration health check.

    Returns status of:
    - Solana RPC connection
    - Circuit Breaker program deployment
    - Authority keypair configuration
    """
    if not settings.enable_onchain_recording:
        return {
            "status": "disabled",
            "message": "On-chain recording is disabled",
            "enable_onchain_recording": False,
        }

    try:
        circuit_breaker = await get_circuit_breaker()
        health = await circuit_breaker.health_check()
        return {
            "status": health.get("status", "unknown"),
            "solana_connected": health.get("solana_connected", False),
            "program_deployed": health.get("program_deployed", False),
            "program_id": health.get("program_id"),
            "rpc_url": health.get("rpc_url"),
            "authority_configured": health.get("authority_configured", False),
            "enable_onchain_recording": True,
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "enable_onchain_recording": True,
        }
