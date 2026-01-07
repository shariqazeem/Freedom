"use client";

import Link from "next/link";
import {
  Shield,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import { LiveTransactionFeed } from "@/components/dashboard/live-transaction-feed";
import { CircuitBreakerPanel } from "@/components/dashboard/circuit-breaker-panel";
import { ThreatMap } from "@/components/dashboard/threat-map";

// =============================================================================
// HEADER COMPONENT (Matching kyvernlabs design)
// =============================================================================

function DashboardHeader() {
  return (
    <header className="border-b border-white/10 bg-[#050505]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <Link href="https://kyvernlabs.com" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm text-white tracking-tight">KYVERN SHIELD</span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-white font-medium"
            >
              Monitor
            </Link>
            <Link
              href="/dashboard/integration"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Integration
            </Link>
            <a
              href="https://docs.kyvernlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1"
            >
              Docs
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </nav>
        </div>

        {/* Right - Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-500">All Systems Operational</span>
          </div>
          <a
            href="https://kyvernlabs.com"
            className="text-sm text-gray-500 hover:text-white transition-colors hidden md:block"
          >
            kyvernlabs.com
          </a>
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// STATUS BAR (Matching kyvernlabs design)
// =============================================================================

function StatusBar() {
  return (
    <div className="border-b border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              Network
            </span>
            <span className="text-[10px] text-emerald-500">Solana Mainnet</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              Block
            </span>
            <span className="text-[10px] text-gray-400">289,456,123</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              TPS
            </span>
            <span className="text-[10px] text-gray-400">3,247</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              Agents
            </span>
            <span className="text-[10px] text-emerald-500">7 Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              Latency
            </span>
            <span className="text-[10px] text-emerald-500">12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD PAGE (Matching kyvernlabs design)
// =============================================================================

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Status Bar */}
      <StatusBar />

      {/* Main Grid Layout */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-6 h-full">
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Transaction Feed */}
            <div className="lg:col-span-7 xl:col-span-8 h-[600px] lg:h-full">
              <LiveTransactionFeed pollingInterval={2000} />
            </div>

            {/* Right Column - Map & Circuit Breaker */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 h-auto lg:h-full">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">
              Kyvern Shield v0.1.0
            </span>
            <span className="hidden sm:inline text-xs text-gray-700">|</span>
            <a
              href="https://kyvernlabs.com"
              className="hidden sm:inline text-xs text-gray-500 hover:text-white transition-colors"
            >
              kyvernlabs.com
            </a>
          </div>
          <span className="text-xs text-gray-600">
            Built by Kyvern Labs
          </span>
        </div>
      </footer>
    </div>
  );
}
