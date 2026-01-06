"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Settings,
  Bell,
  User,
  ChevronDown,
  Activity,
  Clock,
  Menu,
  X,
} from "lucide-react";

import { LiveTransactionFeed } from "@/components/dashboard/live-transaction-feed";
import { CircuitBreakerPanel } from "@/components/dashboard/circuit-breaker-panel";
import { ThreatMap } from "@/components/dashboard/threat-map";

// =============================================================================
// HEADER COMPONENT
// =============================================================================

function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span className="font-mono font-bold text-sm tracking-wide text-zinc-200">KYVERN SHIELD</span>
        </Link>
        <div className="hidden md:block h-5 w-px bg-zinc-800" />
        <span className="hidden md:block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Command Center
        </span>
      </div>

      {/* Center Status */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 status-glow-safe animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            All Systems Operational
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
          <Clock className="w-3 h-3" />
          <span>{new Date().toLocaleTimeString("en-US", { hour12: false })}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="hidden md:flex p-2 rounded hover:bg-zinc-800/50 transition-colors relative">
          <Bell className="w-4 h-4 text-zinc-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <button className="hidden md:flex p-2 rounded hover:bg-zinc-800/50 transition-colors">
          <Settings className="w-4 h-4 text-zinc-500" />
        </button>
        <div className="hidden md:block h-5 w-px bg-zinc-800 mx-1" />
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded hover:bg-zinc-800/50 transition-colors">
          <div className="w-6 h-6 rounded bg-emerald-950/50 border border-emerald-900/30 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="font-mono text-xs text-zinc-300">Operator</span>
          <ChevronDown className="w-3 h-3 text-zinc-600" />
        </button>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-zinc-800/50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-zinc-500" />
          ) : (
            <Menu className="w-5 h-5 text-zinc-500" />
          )}
        </button>
      </div>
    </header>
  );
}

// =============================================================================
// STATUS BAR
// =============================================================================

function StatusBar() {
  return (
    <div className="h-8 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-zinc-600" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            Network
          </span>
          <span className="font-mono text-[10px] text-emerald-500">Solana Mainnet</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            Block
          </span>
          <span className="font-mono text-[10px] text-zinc-400">289,456,123</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            TPS
          </span>
          <span className="font-mono text-[10px] text-zinc-400">3,247</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            Agents
          </span>
          <span className="font-mono text-[10px] text-emerald-500">7 Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            Latency
          </span>
          <span className="font-mono text-[10px] text-emerald-500">12ms</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD PAGE
// =============================================================================

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Status Bar */}
      <StatusBar />

      {/* Main Grid Layout */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Transaction Feed */}
          <div className="lg:col-span-7 xl:col-span-8 h-[600px] lg:h-full">
            <LiveTransactionFeed enableMockData={true} />
          </div>

          {/* Right Column - Map & Circuit Breaker */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 h-auto lg:h-full">
            {/* Threat Map */}
            <div className="h-[350px] lg:h-[45%] lg:min-h-[300px]">
              <ThreatMap />
            </div>

            {/* Circuit Breaker */}
            <div className="h-[500px] lg:flex-1 lg:min-h-[350px]">
              <CircuitBreakerPanel />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-8 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-zinc-600">
            Kyvern Shield v0.1.0
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-zinc-700">|</span>
          <span className="hidden sm:inline font-mono text-[10px] text-zinc-600">
            Secure. Monitor. Protect.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-zinc-600">
            UTC {new Date().toISOString().slice(11, 19)}
          </span>
        </div>
      </footer>
    </div>
  );
}
