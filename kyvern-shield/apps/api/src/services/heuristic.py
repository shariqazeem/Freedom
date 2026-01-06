"""
Heuristic Analysis Layer for Transaction Intent.

This module provides fast, rule-based analysis of transaction intents
before they are passed to the more expensive LLM analysis layer.
"""

import re
from dataclasses import dataclass
from typing import Optional

import structlog

from src.db.blacklist import get_blacklist_db
from src.models.intent import HeuristicResult, TransactionIntent

logger = structlog.get_logger()


@dataclass
class HeuristicConfig:
    """Configuration for heuristic analysis."""

    # Amount limits (in SOL)
    max_single_transaction: float = 10.0  # Maximum SOL per transaction
    max_daily_limit: float = 100.0  # Maximum daily spending per agent

    # Pattern detection
    suspicious_patterns: list[str] = None  # Regex patterns for suspicious reasoning

    def __post_init__(self):
        if self.suspicious_patterns is None:
            self.suspicious_patterns = [
                r"ignore\s+(previous|all)\s+instructions?",
                r"disregard\s+(previous|all|any)\s+(instructions?|rules?)",
                r"bypass\s+(security|rules?|restrictions?)",
                r"send\s+(all|everything|funds?)\s+to",
                r"transfer\s+(all|everything|max|maximum)",
                r"drain\s+(wallet|account|funds?)",
                r"emergency\s+override",
                r"admin\s+(mode|access|override)",
                r"system\s+prompt",
                r"you\s+are\s+now",
                r"new\s+instructions?:",
                r"forget\s+(everything|all)",
            ]


class HeuristicAnalyzer:
    """
    Rule-based analyzer for transaction intents.

    Performs fast checks before expensive LLM analysis:
    1. Blacklist checking (address and program)
    2. Amount limit enforcement
    3. Suspicious pattern detection in reasoning
    """

    def __init__(self, config: Optional[HeuristicConfig] = None):
        """
        Initialize the heuristic analyzer.

        Args:
            config: Optional configuration override
        """
        self.config = config or HeuristicConfig()
        self.blacklist_db = get_blacklist_db()

        # Compile regex patterns for efficiency
        self._suspicious_patterns = [
            re.compile(pattern, re.IGNORECASE)
            for pattern in self.config.suspicious_patterns
        ]

        logger.info(
            "Heuristic analyzer initialized",
            max_transaction=self.config.max_single_transaction,
            patterns_loaded=len(self._suspicious_patterns),
        )

    def analyze(self, intent: TransactionIntent) -> HeuristicResult:
        """
        Perform heuristic analysis on a transaction intent.

        Args:
            intent: The transaction intent to analyze

        Returns:
            HeuristicResult with findings
        """
        details: list[str] = []
        blacklisted = False
        amount_exceeded = False

        # Check 1: Blacklist lookup
        if self.blacklist_db.is_blacklisted(intent.target_address):
            blacklisted = True
            entry = self.blacklist_db.get_entry(intent.target_address)
            reason = entry.reason if entry else "Unknown reason"
            details.append(f"CRITICAL: Target address is blacklisted - {reason}")
            logger.warning(
                "Blacklisted address detected",
                agent_id=str(intent.agent_id),
                address=intent.target_address[:20] + "...",
            )
        else:
            details.append("Address not on blacklist")

        # Check 2: Amount limits
        if intent.amount_sol > self.config.max_single_transaction:
            amount_exceeded = True
            details.append(
                f"ALERT: Amount {intent.amount_sol} SOL exceeds limit of "
                f"{self.config.max_single_transaction} SOL"
            )
            logger.warning(
                "Amount limit exceeded",
                agent_id=str(intent.agent_id),
                amount=intent.amount_sol,
                limit=self.config.max_single_transaction,
            )
        else:
            details.append(
                f"Amount {intent.amount_sol} SOL within limit of "
                f"{self.config.max_single_transaction} SOL"
            )

        # Check 3: Suspicious patterns in reasoning
        suspicious_findings = self._check_suspicious_patterns(intent.reasoning)
        if suspicious_findings:
            details.extend(suspicious_findings)
            logger.warning(
                "Suspicious patterns detected in reasoning",
                agent_id=str(intent.agent_id),
                patterns=len(suspicious_findings),
            )

        # Determine overall pass/fail
        passed = not blacklisted and not amount_exceeded and len(suspicious_findings) == 0

        return HeuristicResult(
            passed=passed,
            blacklisted=blacklisted,
            amount_exceeded=amount_exceeded,
            details=details,
        )

    def _check_suspicious_patterns(self, reasoning: str) -> list[str]:
        """
        Check reasoning text for suspicious patterns that might indicate
        prompt injection or malicious intent.

        Args:
            reasoning: The agent's reasoning text

        Returns:
            List of findings (empty if no suspicious patterns found)
        """
        findings: list[str] = []

        for pattern in self._suspicious_patterns:
            match = pattern.search(reasoning)
            if match:
                findings.append(
                    f"SUSPICIOUS: Detected pattern '{match.group()}' in reasoning"
                )

        return findings

    def quick_block_check(self, intent: TransactionIntent) -> tuple[bool, str]:
        """
        Quick check to determine if transaction should be immediately blocked.

        This is a fast path for obvious violations.

        Args:
            intent: The transaction intent to check

        Returns:
            Tuple of (should_block, reason)
        """
        # Check blacklist
        if self.blacklist_db.is_blacklisted(intent.target_address):
            return True, "Target address is on blacklist"

        # Check extreme amounts
        if intent.amount_sol > self.config.max_single_transaction * 10:
            return True, f"Amount {intent.amount_sol} SOL is extremely high"

        return False, ""


# Singleton instance
_analyzer: Optional[HeuristicAnalyzer] = None


def get_heuristic_analyzer() -> HeuristicAnalyzer:
    """Get the singleton heuristic analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = HeuristicAnalyzer()
    return _analyzer
