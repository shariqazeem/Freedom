"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Users, Shield } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "24/7 Manual Monitoring",
    description: "Community managers monitor 12+ channels manually. Burnout is inevitable.",
  },
  {
    icon: AlertTriangle,
    title: "Reactive Response",
    description: "Whale movements trigger panic before anyone can react. Damage is done.",
  },
  {
    icon: Users,
    title: "Fake Holders",
    description: "Anyone can screenshot a wallet. Fake holders infiltrate token-gated groups.",
  },
  {
    icon: Shield,
    title: "3 AM Attacks",
    description: "Coordinated FUD attacks strike when your team is asleep. Every time.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

export default function Problem() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-red-400/90">The old way is broken.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Web3 communities operate at machine speed. Manual moderation doesn&apos;t scale.
          </p>
        </motion.div>

        {/* Problem cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {problems.map((problem) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-red-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-red-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Solution statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-2xl sm:text-3xl font-semibold text-foreground">
            You need systems that{" "}
            <span className="bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-transparent">
              never sleep.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
