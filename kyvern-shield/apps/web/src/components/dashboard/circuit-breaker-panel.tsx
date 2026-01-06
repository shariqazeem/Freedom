"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Power,
  AlertTriangle,
  Lock,
  Gauge,
  Ban,
  RefreshCw,
  ChevronRight,
  Activity,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

type CircuitState = "closed" | "open" | "half_open";

interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: "limit" | "blocklist" | "allowlist" | "rate";
  value?: number | string;
  icon: React.ElementType;
}

interface AgentStatus {
  id: string;
  name: string;
  state: CircuitState;
  anomalyCount: number;
  lastTransaction: Date;
}

// =============================================================================
// CIRCUIT STATE INDICATOR
// =============================================================================

function CircuitStateIndicator({ state }: { state: CircuitState }) {
  const config = {
    closed: {
      label: "CLOSED",
      sublabel: "Normal Operation",
      color: "emerald",
      icon: Shield,
      glow: "status-glow-safe",
    },
    open: {
      label: "OPEN",
      sublabel: "Circuit Tripped",
      color: "red",
      icon: Ban,
      glow: "status-glow-critical",
    },
    half_open: {
      label: "HALF-OPEN",
      sublabel: "Testing Recovery",
      color: "amber",
      icon: RefreshCw,
      glow: "status-glow-warning",
    },
  };

  const { label, sublabel, color, icon: Icon, glow } = config[state];

  return (
    <div className="flex items-center gap-4">
      <div className={`relative w-16 h-16 rounded-sm bg-${color}-500/10 flex items-center justify-center ${glow}`}>
        <Icon className={`w-8 h-8 text-${color}-500`} />
        {state === "open" && (
          <motion.div
            className="absolute inset-0 rounded-sm border-2 border-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      <div>
        <div className={`text-lg font-bold font-mono text-${color}-500`}>{label}</div>
        <div className="text-[11px] text-muted-foreground">{sublabel}</div>
      </div>
    </div>
  );
}

// =============================================================================
// RULE TOGGLE
// =============================================================================

function RuleToggle({
  rule,
  onToggle,
}: {
  rule: Rule;
  onToggle: (id: string) => void;
}) {
  const Icon = rule.icon;

  return (
    <motion.div
      layout
      className={`
        p-4 rounded-sm border transition-all cursor-pointer
        ${rule.enabled
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border bg-black/20 hover:border-border/80"
        }
      `}
      onClick={() => onToggle(rule.id)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${
            rule.enabled ? "bg-emerald-500/20" : "bg-white/5"
          }`}>
            <Icon className={`w-4 h-4 ${rule.enabled ? "text-emerald-500" : "text-muted-foreground"}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${rule.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                {rule.name}
              </span>
              {rule.value && (
                <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-muted-foreground">
                  {rule.value}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{rule.description}</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className={`
          w-10 h-5 rounded-full p-0.5 transition-colors
          ${rule.enabled ? "bg-emerald-500" : "bg-white/10"}
        `}>
          <motion.div
            className="w-4 h-4 rounded-full bg-white"
            animate={{ x: rule.enabled ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// AGENT STATUS ROW
// =============================================================================

function AgentStatusRow({ agent }: { agent: AgentStatus }) {
  const stateConfig = {
    closed: { color: "emerald", label: "Active" },
    open: { color: "red", label: "Tripped" },
    half_open: { color: "amber", label: "Testing" },
  };

  const { color, label } = stateConfig[agent.state];

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
        <span className="font-mono text-sm">{agent.name}</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-muted-foreground">
          Anomalies: <span className={agent.anomalyCount > 0 ? "text-amber-500" : "text-foreground"}>{agent.anomalyCount}</span>
        </span>
        <span className={`font-mono text-${color}-500`}>{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}

// =============================================================================
// METRIC CARD
// =============================================================================

function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  color = "foreground",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="p-4 rounded-sm border border-border bg-black/20">
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-2xl font-bold font-mono text-${color}`}>{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
        </div>
        <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      {delta && (
        <div className={`text-[11px] font-mono mt-2 ${delta.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
          {delta} from last hour
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CircuitBreakerPanel() {
  const [circuitState, setCircuitState] = useState<CircuitState>("closed");
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "max_tx_value",
      name: "Max Transaction Value",
      description: "Block transactions exceeding this amount",
      enabled: true,
      type: "limit",
      value: "10 SOL",
      icon: Gauge,
    },
    {
      id: "daily_limit",
      name: "Daily Spend Limit",
      description: "Maximum daily spending across all agents",
      enabled: true,
      type: "limit",
      value: "100 SOL",
      icon: Lock,
    },
    {
      id: "program_allowlist",
      name: "Program Allowlist",
      description: "Only allow transactions to approved programs",
      enabled: true,
      type: "allowlist",
      value: "5 programs",
      icon: Shield,
    },
    {
      id: "rate_limit",
      name: "Rate Limiting",
      description: "Max 10 transactions per minute per agent",
      enabled: false,
      type: "rate",
      value: "10 tx/min",
      icon: Activity,
    },
    {
      id: "blacklist_mode",
      name: "Blacklist Mode",
      description: "Block all transactions to known malicious programs",
      enabled: true,
      type: "blocklist",
      icon: Ban,
    },
  ]);

  const [agents] = useState<AgentStatus[]>([
    { id: "1", name: "Alpha-7", state: "closed", anomalyCount: 0, lastTransaction: new Date() },
    { id: "2", name: "Sentinel-3", state: "closed", anomalyCount: 2, lastTransaction: new Date() },
    { id: "3", name: "Trader-X9", state: "half_open", anomalyCount: 4, lastTransaction: new Date() },
    { id: "4", name: "Vault-01", state: "closed", anomalyCount: 0, lastTransaction: new Date() },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const triggerCircuitBreaker = () => {
    setCircuitState("open");
  };

  const resetCircuitBreaker = () => {
    setCircuitState("closed");
  };

  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center">
            <Power className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h2 className="panel-title">Circuit Breaker Control</h2>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Emergency protection system
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Circuit State */}
        <div className="p-6 rounded-sm border border-border bg-black/40">
          <div className="flex items-center justify-between">
            <CircuitStateIndicator state={circuitState} />

            <div className="flex items-center gap-2">
              {circuitState === "closed" ? (
                <button
                  onClick={triggerCircuitBreaker}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium rounded-sm hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Emergency Trip
                </button>
              ) : (
                <button
                  onClick={resetCircuitBreaker}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-medium rounded-sm hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Circuit
                </button>
              )}
            </div>
          </div>

          {/* Warning when open */}
          <AnimatePresence>
            {circuitState === "open" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-sm"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-500">Circuit Breaker Active</div>
                    <div className="text-[11px] text-red-400/80 mt-1">
                      All agent transactions are currently blocked. Review the situation before resetting.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Active Rules"
            value={rules.filter((r) => r.enabled).length}
            icon={Shield}
            color="emerald-500"
          />
          <MetricCard
            label="Blocked Today"
            value="23"
            delta="+12"
            icon={Ban}
            color="red-500"
          />
          <MetricCard
            label="Anomalies"
            value="6"
            delta="+3"
            icon={AlertTriangle}
            color="amber-500"
          />
          <MetricCard
            label="Protected Agents"
            value={agents.length}
            icon={Lock}
          />
        </div>

        {/* Protection Rules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Protection Rules
            </h3>
            <button className="text-[10px] text-emerald-500 hover:text-emerald-400 transition-colors">
              + Add Rule
            </button>
          </div>
          <div className="space-y-2">
            {rules.map((rule) => (
              <RuleToggle key={rule.id} rule={rule} onToggle={toggleRule} />
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div>
          <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
            Agent Status
          </h3>
          <div className="border border-border rounded-sm bg-black/20">
            {agents.map((agent) => (
              <AgentStatusRow key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-black/20 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
        <span className="text-[10px] text-emerald-500">● System Operational</span>
      </div>
    </div>
  );
}
