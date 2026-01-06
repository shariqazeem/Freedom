"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Ban, AlertTriangle, Activity, Zap } from "lucide-react";

// =============================================================================
// TYPESCRIPT INTERFACES - Matching Backend AnalysisResult
// =============================================================================

export type AnalysisDecision = "allow" | "block";

export type SourceDetectionFlag =
  | "UNTRUSTED_SOURCE"
  | "SANDBOX_TRIGGER"
  | "BLOCKED_DOMAIN"
  | "INDIRECT_INJECTION"
  | "MANIPULATION_PATTERN";

export interface HeuristicResult {
  passed: boolean;
  blacklisted: boolean;
  amount_exceeded: boolean;
  details: string[];
}

export interface LLMAnalysisResult {
  risk_score: number;
  consistency_check: boolean;
  prompt_injection_detected: boolean;
  explanation: string;
  raw_response?: string;
}

export interface SourceDetectionResult {
  risk_score: number;
  flags: SourceDetectionFlag[];
  urls_found: string[];
  untrusted_domains: string[];
  sandbox_mode: boolean;
  details: string[];
}

/**
 * TransactionEvent - Matches the backend's AnalysisResult Pydantic model
 */
export interface TransactionEvent {
  request_id: string;
  decision: AnalysisDecision;
  risk_score: number;
  explanation: string;
  heuristic_result: HeuristicResult;
  source_detection_result?: SourceDetectionResult;
  llm_result?: LLMAnalysisResult;
  analysis_time_ms: number;
  timestamp: string;
}

// =============================================================================
// MOCK DATA GENERATOR
// =============================================================================

const MOCK_EXPLANATIONS: Record<AnalysisDecision, string[]> = {
  allow: [
    "Transaction approved. Low risk: known program, amount within limits.",
    "Transaction approved. Reasoning consistent with swap operation.",
    "Transaction approved. All security checks passed.",
    "Transaction approved. Standard DeFi operation detected.",
  ],
  block: [
    "Transaction BLOCKED. Reason: Target address is on blacklist.",
    "Transaction BLOCKED. Reason: Prompt injection detected in reasoning.",
    "Transaction BLOCKED. Reason: Untrusted data source - indirect injection attack.",
    "Transaction BLOCKED. Reason: Amount exceeds configured limits.",
    "Transaction BLOCKED. Reason: SANDBOX_TRIGGER from untrusted domain.",
  ],
};

function generateMockEvent(): TransactionEvent {
  const isBlocked = Math.random() < 0.35; // 35% chance of blocked
  const decision: AnalysisDecision = isBlocked ? "block" : "allow";
  const riskScore = isBlocked
    ? 70 + Math.floor(Math.random() * 30) // 70-100 for blocked
    : Math.floor(Math.random() * 40); // 0-40 for allowed

  const explanations = MOCK_EXPLANATIONS[decision];
  const explanation = explanations[Math.floor(Math.random() * explanations.length)];

  const hasSandboxTrigger = isBlocked && Math.random() < 0.4;

  return {
    request_id: crypto.randomUUID(),
    decision,
    risk_score: riskScore,
    explanation: explanation ?? "Analysis complete.",
    heuristic_result: {
      passed: !isBlocked,
      blacklisted: isBlocked && Math.random() < 0.3,
      amount_exceeded: isBlocked && Math.random() < 0.2,
      details: isBlocked
        ? ["Suspicious activity detected"]
        : ["Address not on blacklist", "Amount within limits"],
    },
    source_detection_result: hasSandboxTrigger
      ? {
          risk_score: 80,
          flags: ["UNTRUSTED_SOURCE", "SANDBOX_TRIGGER"],
          urls_found: ["https://evil-api.xyz/price"],
          untrusted_domains: ["evil-api.xyz"],
          sandbox_mode: true,
          details: ["Untrusted domain detected", "SANDBOX_TRIGGER activated"],
        }
      : undefined,
    llm_result: {
      risk_score: riskScore,
      consistency_check: !isBlocked,
      prompt_injection_detected: isBlocked && Math.random() < 0.3,
      explanation: explanation ?? "Analysis complete.",
    },
    analysis_time_ms: 5 + Math.random() * 200,
    timestamp: new Date().toISOString(),
  };
}

// =============================================================================
// RISK SCORE BAR COMPONENT
// =============================================================================

function RiskScoreBar({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 70) return "bg-red-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getTextColor = () => {
    if (score >= 70) return "text-red-500";
    if (score >= 40) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="flex items-center gap-3 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${getColor()}`}
        />
      </div>
      <span className={`font-mono text-xs font-bold ${getTextColor()}`}>
        {score.toString().padStart(3, "0")}
      </span>
    </div>
  );
}

// =============================================================================
// SCANLINE EFFECT COMPONENT
// =============================================================================

function ScanlineOverlay() {
  return (
    <motion.div
      initial={{ top: 0, opacity: 0.8 }}
      animate={{ top: "100%", opacity: 0 }}
      transition={{ duration: 0.6, ease: "linear" }}
      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent pointer-events-none z-10"
      style={{ boxShadow: "0 0 20px 2px rgba(16, 185, 129, 0.4)" }}
    />
  );
}

// =============================================================================
// TRANSACTION ROW COMPONENT
// =============================================================================

function TransactionRow({
  event,
  isNew,
}: {
  event: TransactionEvent;
  isNew: boolean;
}) {
  const isBlocked = event.decision === "block";
  const hasSandbox = event.source_detection_result?.sandbox_mode;

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        opacity: { duration: 0.3 },
      }}
      className={`
        relative border-b border-zinc-800/50 overflow-hidden
        ${isBlocked ? "bg-red-950/20" : "bg-transparent"}
        hover:bg-zinc-900/50 transition-colors duration-200
      `}
    >
      {/* Scanline effect for new items */}
      {isNew && <ScanlineOverlay />}

      {/* Left accent bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${
          isBlocked ? "bg-red-500" : hasSandbox ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />

      {/* Flash overlay for blocked transactions */}
      {isNew && isBlocked && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-red-500/10 pointer-events-none"
        />
      )}

      <div className="flex items-center gap-4 px-4 py-3 pl-6">
        {/* Timestamp */}
        <div className="w-24 flex-shrink-0">
          <span className="font-mono text-[11px] text-zinc-500">
            {new Date(event.timestamp).toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className="font-mono text-[10px] text-zinc-600 ml-0.5">
            .{new Date(event.timestamp).getMilliseconds().toString().padStart(3, "0").slice(0, 2)}
          </span>
        </div>

        {/* Status Icon */}
        <div className="w-8 flex-shrink-0">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center ${
              isBlocked
                ? "bg-red-950/50 border border-red-900/50"
                : "bg-emerald-950/50 border border-emerald-900/50"
            }`}
          >
            {isBlocked ? (
              <Ban className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </div>
        </div>

        {/* Request ID */}
        <div className="w-32 flex-shrink-0">
          <span className="font-mono text-xs text-zinc-400">
            {truncateHash(event.request_id)}
          </span>
        </div>

        {/* Decision Badge */}
        <div className="w-24 flex-shrink-0">
          <span
            className={`
              inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
              ${
                isBlocked
                  ? "bg-red-950/50 text-red-500 border border-red-900/30"
                  : "bg-emerald-950/50 text-emerald-500 border border-emerald-900/30"
              }
            `}
          >
            {isBlocked ? "BLOCKED" : "ALLOWED"}
          </span>
        </div>

        {/* Sandbox Flag */}
        <div className="w-20 flex-shrink-0">
          {hasSandbox && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-950/50 text-amber-500 border border-amber-900/30">
              <AlertTriangle className="w-2.5 h-2.5" />
              SANDBOX
            </span>
          )}
        </div>

        {/* Analysis Time */}
        <div className="w-20 flex-shrink-0 text-right">
          <span className="font-mono text-[11px] text-zinc-500">
            {event.analysis_time_ms.toFixed(1)}
          </span>
          <span className="font-mono text-[10px] text-zinc-600 ml-0.5">ms</span>
        </div>

        {/* Risk Score Bar */}
        <div className="flex-1 min-w-[140px]">
          <RiskScoreBar score={event.risk_score} />
        </div>
      </div>

      {/* Explanation row (only for blocked) */}
      {isBlocked && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-6 pb-3"
        >
          <p className="font-mono text-[10px] text-red-400/80 pl-2 border-l border-red-900/50">
            {event.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// =============================================================================
// FEED HEADER
// =============================================================================

function FeedHeader() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-zinc-800 bg-zinc-950/80 pl-6">
      <div className="w-24 flex-shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Timestamp
        </span>
      </div>
      <div className="w-8 flex-shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          St
        </span>
      </div>
      <div className="w-32 flex-shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Request ID
        </span>
      </div>
      <div className="w-24 flex-shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Decision
        </span>
      </div>
      <div className="w-20 flex-shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Flags
        </span>
      </div>
      <div className="w-20 flex-shrink-0 text-right">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Latency
        </span>
      </div>
      <div className="flex-1 min-w-[140px]">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Risk Score
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// STATS BAR
// =============================================================================

function StatsBar({ events }: { events: TransactionEvent[] }) {
  const allowed = events.filter((e) => e.decision === "allow").length;
  const blocked = events.filter((e) => e.decision === "block").length;
  const avgLatency =
    events.length > 0
      ? events.reduce((sum, e) => sum + e.analysis_time_ms, 0) / events.length
      : 0;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-emerald-500"
            style={{ boxShadow: "0 0 8px 2px rgba(16, 185, 129, 0.4)" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Live Feed
          </span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div>
            <span className="text-zinc-600">Allowed: </span>
            <span className="text-emerald-500 font-bold">{allowed}</span>
          </div>
          <div>
            <span className="text-zinc-600">Blocked: </span>
            <span className="text-red-500 font-bold">{blocked}</span>
          </div>
          <div>
            <span className="text-zinc-600">Avg: </span>
            <span className="text-zinc-400">{avgLatency.toFixed(1)}ms</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Activity className="w-3 h-3 text-zinc-600" />
        <span className="font-mono text-[10px] text-zinc-500">
          {events.length} events
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface LiveTransactionFeedProps {
  events?: TransactionEvent[];
  enableMockData?: boolean;
}

export function LiveTransactionFeed({
  events: externalEvents,
  enableMockData = true,
}: LiveTransactionFeedProps) {
  const [events, setEvents] = useState<TransactionEvent[]>(externalEvents ?? []);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Sync with external events if provided
  useEffect(() => {
    if (externalEvents) {
      setEvents(externalEvents);
    }
  }, [externalEvents]);

  // Generate mock "Active Threat" every 3 seconds
  useEffect(() => {
    if (!enableMockData) return;

    // Generate initial batch
    const initialEvents = Array.from({ length: 8 }, generateMockEvent);
    setEvents(initialEvents);

    const interval = setInterval(() => {
      const newEvent = generateMockEvent();

      setNewIds((prev) => new Set([...prev, newEvent.request_id]));
      setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);

      // Remove "new" status after animation completes
      setTimeout(() => {
        setNewIds((prev) => {
          const updated = new Set(prev);
          updated.delete(newEvent.request_id);
          return updated;
        });
      }, 1500);
    }, 3000);

    return () => clearInterval(interval);
  }, [enableMockData]);

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-950/50 border border-emerald-900/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="font-mono text-sm font-bold text-zinc-200 tracking-tight">
              TRANSACTION ANALYSIS FEED
            </h2>
            <p className="font-mono text-[10px] text-zinc-600 mt-0.5">
              Real-time Shield protection monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
            Kyvern Shield v0.1
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar events={events} />

      {/* Column Headers */}
      <FeedHeader />

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <TransactionRow
              key={event.request_id}
              event={event}
              isNew={newIds.has(event.request_id)}
            />
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="flex items-center justify-center h-32 text-zinc-600">
            <span className="font-mono text-sm">Awaiting transactions...</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <span className="font-mono text-[10px] text-zinc-600">
          {events.filter((e) => e.decision === "block").length} threats blocked
        </span>
        <span className="font-mono text-[10px] text-zinc-600">
          UTC {new Date().toISOString().slice(11, 19)}
        </span>
      </div>
    </div>
  );
}

export default LiveTransactionFeed;
