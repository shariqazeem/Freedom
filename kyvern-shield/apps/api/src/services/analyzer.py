"""
Main Transaction Analyzer Service.

This module orchestrates the complete analysis pipeline:
1. Heuristic analysis (fast, rule-based)
2. Source detection (untrusted data source analysis - RESEARCH-BASED)
3. LLM analysis (deep semantic analysis, with SANDBOX mode for risky sources)
4. Decision making based on combined results

RESEARCH BASIS:
- Paper: "Prompt Injection in Large Language Models" (2023)
- Attack: Indirect Prompt Injection via Web Content
- Defense: Untrusted Source Detection + Elevated LLM Scrutiny
"""

import time
from dataclasses import dataclass
from typing import Optional

import structlog

from src.models.intent import (
    AnalysisDecision,
    AnalysisResult,
    TransactionIntent,
)
from src.services.heuristic import HeuristicAnalyzer, get_heuristic_analyzer
from src.services.llm_analyzer import LLMAnalyzer, get_llm_analyzer
from src.services.source_detection import (
    UntrustedSourceDetector,
    SourceDetectionResult,
    SandboxWarning,
    get_source_detector,
)

logger = structlog.get_logger()


@dataclass
class AnalyzerConfig:
    """Configuration for the transaction analyzer."""

    # Risk thresholds
    auto_block_threshold: int = 80  # Auto-block if risk >= this score
    auto_allow_threshold: int = 20  # Auto-allow if risk <= this score

    # Skip LLM analysis if heuristic already blocks
    skip_llm_on_heuristic_block: bool = True

    # Weight for combining scores
    heuristic_weight: float = 0.4
    llm_weight: float = 0.6


class TransactionAnalyzer:
    """
    Main orchestrator for transaction intent analysis.

    Combines heuristic, source detection, and LLM analysis to produce
    a final decision on whether to allow or block a transaction.

    Analysis Pipeline:
    1. Heuristic checks (blacklist, limits, patterns)
    2. Source detection (untrusted external data)
    3. LLM analysis (standard or SANDBOX mode)
    4. Decision synthesis
    """

    def __init__(
        self,
        heuristic_analyzer: Optional[HeuristicAnalyzer] = None,
        llm_analyzer: Optional[LLMAnalyzer] = None,
        source_detector: Optional[UntrustedSourceDetector] = None,
        config: Optional[AnalyzerConfig] = None,
    ):
        """
        Initialize the transaction analyzer.

        Args:
            heuristic_analyzer: Optional heuristic analyzer instance
            llm_analyzer: Optional LLM analyzer instance
            source_detector: Optional source detector instance
            config: Optional configuration override
        """
        self.config = config or AnalyzerConfig()
        self._heuristic: Optional[HeuristicAnalyzer] = heuristic_analyzer
        self._llm: Optional[LLMAnalyzer] = llm_analyzer
        self._source_detector: Optional[UntrustedSourceDetector] = source_detector

        logger.info(
            "Transaction analyzer initialized",
            auto_block_threshold=self.config.auto_block_threshold,
            auto_allow_threshold=self.config.auto_allow_threshold,
        )

    @property
    def heuristic(self) -> HeuristicAnalyzer:
        """Get or create heuristic analyzer."""
        if self._heuristic is None:
            self._heuristic = get_heuristic_analyzer()
        return self._heuristic

    @property
    def source_detector(self) -> UntrustedSourceDetector:
        """Get or create source detector."""
        if self._source_detector is None:
            self._source_detector = get_source_detector()
        return self._source_detector

    async def get_llm(self) -> LLMAnalyzer:
        """Get or create LLM analyzer."""
        if self._llm is None:
            self._llm = await get_llm_analyzer()
        return self._llm

    async def analyze(self, intent: TransactionIntent) -> AnalysisResult:
        """
        Perform complete analysis of a transaction intent.

        Pipeline:
        1. Run heuristic analysis (blacklist, limits, patterns)
        2. Run source detection (untrusted external data - RESEARCH-BASED)
        3. If sandbox mode triggered, use elevated LLM scrutiny
        4. Run LLM analysis (standard or SANDBOX mode)
        5. Combine scores and make decision

        Args:
            intent: The transaction intent to analyze

        Returns:
            Complete AnalysisResult with decision and sandbox warnings
        """
        start_time = time.perf_counter()
        sandbox_warnings: list[SandboxWarning] = []

        logger.info(
            "Starting transaction analysis",
            request_id=str(intent.request_id),
            agent_id=str(intent.agent_id),
            target=intent.target_address[:20] + "...",
            amount=intent.amount_sol,
        )

        # Layer 1: Heuristic Analysis
        heuristic_result = self.heuristic.analyze(intent)

        # Layer 2: Source Detection (Research-based indirect injection defense)
        source_result = self.source_detector.analyze(
            reasoning=intent.reasoning,
            data_sources=None,  # TODO: Add data_sources to TransactionIntent
        )

        # Collect sandbox warnings
        sandbox_warnings.extend(source_result.warnings)

        if source_result.sandbox_mode:
            logger.warning(
                "SANDBOX MODE ACTIVATED - Untrusted sources detected",
                request_id=str(intent.request_id),
                warnings=len(source_result.warnings),
                action=source_result.recommended_action,
            )

        # Early exit if heuristic blocks OR source detection recommends block
        if (not heuristic_result.passed and self.config.skip_llm_on_heuristic_block) or \
           source_result.recommended_action == "block":
            analysis_time = (time.perf_counter() - start_time) * 1000

            # Calculate risk score
            risk_score = self._calculate_heuristic_risk(heuristic_result)
            if source_result.recommended_action == "block":
                risk_score = 100  # Max score for blocked sources

            explanation = self._build_explanation(
                heuristic_result=heuristic_result,
                llm_result=None,
                decision=AnalysisDecision.BLOCK,
                source_result=source_result,
            )

            logger.warning(
                "Transaction blocked by pre-LLM analysis",
                request_id=str(intent.request_id),
                risk_score=risk_score,
                blacklisted=heuristic_result.blacklisted,
                sandbox_blocked=source_result.recommended_action == "block",
            )

            return AnalysisResult(
                request_id=intent.request_id,
                decision=AnalysisDecision.BLOCK,
                risk_score=risk_score,
                explanation=explanation,
                heuristic_result=heuristic_result,
                llm_result=None,
                analysis_time_ms=analysis_time,
            )

        # Layer 3: LLM Analysis (with SANDBOX mode if needed)
        llm_analyzer = await self.get_llm()
        llm_result = await llm_analyzer.analyze(
            intent,
            sandbox_mode=source_result.sandbox_mode,
            risk_factors=[w.message for w in source_result.warnings],
        )

        # Combine scores (apply source detection penalty)
        combined_score = self._combine_scores(
            heuristic_result=heuristic_result,
            llm_score=llm_result.risk_score,
            source_result=source_result,
        )

        # Make decision
        decision = self._make_decision(
            combined_score=combined_score,
            heuristic_result=heuristic_result,
            llm_result=llm_result,
            source_result=source_result,
        )

        analysis_time = (time.perf_counter() - start_time) * 1000

        explanation = self._build_explanation(
            heuristic_result=heuristic_result,
            llm_result=llm_result,
            decision=decision,
            source_result=source_result,
        )

        logger.info(
            "Transaction analysis complete",
            request_id=str(intent.request_id),
            decision=decision.value,
            risk_score=combined_score,
            sandbox_mode=source_result.sandbox_mode,
            analysis_time_ms=round(analysis_time, 2),
        )

        return AnalysisResult(
            request_id=intent.request_id,
            decision=decision,
            risk_score=combined_score,
            explanation=explanation,
            heuristic_result=heuristic_result,
            llm_result=llm_result,
            analysis_time_ms=analysis_time,
        )

    def _calculate_heuristic_risk(self, heuristic_result) -> int:
        """Calculate risk score from heuristic results only."""
        score = 0

        if heuristic_result.blacklisted:
            score = 100  # Automatic max score for blacklisted addresses

        elif heuristic_result.amount_exceeded:
            score = 75  # High score for amount violations

        # Add points for each suspicious finding
        suspicious_count = sum(
            1 for d in heuristic_result.details if "SUSPICIOUS" in d
        )
        score = max(score, min(100, 60 + suspicious_count * 15))

        return score

    def _combine_scores(
        self,
        heuristic_result,
        llm_score: int,
        source_result: Optional[SourceDetectionResult] = None,
    ) -> int:
        """
        Combine heuristic, source detection, and LLM scores into a final risk score.

        Args:
            heuristic_result: Result from heuristic analysis
            llm_score: Risk score from LLM
            source_result: Result from source detection (research-based)

        Returns:
            Combined risk score (0-100)
        """
        heuristic_score = self._calculate_heuristic_risk(heuristic_result)

        # If heuristic found critical issues, weight it more heavily
        if heuristic_result.blacklisted or heuristic_result.amount_exceeded:
            return max(heuristic_score, llm_score)

        # Calculate base combined score
        combined = (
            heuristic_score * self.config.heuristic_weight +
            llm_score * self.config.llm_weight
        )

        # Apply source detection penalty (research-based indirect injection defense)
        if source_result:
            # Add penalty for untrusted sources
            if source_result.has_untrusted_sources:
                combined += 10  # Baseline penalty for untrusted data

            # Add penalty for sandbox mode (elevated risk)
            if source_result.sandbox_mode:
                combined += 15

            # Count high severity warnings
            high_severity_count = sum(
                1 for w in source_result.warnings
                if w.severity in ("high", "critical")
            )
            combined += high_severity_count * 10

        return min(100, int(combined))

    def _make_decision(
        self,
        combined_score: int,
        heuristic_result,
        llm_result,
        source_result: Optional[SourceDetectionResult] = None,
    ) -> AnalysisDecision:
        """
        Make final allow/block decision.

        Args:
            combined_score: Combined risk score
            heuristic_result: Heuristic analysis result
            llm_result: LLM analysis result
            source_result: Source detection result

        Returns:
            ALLOW or BLOCK decision
        """
        # Immediate block conditions
        if heuristic_result.blacklisted:
            return AnalysisDecision.BLOCK

        if llm_result and llm_result.prompt_injection_detected:
            return AnalysisDecision.BLOCK

        # Source detection block conditions (research-based)
        if source_result and source_result.recommended_action == "block":
            return AnalysisDecision.BLOCK

        # Check for critical warnings from source detection
        if source_result:
            critical_count = sum(
                1 for w in source_result.warnings
                if w.severity == "critical"
            )
            if critical_count > 0:
                return AnalysisDecision.BLOCK

        # Score-based decision
        if combined_score >= self.config.auto_block_threshold:
            return AnalysisDecision.BLOCK

        return AnalysisDecision.ALLOW

    def _build_explanation(
        self,
        heuristic_result,
        llm_result,
        decision: AnalysisDecision,
        source_result: Optional[SourceDetectionResult] = None,
    ) -> str:
        """Build a human-readable explanation of the decision."""
        parts: list[str] = []

        if decision == AnalysisDecision.BLOCK:
            parts.append("Transaction BLOCKED.")

            if heuristic_result.blacklisted:
                parts.append("Reason: Target address is on blacklist.")
            elif heuristic_result.amount_exceeded:
                parts.append("Reason: Transaction amount exceeds configured limits.")
            elif source_result and source_result.recommended_action == "block":
                parts.append("Reason: Untrusted data source detected - potential indirect injection attack.")
            elif llm_result and llm_result.prompt_injection_detected:
                parts.append("Reason: Potential prompt injection detected in reasoning.")
            elif llm_result and not llm_result.consistency_check:
                parts.append("Reason: Agent reasoning inconsistent with transaction.")
            else:
                parts.append("Reason: Risk score exceeded threshold.")

        else:
            parts.append("Transaction ALLOWED.")
            parts.append("All security checks passed.")

        # Add source detection warnings (research-based)
        if source_result and source_result.sandbox_mode:
            parts.append("[SANDBOX MODE]")
            if source_result.warnings:
                warning_msgs = [w.message for w in source_result.warnings[:2]]
                parts.append("Source warnings: " + "; ".join(warning_msgs))

        # Add details
        if heuristic_result.details:
            parts.append("Heuristic findings: " + "; ".join(heuristic_result.details[:3]))

        if llm_result and llm_result.explanation:
            parts.append(f"LLM assessment: {llm_result.explanation}")

        return " ".join(parts)


# Singleton instance
_analyzer: Optional[TransactionAnalyzer] = None


async def get_transaction_analyzer() -> TransactionAnalyzer:
    """Get the singleton transaction analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = TransactionAnalyzer()
    return _analyzer
