"use client";

import { motion } from "framer-motion";
import { Zap, Bot, Code2, ArrowRight, Clock, Shield, Cpu } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "MVP Sprint",
    subtitle: "Idea to Production",
    timeline: "2 weeks",
    description:
      "Full-stack development from concept to deployed product. We handle architecture, smart contracts, frontend, and deployment.",
    deliverables: [
      "Technical Architecture",
      "Core Smart Contracts",
      "Production Frontend",
      "Documentation",
    ],
    ideal: "Startups launching new products",
  },
  {
    icon: Bot,
    title: "AI Agents",
    subtitle: "Autonomous Systems",
    timeline: "1-2 weeks",
    description:
      "Custom autonomous agents that monitor, execute, and scale. From Telegram bots to multi-agent orchestration.",
    deliverables: [
      "Custom Agent Development",
      "LLM Integration",
      "Multi-Agent Systems",
      "Monitoring & Alerts",
    ],
    ideal: "Projects needing automation",
  },
  {
    icon: Code2,
    title: "Smart Contracts",
    subtitle: "Solana & EVM",
    timeline: "1-3 weeks",
    description:
      "Secure, gas-optimized programs for Solana (Anchor/Rust) and EVM chains (Solidity). Every line audited.",
    deliverables: [
      "Contract Development",
      "Security Review",
      "Test Coverage",
      "Mainnet Deployment",
    ],
    ideal: "DeFi protocols & DAOs",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    description: "30-min call to understand your vision, requirements, and timeline.",
  },
  {
    step: "02",
    title: "Proposal",
    description: "Detailed scope, architecture plan, and fixed-price quote within 24 hours.",
  },
  {
    step: "03",
    title: "Build",
    description: "Daily progress updates. You see everything as it's built.",
  },
  {
    step: "04",
    title: "Ship",
    description: "Deployed to production with documentation and handoff support.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 border-t border-white/10">
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
              Services
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                What we
                <br />
                <span className="text-gray-500">build.</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-md text-base leading-relaxed lg:text-right">
              Fixed-price engagements. No hourly billing, no surprises. You know exactly what you're getting and when.
            </p>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="h-full border border-white/10 hover:border-white/20 transition-all duration-300 bg-[#0a0a0a] p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                      <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {service.timeline}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                    <span className="text-sm text-gray-500">{service.subtitle}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables */}
                  <div className="space-y-2 mb-6">
                    {service.deliverables.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-sm text-gray-500"
                      >
                        <span className="w-1 h-1 bg-emerald-500/50 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Ideal for */}
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                      Ideal for
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{service.ideal}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-xl font-bold text-white mb-8">How we work</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-4 left-full w-full h-px bg-white/10 -translate-x-1/2" />
                )}

                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-white/10">{step.step}</span>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 p-6 border border-white/10 bg-white/[0.02] mb-16"
        >
          {[
            { icon: Shield, label: "Fixed Pricing", sublabel: "No hourly surprises" },
            { icon: Clock, label: "Fast Delivery", sublabel: "Weeks, not months" },
            { icon: Cpu, label: "AI-Augmented", sublabel: "10x development speed" },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{feature.label}</div>
                  <div className="text-xs text-gray-500">{feature.sublabel}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-white/10 bg-white/[0.02]"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to build?
            </h3>
            <p className="text-sm text-gray-500">
              Get a detailed proposal within 24 hours of our call.
            </p>
          </div>
          <a
            href="#contact"
            className="group px-6 py-3.5 bg-white text-black font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            Schedule Discovery Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
