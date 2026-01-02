"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal, Activity } from "lucide-react";
import Constellation from "./Constellation";

function GlowButton({ children, variant = "primary", icon: Icon }: { children: React.ReactNode; variant?: "primary" | "secondary"; icon?: React.ElementType }) {
  if (variant === "primary") {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative px-8 py-4 rounded-none border border-cobalt/50 bg-cobalt/10 overflow-hidden font-mono uppercase tracking-widest text-sm text-cobalt hover:text-white transition-colors"
      >
        <div className="absolute inset-0 bg-cobalt/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {Icon && <Icon className="w-4 h-4" />}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group px-8 py-4 rounded-none border border-white/10 bg-white/5 hover:bg-white/10 font-mono uppercase tracking-widest text-sm text-gray-400 hover:text-white transition-colors"
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
    </motion.button>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Swiss-style ease
    },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Constellation />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        {/* Status Line */}
        <motion.div variants={itemVariants} className="mb-12 flex justify-center">
          <div className="inline-flex items-center gap-4 px-4 py-1 border-l border-r border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cobalt" />
            </span>
            <span className="text-xs font-mono text-cobalt tracking-[0.2em] uppercase">
              System Operational
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-10 text-white uppercase mix-blend-screen"
        >
          The Sovereign
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cobalt to-ultraviolet">
            Intelligence
          </span>{" "}
          Layer
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed font-light tracking-wide"
        >
          Autonomous infrastructure for the modular era. Deploy adaptive agents that protect, monitor, and govern your on-chain sovereignty.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
        >
          <GlowButton variant="primary" icon={ArrowRight}>
            Initialize Core
          </GlowButton>
          <GlowButton variant="secondary" icon={Terminal}>
            View Documentation
          </GlowButton>
        </motion.div>

        {/* Trusted Infrastructure Ticker */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl mx-auto border-t border-white/10 pt-8"
        >
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-6">
            Trusted Infrastructure
          </p>
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {["SOLANA", "BASE", "ETHEREUM", "HYPERLIQUID"].map((chain) => (
              <span key={chain} className="text-lg font-bold tracking-tight text-white/80 font-mono">
                {chain}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
