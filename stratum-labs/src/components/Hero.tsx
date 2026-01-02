"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal as TerminalIcon, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Constellation from "./Constellation";

function LiveTerminal() {
  const [lines, setLines] = useState<string[]>([
    "> INITIALIZING SENTINEL NODE...",
  ]);

  useEffect(() => {
    const sequence = [
      { text: "> CONNECTED TO SOLANA MAINNET", delay: 800 },
      { text: "> MONITORING MEMPOOL...", delay: 1500 },
      { text: "🐋 WHALE ALERT: 50,000 SOL MOVED", delay: 2400, highlight: true },
      { text: "> WALLET: 8x...f3a (Binance Cold)", delay: 2500 },
      { text: "> SIGNAL: HIGH VOLATILITY EXPECTED", delay: 3200, warning: true },
      { text: "> EXECUTING PROTOCOL: SAFEGUARD_GAMMA", delay: 4000 },
      { text: "> ASSETS SECURED.", delay: 4800, success: true },
    ];

    let timeouts: NodeJS.Timeout[] = [];

    sequence.forEach(({ text, delay, highlight, warning, success }) => {
      const timeout = setTimeout(() => {
        setLines((prev) => {
          const newLine = (
            <span key={text + Date.now()} className={`${highlight ? 'text-blue-400 font-bold' : warning ? 'text-yellow-400' : success ? 'text-emerald-400' : 'text-gray-400'}`}>
              {text}
            </span>
          );
          return [...prev.slice(-4), newLine as any]; // Keep last 5 lines
        });
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-black/80 border border-white/20 rounded-xl p-4 font-mono text-xs shadow-2xl shadow-blue-500/10 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50" />
      <div className="flex gap-2 mb-4 opacity-50">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
      </div>
      <div className="flex flex-col gap-1.5 h-[120px]">
        <AnimatePresence mode="popLayout">
          {lines.map((line: any, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              layout
              className="truncate"
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GlowButton({ children, variant = "primary", icon: Icon }: { children: React.ReactNode; variant?: "primary" | "secondary"; icon?: React.ElementType }) {
  if (variant === "primary") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow duration-300"
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {Icon && <Icon className="w-5 h-5" />}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 font-bold text-lg text-white backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-400/50"
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />}
        {children}
      </span>
    </motion.button>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Aurora Background */}
      <div className="absolute inset-0 aurora-bg -z-20" />

      {/* Constellation Layer */}
      <div className="absolute inset-0 z-0">
        <Constellation />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Status Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Zap className="w-4 h-4 text-blue-400 fill-blue-400 animate-pulse" />
            <span className="text-sm font-bold text-blue-100 tracking-wide uppercase">
              Shipping Agents in 48 Hours
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <div className="relative mb-10">
          {/* Holographic Glow Behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full -z-10" />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[0.95] drop-shadow-2xl"
          >
            We Deploy Custom
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 animate-gradient-x">
              AI Infrastructure
            </span>
            <br />
            for Web3.
          </motion.h1>
        </div>

        {/* Subheaded */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
        >
          Stop FUD. Track Whales. Automate Governance.
          <br className="hidden md:block" />
          Production-ready protection for your community.
        </motion.p>

        {/* Live Terminal Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <LiveTerminal />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
        >
          <GlowButton variant="primary" icon={ArrowRight}>
            Get Your Bot ($150)
          </GlowButton>
          <GlowButton variant="secondary" icon={TerminalIcon}>
            View Live Demo
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
