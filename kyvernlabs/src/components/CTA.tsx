"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/[0.08] rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
        >
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-medium">
            Deploy in under 5 minutes
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6"
        >
          <span className="text-foreground">Your community never sleeps.</span>
          <br />
          <span className="text-gray-500">Neither should your infrastructure.</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-400 mb-12 max-w-xl mx-auto"
        >
          Join the communities that have upgraded from reactive moderation to
          autonomous intelligence.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-5 rounded-xl font-semibold text-white text-lg overflow-hidden"
          >
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-dark via-accent to-accent-cyan" />

            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-bright to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-accent to-accent-cyan rounded-xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            {/* Content */}
            <span className="relative flex items-center justify-center gap-3">
              Request Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </motion.button>
        </motion.div>

        {/* Contact */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-sm text-gray-500"
        >
          Questions?{" "}
          <a
            href="mailto:team@kyvernlabs.com"
            className="text-gray-400 hover:text-accent transition-colors duration-200"
          >
            team@kyvernlabs.com
          </a>
        </motion.p>
      </div>
    </section>
  );
}
