"""
API Key Management Endpoints.

Allows users to create, list, and revoke their API keys.
"""

from typing import Optional

import structlog
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from src.services.auth import create_api_key, APIKeyAuth, verify_api_key
from src.db.supabase import (
    list_user_api_keys,
    revoke_api_key as db_revoke_api_key,
    get_or_create_user,
    get_or_create_user_by_supabase_id,
)

logger = structlog.get_logger()

router = APIRouter()


# =============================================================================
# Request/Response Models
# =============================================================================


class CreateAPIKeyRequest(BaseModel):
    """Request to create a new API key."""

    name: str = Field(
        default="Default Key",
        min_length=1,
        max_length=100,
        description="Friendly name for the API key",
    )
    email: str = Field(
        ...,
        description="User email address (for key ownership)",
    )
    user_id: Optional[str] = Field(
        default=None,
        description="Supabase Auth user ID (if authenticated via dashboard)",
    )


class CreateAPIKeyResponse(BaseModel):
    """Response after creating an API key."""

    id: str = Field(..., description="API key ID")
    name: str = Field(..., description="Friendly name")
    key: str = Field(
        ...,
        description="The raw API key. SAVE THIS NOW - it will not be shown again!",
    )
    key_prefix: str = Field(..., description="Key prefix for identification")
    message: str = Field(
        default="API key created successfully. Save this key now - it will not be shown again!",
    )


class APIKeyInfo(BaseModel):
    """Information about an API key (without the actual key)."""

    id: str
    name: str
    key_prefix: str
    created_at: str
    last_used_at: Optional[str] = None


class ListAPIKeysResponse(BaseModel):
    """Response listing user's API keys."""

    keys: list[APIKeyInfo]
    total: int


class RevokeAPIKeyRequest(BaseModel):
    """Request to revoke an API key."""

    key_id: str = Field(..., description="ID of the key to revoke")


# =============================================================================
# Endpoints
# =============================================================================


@router.post(
    "/keys",
    response_model=CreateAPIKeyResponse,
    summary="Create a New API Key",
    description="""
    Generate a new API key for authenticating with the Shield API.

    **Important**: The raw API key is only returned ONCE in this response.
    You must save it immediately - it cannot be retrieved later.

    The key is stored as a SHA-256 hash in the database for security.
    """,
)
async def create_key(request: CreateAPIKeyRequest) -> CreateAPIKeyResponse:
    """
    Create a new API key.

    This endpoint creates a new API key for the given email.
    If the user doesn't exist, they are created automatically.

    If user_id is provided (from Supabase Auth), it uses that directly.
    """
    try:
        # Get or create user
        if request.user_id:
            # User is authenticated via Supabase Auth on the dashboard
            user = await get_or_create_user_by_supabase_id(request.user_id, request.email)
        else:
            # Legacy: create user by email only
            user = await get_or_create_user(request.email)
        user_id = user["id"]

        # Generate the API key
        raw_key = await create_api_key(
            user_id=user_id,
            name=request.name,
        )

        # Get the key prefix
        key_prefix = raw_key[:7]

        logger.info(
            "API key created via endpoint",
            user_id=user_id,
            key_prefix=key_prefix,
        )

        return CreateAPIKeyResponse(
            id=user_id,  # Return user_id as id for simplicity
            name=request.name,
            key=raw_key,
            key_prefix=key_prefix,
        )

    except Exception as e:
        logger.error("Failed to create API key", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create API key: {str(e)}",
        )


@router.get(
    "/keys/user/{user_id}",
    response_model=ListAPIKeysResponse,
    summary="List User's API Keys (Dashboard)",
    description="""
    List all active API keys for a specific user (dashboard use).

    This endpoint is used by the dashboard when the user is authenticated
    via Supabase Auth.
    """,
)
async def list_keys_by_user(user_id: str) -> ListAPIKeysResponse:
    """List all API keys for a user (dashboard endpoint)."""
    try:
        keys = await list_user_api_keys(user_id)

        return ListAPIKeysResponse(
            keys=[
                APIKeyInfo(
                    id=k["id"],
                    name=k["name"],
                    key_prefix=k["key_prefix"],
                    created_at=k["created_at"],
                    last_used_at=k.get("last_used_at"),
                )
                for k in keys
            ],
            total=len(keys),
        )

    except Exception as e:
        logger.error("Failed to list API keys for user", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list API keys: {str(e)}",
        )


@router.get(
    "/keys",
    response_model=ListAPIKeysResponse,
    summary="List Your API Keys",
    description="""
    List all active API keys for the authenticated user.

    **Authentication Required**: Include `X-API-Key` header.

    Note: Only key metadata is returned - the actual keys are not retrievable.
    """,
)
async def list_keys(
    auth: APIKeyAuth = Depends(verify_api_key),
) -> ListAPIKeysResponse:
    """List all API keys for the authenticated user."""
    try:
        keys = await list_user_api_keys(auth.user_id)

        return ListAPIKeysResponse(
            keys=[
                APIKeyInfo(
                    id=k["id"],
                    name=k["name"],
                    key_prefix=k["key_prefix"],
                    created_at=k["created_at"],
                    last_used_at=k.get("last_used_at"),
                )
                for k in keys
            ],
            total=len(keys),
        )

    except Exception as e:
        logger.error("Failed to list API keys", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list API keys: {str(e)}",
        )


@router.delete(
    "/keys/user/{user_id}/{key_id}",
    summary="Revoke an API Key (Dashboard)",
    description="""
    Revoke (delete) an API key from the dashboard.

    This endpoint is used by the dashboard when the user is authenticated
    via Supabase Auth.
    """,
)
async def revoke_key_dashboard(
    user_id: str,
    key_id: str,
) -> dict:
    """Revoke an API key from the dashboard."""
    try:
        success = await db_revoke_api_key(key_id=key_id, user_id=user_id)

        if not success:
            raise HTTPException(
                status_code=404,
                detail="API key not found or already revoked",
            )

        logger.info(
            "API key revoked via dashboard",
            key_id=key_id,
            user_id=user_id,
        )

        return {
            "status": "revoked",
            "key_id": key_id,
            "message": "API key has been revoked and can no longer be used.",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to revoke API key", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to revoke API key: {str(e)}",
        )


@router.delete(
    "/keys/{key_id}",
    summary="Revoke an API Key",
    description="""
    Revoke (delete) an API key. This action cannot be undone.

    **Authentication Required**: Include `X-API-Key` header.

    You can only revoke keys that belong to your account.
    """,
)
async def revoke_key(
    key_id: str,
    auth: APIKeyAuth = Depends(verify_api_key),
) -> dict:
    """Revoke an API key."""
    try:
        success = await db_revoke_api_key(key_id=key_id, user_id=auth.user_id)

        if not success:
            raise HTTPException(
                status_code=404,
                detail="API key not found or already revoked",
            )

        logger.info(
            "API key revoked",
            key_id=key_id,
            user_id=auth.user_id,
        )

        return {
            "status": "revoked",
            "key_id": key_id,
            "message": "API key has been revoked and can no longer be used.",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to revoke API key", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to revoke API key: {str(e)}",
        )


@router.get(
    "/keys/me",
    summary="Get Current Key Info",
    description="Get information about the API key used for this request.",
)
async def get_current_key(
    auth: APIKeyAuth = Depends(verify_api_key),
) -> dict:
    """Get info about the currently authenticated key."""
    return {
        "key_id": auth.key_id,
        "key_name": auth.key_name,
        "key_prefix": auth.key_prefix,
        "user_id": auth.user_id,
    }
