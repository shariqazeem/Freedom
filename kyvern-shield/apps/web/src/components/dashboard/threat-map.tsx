"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Activity } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface AgentNode {
  id: string;
  name: string;
  location: { x: number; y: number }; // Percentage positions
  status: "active" | "warning" | "blocked";
  region: string;
  transactionsPerMin: number;
}

interface ThreatEvent {
  id: string;
  type: "blocked" | "anomaly";
  source: { x: number; y: number };
  target: { x: number; y: number };
  timestamp: Date;
}

// =============================================================================
// AGENT NODE COMPONENT
// =============================================================================

function AgentNodeMarker({ node }: { node: AgentNode }) {
  const statusColors = {
    active: {
      bg: "bg-emerald-500",
      ring: "ring-emerald-500/30",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.6)]",
    },
    warning: {
      bg: "bg-amber-500",
      ring: "ring-amber-500/30",
      glow: "shadow-[0_0_12px_rgba(245,158,11,0.6)]",
    },
    blocked: {
      bg: "bg-red-500",
      ring: "ring-red-500/30",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.6)]",
    },
  };

  const colors = statusColors[node.status];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute group cursor-pointer"
      style={{
        left: `${node.location.x}%`,
        top: `${node.location.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Pulse ring */}
      <motion.div
        className={`absolute inset-0 rounded-full ${colors.bg} opacity-30`}
        animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Main dot */}
      <div className={`relative w-3 h-3 rounded-full ${colors.bg} ${colors.glow} ring-4 ${colors.ring}`} />

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-card border border-border rounded-sm p-2 shadow-xl min-w-[140px]">
          <div className="text-xs font-mono font-bold text-foreground">{node.name}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{node.region}</div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
            <Activity className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {node.transactionsPerMin} tx/min
            </span>
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card" />
      </div>
    </motion.div>
  );
}

// =============================================================================
// ATTACK LINE ANIMATION
// =============================================================================

function AttackLine({ event }: { event: ThreatEvent }) {
  const isBlocked = event.type === "blocked";

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <defs>
        <linearGradient id={`gradient-${event.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isBlocked ? "#ef4444" : "#f59e0b"} stopOpacity="0" />
          <stop offset="50%" stopColor={isBlocked ? "#ef4444" : "#f59e0b"} stopOpacity="1" />
          <stop offset="100%" stopColor={isBlocked ? "#ef4444" : "#f59e0b"} stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.line
        x1={`${event.source.x}%`}
        y1={`${event.source.y}%`}
        x2={`${event.target.x}%`}
        y2={`${event.target.y}%`}
        stroke={`url(#gradient-${event.id})`}
        strokeWidth="2"
        strokeDasharray="8 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Impact point */}
      <motion.circle
        cx={`${event.target.x}%`}
        cy={`${event.target.y}%`}
        r="0"
        fill="none"
        stroke={isBlocked ? "#ef4444" : "#f59e0b"}
        strokeWidth="2"
        initial={{ r: 0, opacity: 1 }}
        animate={{ r: 20, opacity: 0 }}
        transition={{ duration: 0.8 }}
      />
    </motion.svg>
  );
}

// =============================================================================
// WORLD MAP SVG (Simplified)
// =============================================================================

function WorldMapSVG() {
  return (
    <svg
      viewBox="0 0 1000 500"
      className="w-full h-full"
      style={{ opacity: 0.15 }}
    >
      {/* Simplified world map paths - continents outlines */}
      <path
        d="M150,120 Q200,100 250,110 L300,100 Q350,90 400,100 L450,95 Q480,100 500,120 L520,110 Q560,100 600,110 L640,100 Q680,90 720,100 L780,110 Q820,120 850,100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-white"
      />
      {/* North America */}
      <path
        d="M100,150 Q150,130 200,140 L250,135 Q280,145 300,160 L280,180 Q260,200 240,210 L220,200 Q180,190 150,200 L120,190 Q100,180 100,150"
        fill="currentColor"
        className="text-white/20"
      />
      {/* South America */}
      <path
        d="M200,260 Q230,250 250,270 L260,300 Q255,340 240,370 L220,390 Q200,380 190,350 L195,310 Q190,280 200,260"
        fill="currentColor"
        className="text-white/20"
      />
      {/* Europe */}
      <path
        d="M440,120 Q480,110 520,120 L550,130 Q560,150 540,160 L500,155 Q470,160 450,150 L440,130 Q430,120 440,120"
        fill="currentColor"
        className="text-white/20"
      />
      {/* Africa */}
      <path
        d="M460,180 Q500,170 530,190 L550,230 Q560,280 540,320 L500,340 Q460,330 450,290 L455,240 Q450,200 460,180"
        fill="currentColor"
        className="text-white/20"
      />
      {/* Asia */}
      <path
        d="M560,100 Q620,90 700,100 L780,110 Q840,130 860,160 L850,200 Q820,230 760,220 L700,210 Q640,200 600,180 L570,150 Q550,120 560,100"
        fill="currentColor"
        className="text-white/20"
      />
      {/* Australia */}
      <path
        d="M780,300 Q820,290 850,310 L860,340 Q850,370 820,375 L790,360 Q770,340 780,300"
        fill="currentColor"
        className="text-white/20"
      />
      {/* Grid lines */}
      {[...Array(10)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={50 + i * 45}
          x2="1000"
          y2={50 + i * 45}
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-white/10"
        />
      ))}
      {[...Array(20)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={50 + i * 50}
          y1="0"
          x2={50 + i * 50}
          y2="500"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-white/10"
        />
      ))}
    </svg>
  );
}

// =============================================================================
// STATS OVERLAY
// =============================================================================

function MapStats({
  agents,
  blockedCount,
  anomalyCount,
}: {
  agents: AgentNode[];
  blockedCount: number;
  anomalyCount: number;
}) {
  const activeAgents = agents.filter((a) => a.status === "active").length;

  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 status-glow-safe" />
          <span className="text-[11px] font-mono">
            <span className="text-emerald-500">{activeAgents}</span>
            <span className="text-muted-foreground"> active</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[11px] font-mono">
            <span className="text-amber-500">{anomalyCount}</span>
            <span className="text-muted-foreground"> anomalies</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[11px] font-mono">
            <span className="text-red-500">{blockedCount}</span>
            <span className="text-muted-foreground"> blocked</span>
          </span>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground font-mono">
        UTC {new Date().toISOString().slice(11, 19)}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ThreatMap() {
  const [agents] = useState<AgentNode[]>([
    { id: "1", name: "Alpha-7", location: { x: 20, y: 35 }, status: "active", region: "US East", transactionsPerMin: 45 },
    { id: "2", name: "Sentinel-3", location: { x: 15, y: 45 }, status: "active", region: "US West", transactionsPerMin: 32 },
    { id: "3", name: "Trader-X9", location: { x: 48, y: 28 }, status: "warning", region: "EU Central", transactionsPerMin: 67 },
    { id: "4", name: "Vault-01", location: { x: 52, y: 32 }, status: "active", region: "EU West", transactionsPerMin: 23 },
    { id: "5", name: "Scout-12", location: { x: 75, y: 35 }, status: "active", region: "Asia Pacific", transactionsPerMin: 89 },
    { id: "6", name: "Guardian-5", location: { x: 85, y: 65 }, status: "active", region: "Australia", transactionsPerMin: 12 },
    { id: "7", name: "Nexus-8", location: { x: 30, y: 70 }, status: "blocked", region: "South America", transactionsPerMin: 0 },
  ]);

  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([]);
  const [blockedCount, setBlockedCount] = useState(23);
  const [anomalyCount, setAnomalyCount] = useState(6);

  // Simulate random threat events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const sourceAgent = agents[Math.floor(Math.random() * agents.length)];
        const newEvent: ThreatEvent = {
          id: Math.random().toString(36).substring(2),
          type: Math.random() > 0.5 ? "blocked" : "anomaly",
          source: { x: Math.random() * 100, y: Math.random() * 100 },
          target: sourceAgent?.location ?? { x: 50, y: 50 },
          timestamp: new Date(),
        };

        setThreatEvents((prev) => [...prev.slice(-5), newEvent]);

        if (newEvent.type === "blocked") {
          setBlockedCount((c) => c + 1);
        } else {
          setAnomalyCount((c) => c + 1);
        }

        // Remove event after animation
        setTimeout(() => {
          setThreatEvents((prev) => prev.filter((e) => e.id !== newEvent.id));
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center">
            <Globe className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h2 className="panel-title">Global Threat Map</h2>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Real-time agent network status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-muted-foreground">LIVE</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden bg-black/40">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay-dense" />

        {/* World map */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <WorldMapSVG />
        </div>

        {/* Attack lines */}
        <AnimatePresence>
          {threatEvents.map((event) => (
            <AttackLine key={event.id} event={event} />
          ))}
        </AnimatePresence>

        {/* Agent nodes */}
        {agents.map((agent) => (
          <AgentNodeMarker key={agent.id} node={agent} />
        ))}

        {/* Stats overlay */}
        <MapStats
          agents={agents}
          blockedCount={blockedCount}
          anomalyCount={anomalyCount}
        />

        {/* Corner decorations - surveillance aesthetic */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/20" />
        <div className="absolute bottom-16 left-4 w-8 h-8 border-l-2 border-b-2 border-white/20" />
        <div className="absolute bottom-16 right-4 w-8 h-8 border-r-2 border-b-2 border-white/20" />
      </div>
    </div>
  );
}
