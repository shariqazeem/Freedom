"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  AlertTriangle,
  Ban,
  Clock,
  Zap,
  Radio,
  Play,
} from "lucide-react";
import { shieldAPI, type AnalysisResult, type RogueAgentScenario } from "@/lib/api-client";

// =============================================================================
// TYPES
// =============================================================================

type TransactionStatus = "allowed" | "blocked" | "pending" | "flagged";
type TransactionType = "transfer" | "swap" | "stake" | "contract_call";

interface Transaction {
  id: string;
  signature: string;
  agentName: string;
  type: TransactionType;
  status: TransactionStatus;
  value: number;
  program: string;
  timestamp: Date;
  riskScore: number;
  // Source detection fields (from real API)
  sourceFlags?: string[];
  sandboxDetails?: string[];
}

// =============================================================================
// MOCK DATA GENERATOR
// =============================================================================

const PROGRAMS = [
  { name: "Jupiter", id: "JUP6...V4" },
  { name: "Raydium", id: "RAY4...8K" },
  { name: "Marinade", id: "MNDe...qP" },
  { name: "Orca", id: "ORCA...7L" },
  { name: "Unknown", id: "UNKN...XX" },
];

const AGENTS = [
  "Alpha-7",
  "Sentinel-3",
  "Trader-X9",
  "Vault-01",
  "Scout-12",
];

function generateMockTransaction(): Transaction {
  const statuses: TransactionStatus[] = ["allowed", "allowed", "allowed", "blocked", "flagged", "pending"];
  const types: TransactionType[] = ["transfer", "swap", "stake", "contract_call"];
  const status = statuses[Math.floor(Math.random() * statuses.length)] as TransactionStatus;
  const program = PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)];

  return {
    id: Math.random().toString(36).substring(2, 15),
    signature: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`.toUpperCase(),
    agentName: AGENTS[Math.floor(Math.random() * AGENTS.length)] as string,
    type: types[Math.floor(Math.random() * types.length)] as TransactionType,
    status,
    value: Math.random() * 100,
    program: program?.name ?? "Unknown",
    timestamp: new Date(),
    riskScore: status === "blocked" ? 85 + Math.random() * 15 :
               status === "flagged" ? 50 + Math.random() * 35 :
               Math.random() * 30,
  };
}

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = {
    allowed: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      icon: Shield,
      label: "ALLOWED",
    },
    blocked: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
      icon: Ban,
      label: "BLOCKED",
    },
    pending: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/20",
      icon: Clock,
      label: "PENDING",
    },
    flagged: {
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      border: "border-orange-500/20",
      icon: AlertTriangle,
      label: "FLAGGED",
    },
  };

  const { bg, text, border, icon: Icon, label } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border ${bg} ${border}`}>
      <Icon className={`w-3 h-3 ${text}`} />
      <span className={`text-[10px] font-bold tracking-wider ${text}`}>{label}</span>
    </div>
  );
}

// =============================================================================
// TRANSACTION ROW COMPONENT
// =============================================================================

function TransactionRow({ tx, isNew }: { tx: Transaction; isNew: boolean }) {
  const typeIcons = {
    transfer: ArrowUpRight,
    swap: Zap,
    stake: Shield,
    contract_call: ArrowDownLeft,
  };

  const TypeIcon = typeIcons[tx.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      className={`
        relative border-b border-border/30
        ${isNew && tx.status === "blocked" ? "feed-item-flash-critical" : ""}
        ${isNew && tx.status === "allowed" ? "feed-item-flash" : ""}
        hover:bg-white/[0.02] transition-colors
      `}
    >
      {/* New indicator line */}
      {isNew && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          className={`absolute left-0 top-0 bottom-0 w-0.5 ${
            tx.status === "blocked" ? "bg-red-500" :
            tx.status === "flagged" ? "bg-orange-500" :
            "bg-emerald-500"
          }`}
        />
      )}

      <div className="flex items-center gap-4 px-4 py-3">
        {/* Timestamp */}
        <div className="w-20 flex-shrink-0">
          <span className="font-mono text-[11px] text-muted-foreground">
            {tx.timestamp.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/50 ml-1">
            .{tx.timestamp.getMilliseconds().toString().padStart(3, "0").slice(0, 2)}
          </span>
        </div>

        {/* Type Icon */}
        <div className="w-8 flex-shrink-0">
          <div className={`w-6 h-6 rounded-sm flex items-center justify-center ${
            tx.status === "blocked" ? "bg-red-500/10" :
            tx.status === "flagged" ? "bg-orange-500/10" :
            "bg-white/5"
          }`}>
            <TypeIcon className={`w-3.5 h-3.5 ${
              tx.status === "blocked" ? "text-red-500" :
              tx.status === "flagged" ? "text-orange-500" :
              "text-muted-foreground"
            }`} />
          </div>
        </div>

        {/* Agent Name */}
        <div className="w-24 flex-shrink-0">
          <span className="font-mono text-xs text-foreground">{tx.agentName}</span>
        </div>

        {/* Transaction Signature */}
        <div className="w-32 flex-shrink-0">
          <span className="font-mono text-[11px] text-muted-foreground">{tx.signature}</span>
        </div>

        {/* Program */}
        <div className="w-24 flex-shrink-0">
          <span className="text-xs text-muted-foreground">{tx.program}</span>
        </div>

        {/* Value */}
        <div className="w-28 flex-shrink-0 text-right">
          <span className="font-mono text-xs text-foreground">
            {tx.value.toFixed(4)}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground ml-1">SOL</span>
        </div>

        {/* Risk Score */}
        <div className="w-16 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  tx.riskScore > 70 ? "bg-red-500" :
                  tx.riskScore > 40 ? "bg-orange-500" :
                  "bg-emerald-500"
                }`}
                style={{ width: `${tx.riskScore}%` }}
              />
            </div>
            <span className={`font-mono text-[10px] ${
              tx.riskScore > 70 ? "text-red-500" :
              tx.riskScore > 40 ? "text-orange-500" :
              "text-emerald-500"
            }`}>
              {Math.round(tx.riskScore)}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0 ml-auto">
          <StatusBadge status={tx.status} />
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// HEADER ROW
// =============================================================================

function FeedHeader() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-black/20">
      <div className="w-20 flex-shrink-0">
        <span className="terminal-header">Time</span>
      </div>
      <div className="w-8 flex-shrink-0">
        <span className="terminal-header">Type</span>
      </div>
      <div className="w-24 flex-shrink-0">
        <span className="terminal-header">Agent</span>
      </div>
      <div className="w-32 flex-shrink-0">
        <span className="terminal-header">Signature</span>
      </div>
      <div className="w-24 flex-shrink-0">
        <span className="terminal-header">Program</span>
      </div>
      <div className="w-28 flex-shrink-0 text-right">
        <span className="terminal-header">Value</span>
      </div>
      <div className="w-16 flex-shrink-0">
        <span className="terminal-header">Risk</span>
      </div>
      <div className="flex-shrink-0 ml-auto">
        <span className="terminal-header">Status</span>
      </div>
    </div>
  );
}

// =============================================================================
// STATS BAR
// =============================================================================

function StatsBar({ transactions }: { transactions: Transaction[] }) {
  const allowed = transactions.filter((t) => t.status === "allowed").length;
  const blocked = transactions.filter((t) => t.status === "blocked").length;
  const flagged = transactions.filter((t) => t.status === "flagged").length;
  const tps = (transactions.length / 60).toFixed(2);

  return (
    <div className="flex items-center gap-6 px-4 py-2 border-b border-border bg-black/40">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 status-glow-safe" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Live</span>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-4 text-[11px] font-mono">
        <div>
          <span className="text-muted-foreground">TX/min: </span>
          <span className="text-foreground">{tps}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Allowed: </span>
          <span className="text-emerald-500">{allowed}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Blocked: </span>
          <span className="text-red-500">{blocked}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Flagged: </span>
          <span className="text-orange-500">{flagged}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">
          {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// HELPER: Convert API Result to Transaction
// =============================================================================

function apiResultToTransaction(result: AnalysisResult): Transaction {
  // Check for sandbox mode to determine if flagged
  const isSandbox = result.source_detection_result?.sandbox_mode;
  const status = result.decision === "block" ? "blocked" :
                 isSandbox ? "flagged" : "allowed";

  return {
    id: result.request_id,
    signature: result.request_id.slice(0, 4).toUpperCase() + "..." + result.request_id.slice(-4).toUpperCase(),
    agentName: "API-Test",
    type: "transfer",
    status,
    value: 1.0, // Simulated value
    program: isSandbox ? "Sandbox" : "Shield",
    timestamp: new Date(result.timestamp),
    riskScore: result.risk_score,
    sourceFlags: result.source_detection_result?.flags || [],
    sandboxDetails: result.source_detection_result?.details || [],
  };
}

// =============================================================================
// ATTACK SIMULATION BUTTONS
// =============================================================================

function AttackSimulator({
  onSimulate,
  isSimulating,
  isConnected,
}: {
  onSimulate: (scenario: RogueAgentScenario) => void;
  isSimulating: boolean;
  isConnected: boolean;
}) {
  const scenarios: { id: RogueAgentScenario["scenario"]; label: string; color: string }[] = [
    { id: "blacklisted_address", label: "Blacklist", color: "bg-red-500/20 hover:bg-red-500/30 text-red-500" },
    { id: "prompt_injection", label: "Injection", color: "bg-orange-500/20 hover:bg-orange-500/30 text-orange-500" },
    { id: "indirect_injection", label: "Indirect", color: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-500" },
    { id: "excessive_amount", label: "Amount", color: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-500" },
  ];

  if (!isConnected) return null;

  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground mr-1">Attack:</span>
      {scenarios.map((s) => (
        <button
          key={s.id}
          onClick={() => onSimulate({ scenario: s.id })}
          disabled={isSimulating}
          className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50 ${s.color}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TransactionFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [liveMode, setLiveMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Check API connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await shieldAPI.getHealth();
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  // Generate initial mock transactions (demo mode)
  useEffect(() => {
    if (!liveMode) {
      const initial = Array.from({ length: 15 }, generateMockTransaction);
      setTransactions(initial);
    }
  }, [liveMode]);

  // Add new mock transactions periodically (demo mode)
  useEffect(() => {
    if (liveMode) return;

    const interval = setInterval(() => {
      const newTx = generateMockTransaction();

      setNewIds((prev) => new Set([...prev, newTx.id]));
      setTransactions((prev) => [newTx, ...prev.slice(0, 49)]);

      // Remove "new" status after animation
      setTimeout(() => {
        setNewIds((prev) => {
          const updated = new Set(prev);
          updated.delete(newTx.id);
          return updated;
        });
      }, 1000);
    }, 800 + Math.random() * 1200); // Random interval 0.8-2s

    return () => clearInterval(interval);
  }, [liveMode]);

  // Simulate rogue agent attack
  const handleSimulate = useCallback(async (scenario: RogueAgentScenario) => {
    if (!isConnected) return;

    setIsSimulating(true);
    try {
      const result = await shieldAPI.simulateRogueAgent(scenario);
      const tx = apiResultToTransaction(result);

      setNewIds((prev) => new Set([...prev, tx.id]));
      setTransactions((prev) => [tx, ...prev.slice(0, 49)]);

      setTimeout(() => {
        setNewIds((prev) => {
          const updated = new Set(prev);
          updated.delete(tx.id);
          return updated;
        });
      }, 2000);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  }, [isConnected]);

  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-emerald-500/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="panel-title">Live Transaction Feed</h2>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Real-time agent activity monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* API Connection Status */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-[10px] text-muted-foreground">
              {isConnected ? "API Connected" : "API Offline"}
            </span>
          </div>

          {/* Mode Toggle */}
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-sm transition-colors ${
              liveMode
                ? "bg-emerald-500/20 text-emerald-500"
                : "bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            {liveMode ? <Radio className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="text-[10px] uppercase tracking-wider">
              {liveMode ? "Live" : "Demo"}
            </span>
          </button>
        </div>
      </div>

      {/* Attack Simulation Bar (only in live mode) */}
      {liveMode && (
        <div className="px-4 py-2 border-b border-border bg-purple-500/5 flex items-center justify-between">
          <AttackSimulator
            onSimulate={handleSimulate}
            isSimulating={isSimulating}
            isConnected={isConnected}
          />
          {isSimulating && (
            <span className="text-[10px] text-purple-500 animate-pulse">Simulating...</span>
          )}
        </div>
      )}

      {/* Stats Bar */}
      <StatsBar transactions={transactions} />

      {/* Column Headers */}
      <FeedHeader />

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              isNew={newIds.has(tx.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-black/20 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          Showing {transactions.length} transactions
          {liveMode && " (Live Mode)"}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Shield v0.1.0
        </span>
      </div>
    </div>
  );
}
