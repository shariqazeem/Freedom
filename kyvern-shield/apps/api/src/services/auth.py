"""
Authentication Service.

Handles API key generation, hashing, and verification.
Implements secure key generation with SHA-256 hashing.
"""

import hashlib
import secrets
from typing import Optional

import structlog
from fastapi import Depends, HTTPException, Security, Request
from fastapi.security import APIKeyHeader

from src.config import settings
from src.db.supabase import (
    get_api_key_by_hash,
    store_api_key,
    update_api_key_last_used,
    log_api_key_usage,
)

logger = structlog.get_logger()

# =============================================================================
# Constants
# =============================================================================

API_KEY_PREFIX = "sk_live_kyvern_"
API_KEY_LENGTH = 32  # Length of random part (after prefix)


# =============================================================================
# Security Scheme
# =============================================================================

api_key_header = APIKeyHeader(
    name=settings.api_key_header,
    auto_error=False,
    description="API key for authentication. Format: sk_live_kyvern_xxxxx",
)


# =============================================================================
# Key Generation & Hashing
# =============================================================================


def generate_api_key() -> str:
    """
    Generate a new secure API key.

    Format: sk_live_kyvern_<32 random alphanumeric chars>

    Returns:
        Raw API key string. This is the ONLY time the raw key is available.
    """
    random_part = secrets.token_urlsafe(API_KEY_LENGTH)[:API_KEY_LENGTH]
    return f"{API_KEY_PREFIX}{random_part}"


def hash_api_key(api_key: str) -> str:
    """
    Hash an API key using SHA-256.

    Args:
        api_key: Raw API key string.

    Returns:
        Hex-encoded SHA-256 hash of the key.
    """
    return hashlib.sha256(api_key.encode()).hexdigest()


def get_key_prefix(api_key: str) -> str:
    """
    Get the prefix of an API key for identification.

    Args:
        api_key: Raw API key string.

    Returns:
        First 7 characters of the key (e.g., "sk_live").
    """
    return api_key[:7] if len(api_key) >= 7 else api_key


# =============================================================================
# API Key Management
# =============================================================================


async def create_api_key(user_id: str, name: str = "Default Key") -> str:
    """
    Create a new API key for a user.

    Generates a secure random key, hashes it, and stores the hash in the database.
    The raw key is returned ONLY ONCE and should be shown to the user immediately.

    Args:
        user_id: UUID of the user.
        name: Friendly name for the key.

    Returns:
        Raw API key string. Store this securely - it cannot be retrieved later.

    Raises:
        ValueError: If key creation fails.
    """
    # Generate new key
    raw_key = generate_api_key()

    # Hash for storage
    key_hash = hash_api_key(raw_key)
    key_prefix = get_key_prefix(raw_key)

    # Store in database
    await store_api_key(
        user_id=user_id,
        key_hash=key_hash,
        key_prefix=key_prefix,
        name=name,
    )

    logger.info(
        "API key created",
        user_id=user_id,
        key_prefix=key_prefix,
        name=name,
    )

    return raw_key


# =============================================================================
# API Key Verification (FastAPI Dependency)
# =============================================================================


class APIKeyAuth:
    """
    Verified API key context.

    Contains information about the authenticated key/user.
    """

    def __init__(
        self,
        key_id: str,
        user_id: str,
        key_name: str,
        key_prefix: str,
    ):
        self.key_id = key_id
        self.user_id = user_id
        self.key_name = key_name
        self.key_prefix = key_prefix

    def __repr__(self) -> str:
        return f"APIKeyAuth(key_prefix={self.key_prefix}, user_id={self.user_id[:8]}...)"


async def verify_api_key(
    request: Request,
    api_key: Optional[str] = Security(api_key_header),
) -> APIKeyAuth:
    """
    FastAPI dependency to verify API key authentication.

    Extracts the API key from the X-API-Key header, hashes it,
    and verifies it exists in the database.

    Args:
        request: FastAPI request object.
        api_key: API key from header (auto-extracted).

    Returns:
        APIKeyAuth object with key/user information.

    Raises:
        HTTPException: 401 if key is missing or invalid.
    """
    if not api_key:
        logger.warning("API request without key", path=request.url.path)
        raise HTTPException(
            status_code=401,
            detail="API key required. Include X-API-Key header.",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    # Validate key format
    if not api_key.startswith(API_KEY_PREFIX):
        logger.warning(
            "Invalid API key format",
            prefix=api_key[:10] if len(api_key) > 10 else "***",
        )
        raise HTTPException(
            status_code=401,
            detail="Invalid API key format. Keys must start with 'sk_live_kyvern_'.",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    # Hash and lookup
    key_hash = hash_api_key(api_key)
    key_record = await get_api_key_by_hash(key_hash)

    if not key_record:
        logger.warning(
            "API key not found or revoked",
            prefix=get_key_prefix(api_key),
        )
        raise HTTPException(
            status_code=401,
            detail="Invalid or revoked API key.",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    # Update last used timestamp (fire and forget)
    try:
        await update_api_key_last_used(key_record["id"])
    except Exception:
        pass  # Don't fail the request if this fails

    # Log usage (fire and forget)
    try:
        await log_api_key_usage(
            api_key_id=key_record["id"],
            endpoint=request.url.path,
            request_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
    except Exception:
        pass

    logger.debug(
        "API key verified",
        key_id=key_record["id"],
        user_id=key_record["user_id"],
    )

    return APIKeyAuth(
        key_id=key_record["id"],
        user_id=key_record["user_id"],
        key_name=key_record["name"],
        key_prefix=key_record["key_prefix"],
    )


# =============================================================================
# Optional: Soft Authentication (for public + authenticated endpoints)
# =============================================================================


async def optional_api_key(
    request: Request,
    api_key: Optional[str] = Security(api_key_header),
) -> Optional[APIKeyAuth]:
    """
    Optional API key verification.

    Use this for endpoints that work both with and without authentication,
    but may provide additional features when authenticated.

    Args:
        request: FastAPI request object.
        api_key: API key from header (auto-extracted).

    Returns:
        APIKeyAuth object if key is valid, None otherwise.
    """
    if not api_key:
        return None

    try:
        return await verify_api_key(request, api_key)
    except HTTPException:
        return None


# =============================================================================
# Rate Limiting Helper (Future Enhancement)
# =============================================================================


async def check_rate_limit(auth: APIKeyAuth) -> bool:
    """
    Check if the API key has exceeded its rate limit.

    TODO: Implement rate limiting based on api_key_usage table.

    Args:
        auth: Verified API key context.

    Returns:
        True if within limits, raises HTTPException if exceeded.
    """
    # Placeholder - implement rate limiting logic
    # Query api_key_usage for recent requests and compare to limits
    return True
