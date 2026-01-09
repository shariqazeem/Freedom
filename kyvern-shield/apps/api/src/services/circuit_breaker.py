"""
On-chain Circuit Breaker Integration.

This module provides integration with the Kyvern Shield Circuit Breaker
program deployed on Solana. It allows the API to:
1. Initialize shields for AI agents
2. Record transactions on-chain
3. Trigger/reset circuit breakers
4. Query shield state
"""

import asyncio
import base64
import json
from dataclasses import dataclass
from enum import IntEnum
from pathlib import Path
from typing import Optional

import structlog
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.transaction import Transaction
from solders.pubkey import Pubkey
from solders.system_program import ID as SYSTEM_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta

from src.config import settings

logger = structlog.get_logger()

# Circuit Breaker Program ID (deployed to devnet)
CIRCUIT_BREAKER_PROGRAM_ID = Pubkey.from_string("6sqKVnqGaXxxBejFWRrAWv62wAaGUDedDYvm1mx1yH7J")

# Instruction discriminators (first 8 bytes of sha256 hash of instruction name)
INITIALIZE_DISCRIMINATOR = bytes([175, 175, 109, 31, 13, 152, 155, 237])
RECORD_TRANSACTION_DISCRIMINATOR = bytes([68, 82, 242, 174, 248, 87, 187, 249])
TRIGGER_CIRCUIT_BREAKER_DISCRIMINATOR = bytes([45, 201, 96, 95, 82, 107, 133, 233])
RESET_CIRCUIT_BREAKER_DISCRIMINATOR = bytes([171, 22, 69, 234, 168, 34, 81, 160])


class CircuitState(IntEnum):
    """On-chain circuit breaker states."""
    CLOSED = 0      # Normal operation
    OPEN = 1        # Tripped - blocking all transactions
    HALF_OPEN = 2   # Cooldown expired, testing


@dataclass
class ShieldConfig:
    """Configuration for a Shield account."""
    max_transaction_value: int = 10_000_000_000  # 10 SOL in lamports
    daily_spend_limit: int = 100_000_000_000     # 100 SOL
    approval_threshold: int = 5_000_000_000      # 5 SOL
    anomaly_threshold: int = 3                    # 3 strikes
    time_window_seconds: int = 3600              # 1 hour
    cooldown_seconds: int = 3600                 # 1 hour cooldown


@dataclass
class ShieldState:
    """Current state of a Shield account."""
    authority: str
    agent_wallet: str
    state: CircuitState
    anomaly_count: int
    total_transactions: int
    blocked_transactions: int
    last_triggered_at: int
    cooldown_ends_at: int


@dataclass
class OnChainResult:
    """Result of an on-chain operation."""
    success: bool
    signature: Optional[str] = None
    error: Optional[str] = None
    shield_pda: Optional[str] = None


class CircuitBreakerService:
    """
    Service for interacting with the on-chain Circuit Breaker program.

    This service allows the Shield API to record decisions on-chain,
    providing trustless verification of security decisions.
    """

    def __init__(
        self,
        rpc_url: str = None,
        authority_keypair: Keypair = None,
    ):
        """
        Initialize the Circuit Breaker service.

        Args:
            rpc_url: Solana RPC URL (defaults to settings)
            authority_keypair: Keypair for signing transactions
        """
        self.rpc_url = rpc_url or settings.solana_rpc_url
        self.client: Optional[AsyncClient] = None
        self.authority = authority_keypair
        self._initialized = False

        logger.info(
            "Circuit Breaker service created",
            rpc_url=self.rpc_url,
            program_id=str(CIRCUIT_BREAKER_PROGRAM_ID),
        )

    async def initialize(self) -> None:
        """Initialize the Solana client connection."""
        if self._initialized:
            return

        self.client = AsyncClient(self.rpc_url, commitment=Confirmed)

        # Load authority keypair from settings if not provided
        if self.authority is None and settings.solana_authority_keypair:
            try:
                keypair_bytes = json.loads(settings.solana_authority_keypair)
                self.authority = Keypair.from_bytes(bytes(keypair_bytes))
                logger.info(
                    "Authority keypair loaded",
                    pubkey=str(self.authority.pubkey()),
                )
            except Exception as e:
                logger.warning("Failed to load authority keypair", error=str(e))

        self._initialized = True
        logger.info("Circuit Breaker service initialized")

    async def close(self) -> None:
        """Close the Solana client connection."""
        if self.client:
            await self.client.close()
            self._initialized = False

    def get_shield_pda(self, agent_wallet: str) -> tuple[Pubkey, int]:
        """
        Derive the Shield PDA for an agent wallet.

        Args:
            agent_wallet: The agent's wallet address

        Returns:
            Tuple of (PDA pubkey, bump seed)
        """
        agent_pubkey = Pubkey.from_string(agent_wallet)
        return Pubkey.find_program_address(
            [b"shield", bytes(agent_pubkey)],
            CIRCUIT_BREAKER_PROGRAM_ID,
        )

    async def get_shield_state(self, agent_wallet: str) -> Optional[ShieldState]:
        """
        Get the current state of a Shield account.

        Args:
            agent_wallet: The agent's wallet address

        Returns:
            ShieldState if exists, None otherwise
        """
        await self.initialize()

        shield_pda, _ = self.get_shield_pda(agent_wallet)

        try:
            response = await self.client.get_account_info(shield_pda)
            if response.value is None:
                return None

            # Parse the account data
            data = response.value.data
            if len(data) < 100:
                return None

            # Skip 8-byte discriminator
            offset = 8

            # Parse fields (simplified - actual parsing depends on exact layout)
            authority = Pubkey.from_bytes(data[offset:offset+32])
            offset += 32

            agent = Pubkey.from_bytes(data[offset:offset+32])
            offset += 32

            # Skip config (variable length)
            # For now, just return basic info
            return ShieldState(
                authority=str(authority),
                agent_wallet=str(agent),
                state=CircuitState.CLOSED,  # Would need full parsing
                anomaly_count=0,
                total_transactions=0,
                blocked_transactions=0,
                last_triggered_at=0,
                cooldown_ends_at=0,
            )

        except Exception as e:
            logger.error("Failed to get shield state", error=str(e))
            return None

    async def record_transaction(
        self,
        agent_wallet: str,
        signature: bytes,
        program_id: str,
        value: int,
        tx_type: int = 0,
    ) -> OnChainResult:
        """
        Record a transaction on-chain for audit trail.

        Args:
            agent_wallet: The agent's wallet address
            signature: Transaction signature (64 bytes)
            program_id: Target program ID
            value: Transaction value in lamports
            tx_type: Transaction type identifier

        Returns:
            OnChainResult with success status and signature
        """
        await self.initialize()

        if self.authority is None:
            return OnChainResult(
                success=False,
                error="Authority keypair not configured",
            )

        shield_pda, bump = self.get_shield_pda(agent_wallet)

        try:
            # Check if shield exists
            shield_state = await self.get_shield_state(agent_wallet)
            if shield_state is None:
                logger.info("Shield not initialized for agent", agent=agent_wallet)
                return OnChainResult(
                    success=False,
                    error="Shield not initialized for this agent",
                    shield_pda=str(shield_pda),
                )

            # Build instruction data
            target_program = Pubkey.from_string(program_id)

            # Serialize TransactionRecord
            instruction_data = bytearray(RECORD_TRANSACTION_DISCRIMINATOR)
            instruction_data.extend(signature[:64] if len(signature) >= 64 else signature.ljust(64, b'\0'))
            instruction_data.extend(bytes(target_program))
            instruction_data.extend(value.to_bytes(8, 'little'))
            instruction_data.append(tx_type)

            # Build instruction
            instruction = Instruction(
                program_id=CIRCUIT_BREAKER_PROGRAM_ID,
                accounts=[
                    AccountMeta(shield_pda, is_signer=False, is_writable=True),
                    AccountMeta(self.authority.pubkey(), is_signer=True, is_writable=False),
                ],
                data=bytes(instruction_data),
            )

            # Build and send transaction
            tx = Transaction()
            tx.add(instruction)

            response = await self.client.send_transaction(
                tx,
                self.authority,
                opts={"skip_preflight": False},
            )

            logger.info(
                "Transaction recorded on-chain",
                signature=str(response.value),
                shield_pda=str(shield_pda),
            )

            return OnChainResult(
                success=True,
                signature=str(response.value),
                shield_pda=str(shield_pda),
            )

        except Exception as e:
            logger.error("Failed to record transaction on-chain", error=str(e))
            return OnChainResult(
                success=False,
                error=str(e),
                shield_pda=str(shield_pda),
            )

    async def trigger_circuit_breaker(
        self,
        agent_wallet: str,
        reason: str,
    ) -> OnChainResult:
        """
        Manually trigger the circuit breaker for an agent.

        Args:
            agent_wallet: The agent's wallet address
            reason: Reason for triggering

        Returns:
            OnChainResult with success status
        """
        await self.initialize()

        if self.authority is None:
            return OnChainResult(
                success=False,
                error="Authority keypair not configured",
            )

        shield_pda, _ = self.get_shield_pda(agent_wallet)

        try:
            # Build instruction data
            reason_bytes = reason.encode('utf-8')[:256]  # Max 256 chars
            instruction_data = bytearray(TRIGGER_CIRCUIT_BREAKER_DISCRIMINATOR)
            instruction_data.extend(len(reason_bytes).to_bytes(4, 'little'))
            instruction_data.extend(reason_bytes)

            instruction = Instruction(
                program_id=CIRCUIT_BREAKER_PROGRAM_ID,
                accounts=[
                    AccountMeta(shield_pda, is_signer=False, is_writable=True),
                    AccountMeta(self.authority.pubkey(), is_signer=True, is_writable=False),
                ],
                data=bytes(instruction_data),
            )

            tx = Transaction()
            tx.add(instruction)

            response = await self.client.send_transaction(
                tx,
                self.authority,
                opts={"skip_preflight": False},
            )

            logger.warning(
                "Circuit breaker triggered on-chain",
                signature=str(response.value),
                shield_pda=str(shield_pda),
                reason=reason,
            )

            return OnChainResult(
                success=True,
                signature=str(response.value),
                shield_pda=str(shield_pda),
            )

        except Exception as e:
            logger.error("Failed to trigger circuit breaker", error=str(e))
            return OnChainResult(
                success=False,
                error=str(e),
                shield_pda=str(shield_pda),
            )

    async def health_check(self) -> dict:
        """
        Check the health of the Circuit Breaker service.

        Returns:
            Health status dict
        """
        await self.initialize()

        try:
            # Check Solana connection
            health = await self.client.is_connected()

            # Get program account to verify it exists
            program_info = await self.client.get_account_info(CIRCUIT_BREAKER_PROGRAM_ID)
            program_exists = program_info.value is not None

            return {
                "status": "healthy" if health and program_exists else "degraded",
                "solana_connected": health,
                "program_deployed": program_exists,
                "program_id": str(CIRCUIT_BREAKER_PROGRAM_ID),
                "rpc_url": self.rpc_url,
                "authority_configured": self.authority is not None,
            }

        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "program_id": str(CIRCUIT_BREAKER_PROGRAM_ID),
            }


# Singleton instance
_circuit_breaker: Optional[CircuitBreakerService] = None


async def get_circuit_breaker() -> CircuitBreakerService:
    """Get the singleton Circuit Breaker service instance."""
    global _circuit_breaker
    if _circuit_breaker is None:
        _circuit_breaker = CircuitBreakerService()
    return _circuit_breaker
