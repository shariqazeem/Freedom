"""
SQLite database for blacklist management.

This module provides a lightweight, file-based blacklist storage
for checking addresses and programs against known malicious entities.
"""

import sqlite3
from contextlib import contextmanager
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Generator, Optional

import structlog

from src.models.blacklist import BlacklistEntry, BlacklistType

logger = structlog.get_logger()


class BlacklistDB:
    """
    SQLite-based blacklist database.

    Provides fast lookups for address and program blacklisting,
    with an in-memory cache for hot entries.
    """

    def __init__(self, db_path: str = "data/blacklist.db"):
        """
        Initialize the blacklist database.

        Args:
            db_path: Path to the SQLite database file
        """
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

        # In-memory cache for fast lookups
        self._address_cache: set[str] = set()
        self._program_cache: set[str] = set()

        self._init_db()
        self._load_cache()
        self._seed_initial_data()

    @contextmanager
    def _get_connection(self) -> Generator[sqlite3.Connection, None, None]:
        """Get a database connection with row factory."""
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self) -> None:
        """Initialize database schema."""
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS blacklist (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    value TEXT NOT NULL UNIQUE,
                    reason TEXT NOT NULL,
                    source TEXT DEFAULT 'manual',
                    severity TEXT DEFAULT 'high',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,
                    active INTEGER DEFAULT 1
                )
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_blacklist_value
                ON blacklist(value)
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_blacklist_type
                ON blacklist(type)
            """)
            conn.commit()
            logger.info("Blacklist database initialized", db_path=str(self.db_path))

    def _load_cache(self) -> None:
        """Load active blacklist entries into memory cache."""
        with self._get_connection() as conn:
            cursor = conn.execute(
                "SELECT type, value FROM blacklist WHERE active = 1"
            )
            for row in cursor:
                if row["type"] == BlacklistType.ADDRESS.value:
                    self._address_cache.add(row["value"])
                elif row["type"] == BlacklistType.PROGRAM.value:
                    self._program_cache.add(row["value"])

        logger.info(
            "Blacklist cache loaded",
            addresses=len(self._address_cache),
            programs=len(self._program_cache),
        )

    def _seed_initial_data(self) -> None:
        """Seed the database with known malicious addresses."""
        known_malicious = [
            # Known drainer contracts and wallets (example data)
            {
                "type": BlacklistType.ADDRESS,
                "value": "DrainWa11etXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "reason": "Known drainer wallet - multiple theft incidents",
                "source": "community",
                "severity": "critical",
            },
            {
                "type": BlacklistType.ADDRESS,
                "value": "Scam4ddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "reason": "Reported scam address - phishing operation",
                "source": "community",
                "severity": "critical",
            },
            {
                "type": BlacklistType.ADDRESS,
                "value": "Ma1ici0usXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "reason": "Malicious contract - rug pull associated",
                "source": "automated",
                "severity": "high",
            },
            {
                "type": BlacklistType.PROGRAM,
                "value": "EvilPr0gramXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "reason": "Malicious program - funds extraction",
                "source": "security_audit",
                "severity": "critical",
            },
            # Test address for rogue agent simulation
            {
                "type": BlacklistType.ADDRESS,
                "value": "TestB1acklistAddressXXXXXXXXXXXXXXXXXXXXXX",
                "reason": "Test blacklist address for simulation",
                "source": "testing",
                "severity": "high",
            },
        ]

        for entry in known_malicious:
            try:
                self.add_entry(
                    entry_type=entry["type"],
                    value=entry["value"],
                    reason=entry["reason"],
                    source=entry["source"],
                    severity=entry["severity"],
                )
            except sqlite3.IntegrityError:
                # Entry already exists
                pass

    def is_blacklisted(self, address: str) -> bool:
        """
        Check if an address is blacklisted.

        Uses in-memory cache for O(1) lookup.

        Args:
            address: The address to check

        Returns:
            True if the address is blacklisted
        """
        return address in self._address_cache

    def is_program_blacklisted(self, program_id: str) -> bool:
        """
        Check if a program ID is blacklisted.

        Args:
            program_id: The program ID to check

        Returns:
            True if the program is blacklisted
        """
        return program_id in self._program_cache

    def get_entry(self, value: str) -> Optional[BlacklistEntry]:
        """
        Get detailed information about a blacklist entry.

        Args:
            value: The address or program ID to look up

        Returns:
            BlacklistEntry if found, None otherwise
        """
        with self._get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM blacklist WHERE value = ? AND active = 1",
                (value,),
            )
            row = cursor.fetchone()
            if row:
                return BlacklistEntry(
                    id=row["id"],
                    type=BlacklistType(row["type"]),
                    value=row["value"],
                    reason=row["reason"],
                    source=row["source"],
                    severity=row["severity"],
                    created_at=datetime.fromisoformat(row["created_at"]),
                    updated_at=(
                        datetime.fromisoformat(row["updated_at"])
                        if row["updated_at"]
                        else None
                    ),
                    active=bool(row["active"]),
                )
        return None

    def add_entry(
        self,
        entry_type: BlacklistType,
        value: str,
        reason: str,
        source: str = "manual",
        severity: str = "high",
    ) -> BlacklistEntry:
        """
        Add a new entry to the blacklist.

        Args:
            entry_type: Type of entry (address or program)
            value: The value to blacklist
            reason: Reason for blacklisting
            source: Source of this entry
            severity: Severity level

        Returns:
            The created BlacklistEntry
        """
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO blacklist (type, value, reason, source, severity)
                VALUES (?, ?, ?, ?, ?)
                """,
                (entry_type.value, value, reason, source, severity),
            )
            conn.commit()
            entry_id = cursor.lastrowid

            # Update cache
            if entry_type == BlacklistType.ADDRESS:
                self._address_cache.add(value)
            elif entry_type == BlacklistType.PROGRAM:
                self._program_cache.add(value)

            logger.info(
                "Blacklist entry added",
                type=entry_type.value,
                value=value[:20] + "...",
                source=source,
            )

            return BlacklistEntry(
                id=entry_id,
                type=entry_type,
                value=value,
                reason=reason,
                source=source,
                severity=severity,
                created_at=datetime.utcnow(),
                active=True,
            )

    def remove_entry(self, value: str) -> bool:
        """
        Remove (deactivate) a blacklist entry.

        Args:
            value: The value to remove from blacklist

        Returns:
            True if entry was removed
        """
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                UPDATE blacklist
                SET active = 0, updated_at = CURRENT_TIMESTAMP
                WHERE value = ? AND active = 1
                """,
                (value,),
            )
            conn.commit()

            if cursor.rowcount > 0:
                self._address_cache.discard(value)
                self._program_cache.discard(value)
                logger.info("Blacklist entry removed", value=value[:20] + "...")
                return True
            return False

    def list_entries(
        self,
        entry_type: Optional[BlacklistType] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[BlacklistEntry]:
        """
        List blacklist entries with optional filtering.

        Args:
            entry_type: Filter by type
            limit: Maximum entries to return
            offset: Offset for pagination

        Returns:
            List of BlacklistEntry objects
        """
        with self._get_connection() as conn:
            if entry_type:
                cursor = conn.execute(
                    """
                    SELECT * FROM blacklist
                    WHERE type = ? AND active = 1
                    ORDER BY created_at DESC
                    LIMIT ? OFFSET ?
                    """,
                    (entry_type.value, limit, offset),
                )
            else:
                cursor = conn.execute(
                    """
                    SELECT * FROM blacklist
                    WHERE active = 1
                    ORDER BY created_at DESC
                    LIMIT ? OFFSET ?
                    """,
                    (limit, offset),
                )

            return [
                BlacklistEntry(
                    id=row["id"],
                    type=BlacklistType(row["type"]),
                    value=row["value"],
                    reason=row["reason"],
                    source=row["source"],
                    severity=row["severity"],
                    created_at=datetime.fromisoformat(row["created_at"]),
                    updated_at=(
                        datetime.fromisoformat(row["updated_at"])
                        if row["updated_at"]
                        else None
                    ),
                    active=bool(row["active"]),
                )
                for row in cursor
            ]

    def count_entries(self, entry_type: Optional[BlacklistType] = None) -> int:
        """Count total blacklist entries."""
        with self._get_connection() as conn:
            if entry_type:
                cursor = conn.execute(
                    "SELECT COUNT(*) FROM blacklist WHERE type = ? AND active = 1",
                    (entry_type.value,),
                )
            else:
                cursor = conn.execute(
                    "SELECT COUNT(*) FROM blacklist WHERE active = 1"
                )
            return cursor.fetchone()[0]


# Singleton instance
_blacklist_db: Optional[BlacklistDB] = None


@lru_cache
def get_blacklist_db() -> BlacklistDB:
    """Get the singleton blacklist database instance."""
    global _blacklist_db
    if _blacklist_db is None:
        _blacklist_db = BlacklistDB()
    return _blacklist_db
