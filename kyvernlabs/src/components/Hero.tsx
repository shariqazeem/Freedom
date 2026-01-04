"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const clients = [
  "Superteam",
  "Parallax",
  "Solana",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-white/[0.03] to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-16"
        >
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-gray-500 font-medium">
              Accepting new projects
            </span>
          </div>

          {/* Client logos placeholder */}
          <div className="hidden md:flex items-center gap-6">
            <span className="text-xs text-gray-600 uppercase tracking-wider">Trusted by</span>
            <div className="flex items-center gap-4">
              {clients.map((client) => (
                <span key={client} className="text-xs text-gray-500 font-medium">
                  {client}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text */}
          <div>
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[clamp(2.5rem,6vw,5rem)] font-bold text-white leading-[1] tracking-[-0.03em] mb-6"
            >
              We build
              <br />
              <span className="text-gray-500">sovereign</span>
              <br />
              infrastructure.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-400 max-w-lg leading-relaxed mb-10"
            >
              Full-stack venture studio specializing in autonomous AI agents,
              smart contracts, and high-performance interfaces for Web3.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white font-medium text-sm hover:bg-white/5 hover:border-white/30 transition-all"
              >
                View Work
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>
          </div>

          {/* Right column - Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="border border-white/10 bg-white/[0.02] p-8">
              {/* Card header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">Kyvern Labs</h3>
                  <p className="text-xs text-gray-500">Venture Studio</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-500">Active</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "10+", label: "Products Shipped", sublabel: "2025" },
                  { value: "48h", label: "Avg. Delivery", sublabel: "MVP to Production" },
                  { value: "24h", label: "Response Time", sublabel: "Quote Delivery" },
                  { value: "100%", label: "Completion Rate", sublabel: "On-Time Delivery" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                    <div className="text-[10px] text-gray-600">{stat.sublabel}</div>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Est. 2026 · Remote-First</span>
                  <a href="#work" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    See our work
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:hidden mt-16 grid grid-cols-2 gap-6 pt-8 border-t border-white/10"
        >
          {[
            { value: "10+", label: "Products Shipped" },
            { value: "48h", label: "Avg. Delivery" },
            { value: "24h", label: "Response Time" },
            { value: "100%", label: "On-Time" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
