"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$99",
    period: "one-time setup",
    description: "For emerging communities ready to professionalize.",
    features: [
      "Single token monitoring",
      "Basic whale alerts",
      "Telegram integration",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$249",
    period: "one-time setup",
    description: "For established projects protecting real treasuries.",
    features: [
      "Multi-token monitoring",
      "WhaleWatch + Sentinel",
      "HolderGate access control",
      "Custom alert thresholds",
      "Discord + Telegram",
      "Priority support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For protocols requiring institutional-grade infrastructure.",
    features: [
      "Unlimited tokens",
      "Full platform access",
      "Custom integrations",
      "White-label options",
      "Dedicated support",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

export default function Pricing() {
  return (
    <section className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold text-accent tracking-[0.3em] block mb-4">
            PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Institutional infrastructure.</span>
            <br />
            <span className="text-gray-500">Accessible pricing.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            No per-message fees. No hidden costs. Flat setup + optional monthly maintenance.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`
                relative rounded-2xl p-8
                ${
                  tier.popular
                    ? "bg-gradient-to-b from-accent/10 to-transparent border-accent/30"
                    : "bg-white/[0.02] border-white/[0.06]"
                }
                border backdrop-blur-xl
                transition-all duration-300 hover:border-white/20
              `}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 text-xs font-bold text-white bg-accent rounded-full tracking-wide">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Tier info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-gray-500">/{tier.period}</span>
                </div>
                <p className="text-sm text-gray-400">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-3 rounded-xl font-semibold text-sm
                  flex items-center justify-center gap-2
                  transition-all duration-300
                  ${
                    tier.popular
                      ? "bg-accent text-white hover:bg-accent-bright"
                      : "bg-white/[0.05] text-gray-300 border border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                  }
                `}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-12"
        >
          All plans include 14-day money-back guarantee. Optional $25-50/mo maintenance available.
        </motion.p>
      </div>
    </section>
  );
}
