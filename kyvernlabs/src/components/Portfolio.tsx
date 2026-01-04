"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "DeFi Vault Protocol",
    category: "Smart Contracts",
    description: "Automated yield optimization vault on Solana with custom rebalancing strategies.",
    image: "/projects/defi-vault.png",
    technologies: ["Rust", "Anchor", "React", "Helius"],
    gradient: "from-orange-500/20 to-red-500/20",
    metrics: { tvl: "$2.4M", apy: "12.4%" },
  },
  {
    id: 2,
    title: "AI Community Manager",
    category: "AI Agent",
    description: "Autonomous Discord bot that moderates, answers FAQs, and tracks sentiment.",
    image: "/projects/ai-cm.png",
    technologies: ["Claude", "Discord.js", "Supabase"],
    gradient: "from-purple-500/20 to-pink-500/20",
    metrics: { messages: "50K+", accuracy: "98%" },
  },
  {
    id: 3,
    title: "NFT Launchpad",
    category: "Full-Stack",
    description: "End-to-end NFT minting platform with whitelist management and reveal mechanics.",
    image: "/projects/nft-launch.png",
    technologies: ["Next.js", "Metaplex", "Tailwind"],
    gradient: "from-cyan-500/20 to-blue-500/20",
    metrics: { minted: "10K", volume: "$800K" },
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
        {/* Image placeholder / gradient */}
        <div className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
          {/* Fake UI elements */}
          <div className="absolute inset-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 p-4">
            <div className="flex gap-1.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-white/10 rounded w-3/4" />
              <div className="h-2 bg-white/10 rounded w-1/2" />
              <div className="h-2 bg-white/10 rounded w-2/3" />
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
            >
              <Github className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category badge */}
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
            {project.category}
          </span>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Metrics */}
          <div className="flex gap-6 mb-4">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key}>
                <div className="text-lg font-bold text-white">{value}</div>
                <div className="text-[10px] text-gray-500 uppercase">{key}</div>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-[10px] font-medium text-gray-400 bg-white/5 rounded border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] block mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">Projects That</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Ship
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Real products. Real users. Real impact. Here&apos;s what we&apos;ve built.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Want to be next?{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
              Let&apos;s build something legendary →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
