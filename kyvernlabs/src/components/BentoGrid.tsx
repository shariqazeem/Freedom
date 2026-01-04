"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Database, Check } from "lucide-react";

const products = [
  {
    id: "sentinel",
    title: "Sentinel AI",
    badge: "Most Popular",
    price: "$299",
    description: "Anti-FUD & Raid Protection System.",
    features: ["Real-time Sentiment Analysis", "Auto-Mod Actions", "Raid Alerts"],
    icon: Shield,
    gradient: "from-purple-500/20 to-blue-500/20",
    glow: "group-hover:shadow-[0_0_50px_rgba(168,85,247,0.2)]",
  },
  {
    id: "whalewatch",
    title: "WhaleWatch Bot",
    badge: "Essential",
    price: "$150",
    description: "Track top holder movements instantly.",
    features: ["Wallet Labeling", "Buy/Sell Alerts", "Telegram Integration"],
    icon: Eye,
    gradient: "from-blue-500/20 to-cyan-500/20",
    glow: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]",
  },
  {
    id: "holdergate",
    title: "HolderGate",
    badge: "Security",
    price: "$150",
    description: "Token-gated access for Discord.",
    features: ["Zero-Knowledge Proofs", "Role Management", "Multi-Chain Support"],
    icon: Database,
    gradient: "from-emerald-500/20 to-teal-500/20",
    glow: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]",
  },
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const Icon = product.icon;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`glass-card relative rounded-2xl p-8 overflow-hidden group ${product.glow}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:bg-white/10 transition-colors">
            <Icon size={24} className="text-white" />
          </div>
          {product.badge && (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
              {product.badge}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
        <p className="text-gray-400 text-sm mb-6">{product.description}</p>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-white">{product.price}</span>
            <span className="text-sm text-gray-500">/ setup</span>
          </div>

          <ul className="space-y-3 mb-8">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                <Check size={14} className="text-blue-400" />
                {feature}
              </li>
            ))}
          </ul>

          <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            Deploy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BentoGrid() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Production-Ready Modules
          </h2>
          <p className="text-xl text-gray-400">
            Choose your infrastructure. We handle the deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
