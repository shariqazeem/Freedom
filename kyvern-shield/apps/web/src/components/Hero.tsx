"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// =============================================================================
// ANIMATED GRID BACKGROUND
// =============================================================================

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(16, 185, 129, 0.06) 0%, transparent 40%),
            radial-gradient(ellipse 50% 30% at 20% 80%, rgba(6, 182, 212, 0.04) 0%, transparent 40%)
          `,
        }}
      />

      {/* Animated scan line */}
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        style={{ boxShadow: "0 0 40px 10px rgba(6, 182, 212, 0.1)" }}
      />

      {/* Corner accents */}
      <div className="absolute top-20 left-20 w-32 h-32 border-l border-t border-cyan-500/10" />
      <div className="absolute top-20 right-20 w-32 h-32 border-r border-t border-emerald-500/10" />
      <div className="absolute bottom-20 left-20 w-32 h-32 border-l border-b border-emerald-500/10" />
      <div className="absolute bottom-20 right-20 w-32 h-32 border-r border-b border-cyan-500/10" />
    </div>
  );
}

// =============================================================================
// FLOATING PARTICLES
// =============================================================================

function FloatingNodes() {
  const nodes = [
    { x: "15%", y: "25%", delay: 0, size: 3 },
    { x: "85%", y: "30%", delay: 1.5, size: 2 },
    { x: "75%", y: "70%", delay: 0.8, size: 4 },
    { x: "25%", y: "75%", delay: 2.2, size: 2 },
    { x: "50%", y: "15%", delay: 1, size: 3 },
    { x: "90%", y: "50%", delay: 0.5, size: 2 },
    { x: "10%", y: "50%", delay: 1.8, size: 3 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-cyan-500"
          style={{
            left: node.x,
            top: node.y,
            width: node.size,
            height: node.size,
            boxShadow: `0 0 ${node.size * 4}px ${node.size}px rgba(6, 182, 212, 0.3)`,
          }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// HERO COMPONENT
// =============================================================================

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20 overflow-hidden">
      <GridBackground />
      <FloatingNodes />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Research badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-8"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
          </span>
          Kyvern Labs Research
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="block text-zinc-100">The Intelligence Layer</span>
          <span className="block mt-2">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              for the Agent Economy
            </span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Sovereign infrastructure for autonomous AI.
          <span className="text-zinc-300"> Securing the next trillion interactions.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-zinc-950 font-semibold rounded-lg hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20"
          >
            Launch Shield Console
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://docs.kyvern.network"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto px-8 py-4 border border-zinc-700 text-zinc-300 font-medium rounded-lg hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <BookOpen className="w-4 h-4" />
            Read Research
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-zinc-800/50"
        >
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4 font-mono">
            Built for the Future of Autonomous Systems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-mono">Solana Native</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-sm font-mono">Sub-50ms Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-mono">Open Research</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </section>
  );
}

export default Hero;
