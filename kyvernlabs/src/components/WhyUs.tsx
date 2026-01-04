"use client";

import { motion } from "framer-motion";
import { Zap, Bot, Link, Clock, Sparkles, Shield } from "lucide-react";

const advantages = [
  {
    icon: Clock,
    title: "48-Hour MVPs",
    description: "While others schedule kickoff meetings, we're shipping production code.",
    stat: "48h",
    statLabel: "Average MVP Time",
  },
  {
    icon: Bot,
    title: "Native AI Integration",
    description: "Every project is AI-first. We don't bolt on intelligence—we build with it.",
    stat: "100%",
    statLabel: "AI-Enhanced",
  },
  {
    icon: Link,
    title: "On-Chain DNA",
    description: "Born in Web3. We think in transactions, blocks, and cryptographic primitives.",
    stat: "3+",
    statLabel: "Years On-Chain",
  },
];

const differentiators = [
  { icon: Zap, text: "Vibe coding at lightspeed" },
  { icon: Sparkles, text: "AI-augmented development" },
  { icon: Shield, text: "Battle-tested architecture" },
];

export default function WhyUs() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* Ambient lights */}
        <div className="absolute top-1/2 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] block mb-4">
            Why Kyvern
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">Most agencies are</span>{" "}
            <span className="text-gray-500">slow.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              We vibe-code at lightspeed.
            </span>
          </h2>
        </motion.div>

        {/* Main Advantages Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {advantages.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                    </div>

                    {/* Stat */}
                    <div className="mb-4">
                      <div className="text-5xl font-bold text-white mb-1">{item.stat}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{item.statLabel}</div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Differentiators Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors"
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300 font-medium">{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid md:grid-cols-2 gap-8"
        >
          {/* Traditional Agency */}
          <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20">
            <div className="text-red-400 text-sm font-bold uppercase tracking-wider mb-4">Traditional Agency</div>
            <ul className="space-y-3">
              {[
                "2-week discovery phase",
                "Waterfall methodology",
                "Separate AI/Web3 teams",
                "Months to MVP",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Kyvern Labs */}
          <div className="p-8 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4">Kyvern Labs</div>
            <ul className="space-y-3">
              {[
                "Same-day prototyping",
                "AI-accelerated sprints",
                "Full-stack native team",
                "48-hour MVP delivery",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
