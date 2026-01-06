"""Blacklist data models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class BlacklistType(str, Enum):
    """Type of blacklist entry."""

    ADDRESS = "address"  # Blacklisted wallet address
    PROGRAM = "program"  # Blacklisted program ID
    PATTERN = "pattern"  # Blacklisted pattern (regex)


class BlacklistEntry(BaseModel):
    """A blacklist entry in the database."""

    id: int = Field(description="Database ID")
    type: BlacklistType = Field(description="Type of blacklist entry")
    value: str = Field(description="The blacklisted value (address, program ID, or pattern)")
    reason: str = Field(description="Reason for blacklisting")
    source: str = Field(
        default="manual",
        description="Source of the blacklist entry (manual, community, automated)",
    )
    severity: str = Field(
        default="high",
        description="Severity level: low, medium, high, critical",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the entry was created",
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        description="When the entry was last updated",
    )
    active: bool = Field(
        default=True,
        description="Whether this blacklist entry is active",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": 1,
                    "type": "address",
                    "value": "DrainWa11etXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                    "reason": "Known drainer wallet - multiple theft incidents reported",
                    "source": "community",
                    "severity": "critical",
                    "active": True,
                }
            ]
        }
    }


class BlacklistAddRequest(BaseModel):
    """Request to add a new blacklist entry."""

    type: BlacklistType = Field(description="Type of entry to add")
    value: str = Field(min_length=1, description="Value to blacklist")
    reason: str = Field(min_length=10, description="Reason for blacklisting")
    source: str = Field(default="manual", description="Source of this entry")
    severity: str = Field(default="high", description="Severity level")


class BlacklistResponse(BaseModel):
    """Response when querying blacklist."""

    entries: list[BlacklistEntry] = Field(description="List of blacklist entries")
    total: int = Field(description="Total number of entries")
