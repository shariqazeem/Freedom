"use client";

import { Shield, Activity, Lock, Zap, ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";

// =============================================================================
// NODE GRID BACKGROUND FOR CARDS
// =============================================================================

function NodeGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Dot grid pattern */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="nodeGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" className="text-cyan-500/30" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nodeGrid)" />
      </svg>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <line x1="10%" y1="20%" x2="40%" y2="35%" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <line x1="40%" y1="35%" x2="70%" y2="25%" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <line x1="70%" y1="25%" x2="90%" y2="40%" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <line x1="30%" y1="70%" x2="60%" y2="80%" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <line x1="60%" y1="80%" x2="85%" y2="65%" stroke="url(#lineGradient)" strokeWidth="0.5" />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(6, 182, 212)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glowing nodes */}
      <div className="absolute w-2 h-2 bg-cyan-500 rounded-full top-[20%] left-[10%] shadow-[0_0_10px_2px_rgba(6,182,212,0.5)]" />
      <div className="absolute w-2 h-2 bg-emerald-500 rounded-full top-[35%] left-[40%] shadow-[0_0_10px_2px_rgba(16,185,129,0.5)]" />
      <div className="absolute w-2 h-2 bg-cyan-500 rounded-full top-[25%] left-[70%] shadow-[0_0_10px_2px_rgba(6,182,212,0.5)]" />
      <div className="absolute w-1.5 h-1.5 bg-emerald-500 rounded-full top-[70%] left-[30%] shadow-[0_0_8px_2px_rgba(16,185,129,0.4)]" />
      <div className="absolute w-1.5 h-1.5 bg-cyan-500 rounded-full top-[80%] left-[60%] shadow-[0_0_8px_2px_rgba(6,182,212,0.4)]" />
    </div>
  );
}

// =============================================================================
// PRODUCT CARD COMPONENT
// =============================================================================

interface ProductCardProps {
  title: string;
  description: string;
  status: string;
  statusColor: "cyan" | "emerald" | "amber";
  features: string[];
  href: string;
  icon: React.ElementType;
  featured?: boolean;
}

function ProductCard({
  title,
  description,
  status,
  statusColor,
  features,
  href,
  icon: Icon,
  featured = false,
}: ProductCardProps) {
  const statusColors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`
        group relative overflow-hidden rounded-xl border transition-all duration-500
        ${featured
          ? "border-cyan-500/30 bg-gradient-to-b from-cyan-500/5 to-transparent hover:border-cyan-500/50"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
        }
      `}
    >
      <NodeGridBackground />

      {/* Featured glow effect */}
      {featured && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
      )}

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`
            p-3 rounded-lg
            ${featured
              ? "bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/20"
              : "bg-zinc-800/50 border border-zinc-700/50"
            }
          `}>
            <Icon className={`w-6 h-6 ${featured ? "text-cyan-400" : "text-zinc-400"}`} />
          </div>
          <span className={`
            px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border
            ${statusColors[statusColor]}
          `}>
            {status}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className={`text-xl font-bold mb-3 ${featured ? "text-zinc-100" : "text-zinc-200"}`}>
          {title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          {description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-8">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-zinc-500">
              <div className={`w-1 h-1 rounded-full ${featured ? "bg-cyan-500" : "bg-zinc-600"}`} />
              {feature}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={href as Route}
          className={`
            inline-flex items-center gap-2 text-sm font-medium transition-colors
            ${featured
              ? "text-cyan-400 hover:text-cyan-300"
              : "text-zinc-400 hover:text-zinc-300"
            }
          `}
        >
          Explore {title}
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Bottom gradient accent */}
      {featured && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      )}
    </motion.div>
  );
}

// =============================================================================
// MAIN SECTION COMPONENT
// =============================================================================

export function ResearchProducts() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-zinc-950" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500 text-xs font-mono uppercase tracking-widest mb-6">
            Research Products
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Infrastructure for
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"> Autonomous Intelligence</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Production-grade security primitives born from peer-reviewed research.
            Deployed by the teams building the future.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Kyvern Shield - Featured */}
          <ProductCard
            title="Kyvern Shield"
            description="Real-time transaction firewall for AI Agents. Prevent prompt injection attacks, wallet drains, and unauthorized operations with sub-50ms latency."
            status="Live Beta"
            statusColor="emerald"
            icon={Shield}
            featured={true}
            href="/dashboard"
            features={[
              "Multi-layer threat analysis pipeline",
              "Indirect prompt injection defense",
              "Circuit breaker protection",
              "Real-time monitoring dashboard",
            ]}
          />

          {/* Kyvern Observatory - Coming Soon */}
          <ProductCard
            title="Kyvern Observatory"
            description="Comprehensive analytics and observability platform for autonomous agent networks. Understand behavior patterns across your entire fleet."
            status="Coming Q2"
            statusColor="amber"
            icon={Activity}
            href="#"
            features={[
              "Fleet-wide behavior analytics",
              "Anomaly detection & alerting",
              "Transaction flow visualization",
              "Compliance reporting",
            ]}
          />
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
        >
          {[
            { value: "< 50ms", label: "Analysis Latency", icon: Zap },
            { value: "99.9%", label: "Uptime SLA", icon: Activity },
            { value: "0", label: "Funds Lost", icon: Lock },
            { value: "3", label: "Research Papers", icon: Shield },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-4">
              <div className="inline-flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-cyan-500" />
                <span className="text-2xl font-bold text-zinc-100 font-mono">{stat.value}</span>
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Research CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center"
        >
          <a
            href="https://docs.kyvern.network/research"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors font-mono"
          >
            Explore our research publications
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ResearchProducts;
