"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Database, Terminal, Cpu, Network } from "lucide-react";
import { useState } from "react";

const modules = [
  {
    id: "sentinel",
    title: "MODULE A: SENTINEL",
    subtitle: "Threat Detection Engine",
    description: "Real-time FUD analysis and anti-raid protection network.",
    icon: Shield,
    terminalCode: [
      "> SCANNING MEMPOOL...",
      "> THREAT DETECTED: 0",
      "> SOCIAL SENTIMENT: 98% POSITIVE",
      "> STATUS: ACTIVE"
    ],
    colSpan: "md:col-span-2",
  },
  {
    id: "overseer",
    title: "MODULE B: OVERSEER",
    subtitle: "On-Chain Analytics",
    description: "Institutional-grade whale tracking and wallet taxonomy.",
    icon: Eye,
    terminalCode: [
      "> TRACKING WALLET: 0x7a...4f2",
      "> BALANCE: 4,500 ETH",
      "> ALERT: ACCUMULATION DETECTED",
      "> SIGNAL: BULLISH"
    ],
    colSpan: "md:col-span-1",
  },
  {
    id: "architect",
    title: "MODULE C: ARCHITECT",
    subtitle: "Governance Automation",
    description: "Self-executing proposals and treasury management.",
    icon: Database,
    terminalCode: [
      "> PROPOSAL_ID: 1042",
      "> QUORUM: REACHED",
      "> EXECUTING TIMELOCK...",
      "> SUCCESS"
    ],
    colSpan: "md:col-span-1",
  },
  {
    id: "neural-net",
    title: "MODULE D: NEURAL",
    subtitle: "Predictive Modeling",
    description: "AI forecasting for liquidity needs and bridge volume.",
    icon: Network,
    terminalCode: [
      "> TRAINING EPOCH 400",
      "> ACCURACY: 99.4%",
      "> PREDICTING BRIDGE SPIKE",
      "> REBALANCING..."
    ],
    colSpan: "md:col-span-2",
  }
];

function TerminalView({ lines }: { lines: string[] }) {
  return (
    <div className="absolute inset-0 bg-black/90 p-6 font-mono text-xs text-green-500 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
      <div className="flex gap-2 mb-2 border-b border-green-500/20 pb-2">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
      </div>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {line}
        </motion.div>
      ))}
      <motion.div
        animate={{ opacity: [0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-2 h-4 bg-green-500"
      />
    </div>
  );
}

function BentoCard({ module }: { module: typeof modules[0] }) {
  const Icon = module.icon;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative group overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cobalt/50 transition-colors duration-500 h-[300px] ${module.colSpan}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cobalt/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Normal Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between group-hover:opacity-10 transition-opacity duration-300">
        <div>
          <div className="mb-6 flex items-start justify-between">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-cobalt">
              <Icon size={24} />
            </div>
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">{module.title}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{module.subtitle}</h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{module.description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          SYSTEM ONLINE
        </div>
      </div>

      {/* Hover Terminal Reveal */}
      <TerminalView lines={module.terminalCode} />
    </motion.div>
  );
}

export default function BentoGrid() {
  return (
    <section className="py-20 px-6 bg-obsidian">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-l-2 border-cobalt pl-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Adaptive Intelligence Modules
          </h2>
          <p className="text-gray-400 max-w-xl text-lg">
            A modular architecture designed for the unpredictable nature of Web3.
            Select your stack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <BentoCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </section>
  );
}
