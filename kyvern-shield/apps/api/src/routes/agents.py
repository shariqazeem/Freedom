"""Agent management endpoints."""

from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

router = APIRouter()


# =============================================================================
# Request/Response Models
# =============================================================================


class AgentConfigRequest(BaseModel):
    """Agent configuration request."""

    max_transaction_value: int = Field(ge=0, description="Max transaction value in lamports")
    daily_spend_limit: int = Field(ge=0, description="Daily spending limit in lamports")
    allowed_programs: List[str] = Field(default_factory=list)
    blocked_programs: List[str] = Field(default_factory=list)
    approval_threshold: int = Field(ge=0, description="Require approval above this value")
    circuit_breaker_enabled: bool = True
    anomaly_threshold: int = Field(default=5, ge=1, le=100)


class AgentCreateRequest(BaseModel):
    """Request to register a new agent."""

    name: str = Field(min_length=1, max_length=100)
    wallet_address: str = Field(min_length=32, max_length=44)
    config: AgentConfigRequest


class AgentResponse(BaseModel):
    """Agent response model."""

    id: UUID
    name: str
    wallet_address: str
    status: str
    config: AgentConfigRequest
    created_at: datetime
    last_active_at: datetime


class AgentListResponse(BaseModel):
    """Paginated list of agents."""

    agents: List[AgentResponse]
    total: int
    page: int
    page_size: int


# =============================================================================
# Endpoints
# =============================================================================


@router.post("", response_model=AgentResponse, status_code=201)
async def register_agent(request: AgentCreateRequest) -> dict[str, Any]:
    """Register a new agent for monitoring."""
    # TODO: Implement actual database storage
    now = datetime.utcnow()
    return {
        "id": uuid4(),
        "name": request.name,
        "wallet_address": request.wallet_address,
        "status": "active",
        "config": request.config.model_dump(),
        "created_at": now,
        "last_active_at": now,
    }


@router.get("", response_model=AgentListResponse)
async def list_agents(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status: Optional[str] = None,
) -> dict[str, Any]:
    """List all registered agents."""
    # TODO: Implement actual database query
    return {
        "agents": [],
        "total": 0,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: UUID) -> dict[str, Any]:
    """Get a specific agent by ID."""
    # TODO: Implement actual database lookup
    raise HTTPException(status_code=404, detail="Agent not found")


@router.patch("/{agent_id}/status")
async def update_agent_status(agent_id: UUID, status: str) -> dict[str, Any]:
    """Update agent status (pause, resume, terminate)."""
    valid_statuses = ["active", "paused", "suspended", "terminated"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    # TODO: Implement actual status update
    return {"id": agent_id, "status": status, "updated_at": datetime.utcnow()}


@router.put("/{agent_id}/config")
async def update_agent_config(agent_id: UUID, config: AgentConfigRequest) -> dict[str, Any]:
    """Update agent configuration."""
    # TODO: Implement actual config update
    return {"id": agent_id, "config": config.model_dump(), "updated_at": datetime.utcnow()}


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(agent_id: UUID) -> None:
    """Delete an agent registration."""
    # TODO: Implement actual deletion
    pass


@router.post("/{agent_id}/circuit-breaker/trigger")
async def trigger_circuit_breaker(agent_id: UUID, reason: str = "manual") -> dict[str, Any]:
    """Manually trigger circuit breaker for an agent."""
    # TODO: Implement circuit breaker trigger
    return {
        "id": agent_id,
        "circuit_breaker": {
            "state": "open",
            "triggered_at": datetime.utcnow(),
            "reason": reason,
        },
    }


@router.post("/{agent_id}/circuit-breaker/reset")
async def reset_circuit_breaker(agent_id: UUID) -> dict[str, Any]:
    """Reset circuit breaker for an agent."""
    # TODO: Implement circuit breaker reset
    return {
        "id": agent_id,
        "circuit_breaker": {
            "state": "closed",
            "reset_at": datetime.utcnow(),
        },
    }
