"use client";

import { motion } from "framer-motion";

const metrics = [
    { label: "SYSTEM UPTIME", value: "99.99%", color: "text-emerald-400" },
    { label: "GLOBAL LATENCY", value: "~50ms", color: "text-cobalt" },
    { label: "ASSETS SECURED", value: "$4.2B+", color: "text-white" },
    { label: "THREATS NEUTRALIZED", value: "12,405", color: "text-amber-400" },
];

export default function SystemPerformance() {
    return (
        <section className="py-32 bg-obsidian border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">System Performance</h2>
                        <p className="text-gray-400 font-mono text-sm">LIVE NETWORK STABILITY METRICS</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                        </span>
                        <span className="text-emerald-500 font-mono text-xs tracking-widest">OPERATIONAL</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="border-l border-white/10 pl-6"
                        >
                            <div className="text-[10px] font-mono text-gray-500 mb-2 tracking-widest">{metric.label}</div>
                            <div className={`text-3xl md:text-4xl font-mono font-medium ${metric.color} tracking-tighter`}>
                                {metric.value}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Fake Graph Line */}
                <div className="mt-16 h-px w-full bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cobalt to-transparent w-1/2 animate-shimmer" />
                </div>
            </div>
        </section>
    );
}
