"""
Supabase Database Client.

Handles connection to Supabase PostgreSQL for API key management.
Uses the supabase-py client library.
"""

from functools import lru_cache
from typing import Optional

import structlog
from supabase import create_client, Client

from src.config import settings

logger = structlog.get_logger()


class SupabaseClient:
    """Singleton wrapper for Supabase client."""

    _instance: Optional[Client] = None
    _initialized: bool = False

    @classmethod
    def get_client(cls) -> Client:
        """
        Get or create the Supabase client instance.

        Uses service_role key for backend operations (bypasses RLS).
        """
        if cls._instance is None:
            if not settings.supabase_url or not settings.supabase_service_key:
                raise ValueError(
                    "Supabase credentials not configured. "
                    "Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables."
                )

            cls._instance = create_client(
                settings.supabase_url,
                settings.supabase_service_key,
            )
            cls._initialized = True
            logger.info("Supabase client initialized", url=settings.supabase_url[:30] + "...")

        return cls._instance

    @classmethod
    def is_initialized(cls) -> bool:
        """Check if the client has been initialized."""
        return cls._initialized

    @classmethod
    def reset(cls) -> None:
        """Reset the client (for testing)."""
        cls._instance = None
        cls._initialized = False


@lru_cache
def get_supabase() -> Client:
    """
    Get the Supabase client.

    This is the primary way to access Supabase in the application.

    Returns:
        Supabase client instance.

    Raises:
        ValueError: If Supabase credentials are not configured.
    """
    return SupabaseClient.get_client()


# =============================================================================
# Database Operations
# =============================================================================


async def create_user(email: str) -> dict:
    """
    Create a new user in the database.

    Args:
        email: User's email address.

    Returns:
        Created user record.
    """
    client = get_supabase()

    result = client.table("users").insert({"email": email}).execute()

    if not result.data:
        raise ValueError("Failed to create user")

    logger.info("User created", email=email)
    return result.data[0]


async def get_user_by_email(email: str) -> Optional[dict]:
    """
    Get a user by email address.

    Args:
        email: User's email address.

    Returns:
        User record or None if not found.
    """
    client = get_supabase()

    result = client.table("users").select("*").eq("email", email).execute()

    return result.data[0] if result.data else None


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Get a user by ID.

    Args:
        user_id: User's UUID.

    Returns:
        User record or None if not found.
    """
    client = get_supabase()

    result = client.table("users").select("*").eq("id", user_id).execute()

    return result.data[0] if result.data else None


async def get_or_create_user(email: str) -> dict:
    """
    Get existing user or create a new one.

    Args:
        email: User's email address.

    Returns:
        User record.
    """
    user = await get_user_by_email(email)
    if user:
        return user
    return await create_user(email)


# =============================================================================
# API Key Database Operations
# =============================================================================


async def store_api_key(
    user_id: str,
    key_hash: str,
    key_prefix: str,
    name: str = "Default Key",
) -> dict:
    """
    Store a new API key hash in the database.

    Args:
        user_id: UUID of the user.
        key_hash: SHA-256 hash of the API key.
        key_prefix: First 7 characters of the key (for display).
        name: Friendly name for the key.

    Returns:
        Created API key record (without the hash).
    """
    client = get_supabase()

    result = client.table("api_keys").insert({
        "user_id": user_id,
        "key_hash": key_hash,
        "key_prefix": key_prefix,
        "name": name,
    }).execute()

    if not result.data:
        raise ValueError("Failed to store API key")

    key_record = result.data[0]
    logger.info(
        "API key stored",
        key_id=key_record["id"],
        user_id=user_id,
        prefix=key_prefix,
    )

    # Return without the hash for security
    return {
        "id": key_record["id"],
        "name": key_record["name"],
        "key_prefix": key_record["key_prefix"],
        "created_at": key_record["created_at"],
    }


async def get_api_key_by_hash(key_hash: str) -> Optional[dict]:
    """
    Look up an API key by its hash.

    Args:
        key_hash: SHA-256 hash of the API key.

    Returns:
        API key record or None if not found/revoked.
    """
    client = get_supabase()

    result = (
        client.table("api_keys")
        .select("id, user_id, name, key_prefix, created_at, last_used_at")
        .eq("key_hash", key_hash)
        .is_("revoked_at", "null")
        .execute()
    )

    return result.data[0] if result.data else None


async def update_api_key_last_used(key_id: str) -> None:
    """
    Update the last_used_at timestamp for an API key.

    Args:
        key_id: UUID of the API key.
    """
    client = get_supabase()

    client.table("api_keys").update({
        "last_used_at": "now()",
    }).eq("id", key_id).execute()


async def list_user_api_keys(user_id: str) -> list[dict]:
    """
    List all active API keys for a user.

    Args:
        user_id: UUID of the user.

    Returns:
        List of API key records (without hashes).
    """
    client = get_supabase()

    result = (
        client.table("api_keys")
        .select("id, name, key_prefix, created_at, last_used_at")
        .eq("user_id", user_id)
        .is_("revoked_at", "null")
        .order("created_at", desc=True)
        .execute()
    )

    return result.data


async def revoke_api_key(key_id: str, user_id: str) -> bool:
    """
    Revoke an API key (soft delete).

    Args:
        key_id: UUID of the API key.
        user_id: UUID of the user (for authorization).

    Returns:
        True if key was revoked, False if not found or already revoked.
    """
    client = get_supabase()

    result = (
        client.table("api_keys")
        .update({"revoked_at": "now()"})
        .eq("id", key_id)
        .eq("user_id", user_id)
        .is_("revoked_at", "null")
        .execute()
    )

    if result.data:
        logger.info("API key revoked", key_id=key_id, user_id=user_id)
        return True

    return False


async def log_api_key_usage(
    api_key_id: str,
    endpoint: str,
    request_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
    response_status: Optional[int] = None,
    response_time_ms: Optional[float] = None,
) -> None:
    """
    Log API key usage for analytics and rate limiting.

    Args:
        api_key_id: UUID of the API key.
        endpoint: The endpoint that was called.
        request_ip: Client IP address.
        user_agent: Client user agent.
        response_status: HTTP response status code.
        response_time_ms: Response time in milliseconds.
    """
    client = get_supabase()

    try:
        client.table("api_key_usage").insert({
            "api_key_id": api_key_id,
            "endpoint": endpoint,
            "request_ip": request_ip,
            "user_agent": user_agent,
            "response_status": response_status,
            "response_time_ms": response_time_ms,
        }).execute()
    except Exception as e:
        # Don't fail the request if usage logging fails
        logger.warning("Failed to log API key usage", error=str(e))
