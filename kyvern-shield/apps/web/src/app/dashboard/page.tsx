"use client";

import {
  Activity,
  Loader2,
} from "lucide-react";

import { LiveTransactionFeed } from "@/components/dashboard/live-transaction-feed";
import { CircuitBreakerPanel } from "@/components/dashboard/circuit-breaker-panel";
import { ThreatMap } from "@/components/dashboard/threat-map";
import { DashboardHeader } from "@/components/dashboard/header";
import { useAuth } from "@/lib/auth-context";

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
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

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
