"use client";

import { motion } from "framer-motion";
import { Shield, ArrowUpRight, Activity, Zap, Lock, Eye, FlaskConical, FileText } from "lucide-react";

const products = [
  {
    id: "shield",
    title: "Kyvern Shield",
    subtitle: "Transaction Firewall for AI Agents",
    category: "Security Infrastructure",
    description:
      "Real-time security layer that protects autonomous AI agents from prompt injection attacks, wallet drains, and unauthorized transactions. Multi-layer analysis pipeline with sub-50ms latency.",
    status: "Live Beta",
    statusColor: "bg-emerald-500",
    link: "https://shield.kyvern.network",
    localLink: "/dashboard",
    features: [
      { label: "Indirect Injection Defense", icon: Shield },
      { label: "Heuristic Analysis", icon: Activity },
      { label: "Circuit Breaker", icon: Zap },
      { label: "Real-time Dashboard", icon: Eye },
    ],
    metrics: [
      { value: "<50ms", label: "Latency" },
      { value: "99.9%", label: "Uptime" },
      { value: "0", label: "Breaches" },
    ],
    featured: true,
    gradient: "from-emerald-500/10 via-transparent to-transparent",
  },
];

const research = [
  {
    title: "Indirect Prompt Injection Defense",
    description: "Novel sandbox trigger mechanism for detecting malicious instructions in external data sources.",
    tag: "Security",
  },
  {
    title: "The AI Agent Security Crisis",
    description: "Why autonomous agents represent a fundamentally new security challenge for Web3.",
    tag: "Whitepaper",
  },
  {
    title: "Threat Landscape 2026",
    description: "Comprehensive analysis of attack vectors targeting AI agents in decentralized systems.",
    tag: "Analysis",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-32 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-white/20" />
            <span className="text-xs text-gray-500 uppercase tracking-[0.3em] font-medium">
              Products
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Research to
                <br />
                <span className="text-gray-500">production.</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-md text-base leading-relaxed lg:text-right">
              We build and ship our own infrastructure products. Kyvern Shield is our flagship security layer for autonomous AI agents.
            </p>
          </div>
        </motion.div>

        {/* Featured Product - Kyvern Shield */}
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative mb-16"
          >
            <div className="relative border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden bg-[#0a0a0a]">
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Header bar */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${product.statusColor} animate-pulse`} />
                    <span className="text-xs text-gray-400 font-medium">{product.status}</span>
                    <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Flagship Product
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Research-Backed</span>
                  </div>
                </div>

                {/* Main content */}
                <div className="p-8 md:p-10">
                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left column */}
                    <div>
                      {/* Category & Title */}
                      <div className="mb-6">
                        <span className="text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">
                          {product.category}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight flex items-center gap-4">
                          <Shield className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                          {product.title}
                        </h3>
                        <p className="text-lg text-gray-400 mt-2">{product.subtitle}</p>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 leading-relaxed mb-8">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {product.features.map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <div key={feature.label} className="flex items-center gap-3">
                              <div className="w-8 h-8 border border-white/10 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-emerald-500/70" strokeWidth={1.5} />
                              </div>
                              <span className="text-sm text-gray-400">{feature.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* CTA */}
                      <a
                        href={product.localLink}
                        className="group/btn inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Launch Shield Console
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>

                    {/* Right column - Metrics card */}
                    <div className="flex items-center">
                      <div className="w-full border border-white/10 bg-white/[0.02] p-8">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-1">Shield Metrics</h4>
                            <p className="text-xs text-gray-500">Real-time performance</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-gray-500">Live</span>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-6">
                          {product.metrics.map((metric) => (
                            <div key={metric.label} className="text-center">
                              <div className="text-2xl font-bold text-white tracking-tight">
                                {metric.value}
                              </div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Security badge */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Lock className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs text-gray-500">Solana Native</span>
                            </div>
                            <span className="text-xs text-gray-600">Open Source</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Research Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-500" />
              <h3 className="text-xl font-bold text-white">Published Research</h3>
            </div>
            <span className="text-xs text-gray-500">Peer-reviewed security research</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {research.map((paper, index) => (
              <motion.div
                key={paper.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group border border-white/10 hover:border-white/20 bg-[#0a0a0a] p-6 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    {paper.tag}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
                  {paper.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {paper.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-white/10 bg-white/[0.02]"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Secure your agents today
            </h3>
            <p className="text-sm text-gray-500">
              Deploy Kyvern Shield in minutes. Open source and production ready.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/kyvernlabs/shield"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-6 py-3.5 border border-white/20 text-white font-medium text-sm flex items-center gap-2 hover:bg-white/5 hover:border-white/30 transition-all"
            >
              View on GitHub
              <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="/dashboard"
              className="group px-6 py-3.5 bg-white text-black font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              Try Shield
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
