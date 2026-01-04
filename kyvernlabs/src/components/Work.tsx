"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Zap, Shield, Coins, TrendingUp, Eye, Users, Cpu, Globe } from "lucide-react";

const projects = [
  {
    id: "parallax",
    title: "ParallaxPay",
    subtitle: "x402 Solana Hackathon Winner",
    category: "AI Infrastructure",
    description:
      "Autonomous AI agent marketplace enabling AI-to-AI transactions via x402 micropayments on Solana. Features 6 specialized agents, swarm intelligence, multi-node Parallax cluster, and on-chain reputation system.",
    year: "2025",
    status: "Live",
    link: "https://parallaxpay.online",
    technologies: ["Next.js 15", "x402 Protocol", "Swarm AI", "Solana", "MCP Server", "Gradient Parallax"],
    metrics: [
      { label: "Prize", value: "$5K", icon: Coins },
      { label: "Agents", value: "6", icon: Cpu },
    ],
    featured: true,
    gradient: "from-blue-500/20 via-transparent to-transparent",
  },
  {
    id: "aegis",
    title: "AEGIS",
    subtitle: "Gradient AI Lab Hackathon Winner",
    category: "Edge AI Security",
    description:
      "Sovereign AI security system with 7-stage inference pipeline. 100% local processing, zero cloud costs. YOLOv8 detection with real-time threat analysis optimized for M1 hardware.",
    year: "2025",
    status: "Deployed",
    link: "https://github.com/shariqazeem/AEGIS",
    technologies: ["YOLOv8", "Parallax", "FastAPI", "Tauri", "Python"],
    metrics: [
      { label: "Prize", value: "$1K", icon: Coins },
      { label: "Savings", value: "$6K/yr", icon: TrendingUp },
    ],
    featured: false,
    gradient: "from-emerald-500/20 via-transparent to-transparent",
  },
  {
    id: "rizqfi",
    title: "RizqFi",
    subtitle: "Cypherpunk 2025 Hackathon",
    category: "DeFi Protocol",
    description:
      "Trustless rotating savings protocol (ROSCA) on Solana. Targeting Pakistan's $5B+ informal committee market with smart contract-enforced payouts and zero trust requirements.",
    year: "2025",
    status: "Devnet",
    link: "https://rizqfi.vercel.app",
    technologies: ["Anchor", "Rust", "Solana", "React", "USDC"],
    metrics: [
      { label: "Market", value: "$5B+", icon: TrendingUp },
      { label: "Users", value: "50M+", icon: Users },
    ],
    featured: false,
    gradient: "from-purple-500/20 via-transparent to-transparent",
  },
  {
    id: "saga",
    title: "Solana Saga",
    subtitle: "indie.fun Hackathon 2025",
    category: "Consumer Web3",
    description:
      "Gamified prediction markets with Tinder-style UX. Swipe to bet, gamepad support for Play Solana console, Moddio arcade integration, and viral sharing mechanics.",
    year: "2025",
    status: "Beta",
    link: "https://solana-saga.vercel.app",
    technologies: ["Next.js", "Solana", "Gamepad API", "Moddio", "Web3.js"],
    metrics: [
      { label: "UX", value: "Swipe", icon: Zap },
      { label: "Hardware", value: "Ready", icon: Cpu },
    ],
    featured: false,
    gradient: "from-orange-500/20 via-transparent to-transparent",
  },
  {
    id: "oracle",
    title: "x402-Oracle",
    subtitle: "AI Agent Infrastructure",
    category: "Protocol",
    description:
      "Wallet reputation oracle for autonomous AI agents. Pay-per-query via x402 micropayments. Returns trust scores, badges, and on-chain metrics for any Solana wallet.",
    year: "2025",
    status: "Live",
    link: "https://github.com/shariqazeem/x402_oracle",
    technologies: ["x402", "Solana", "TypeScript", "Express"],
    metrics: [
      { label: "Cost", value: "$0.05", icon: Coins },
      { label: "Latency", value: "<100ms", icon: Zap },
    ],
    featured: false,
    gradient: "from-cyan-500/20 via-transparent to-transparent",
  },
  {
    id: "xanscan",
    title: "XanScan 360",
    subtitle: "Xandeum Network Explorer",
    category: "Analytics",
    description:
      "Hollywood-grade blockchain command center with 3D holographic globe, real-time pNode visualization, and J.A.R.V.I.S.-style voice commands. Cinematic boot sequence included.",
    year: "2025",
    status: "Live",
    link: "https://xanscan360.vercel.app",
    technologies: ["Next.js 15", "Three.js", "Web Audio", "Speech API"],
    metrics: [
      { label: "Globe", value: "3D", icon: Globe },
      { label: "Voice", value: "AI", icon: Cpu },
    ],
    featured: false,
    gradient: "from-pink-500/20 via-transparent to-transparent",
  },
];

const statusColors: Record<string, string> = {
  Live: "bg-emerald-500",
  Deployed: "bg-blue-500",
  Devnet: "bg-purple-500",
  Beta: "bg-orange-500",
};

function FeaturedCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group md:col-span-2 relative"
    >
      <div className="relative h-full border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden bg-[#0a0a0a]">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Header bar */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${statusColors[project.status]} animate-pulse`} />
              <span className="text-xs text-gray-400 font-medium">{project.status}</span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Hackathon Winner
              </span>
            </div>
            <span className="text-xs text-gray-600 font-mono">{project.year}</span>
          </div>

          {/* Main content */}
          <div className="p-8 md:p-10">
            {/* Category & Title */}
            <div className="mb-6">
              <span className="text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">
                {project.category}
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">
                {project.title}
              </h3>
              <p className="text-lg text-gray-400 mt-1">{project.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl text-base">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs text-gray-300 bg-white/5 border border-white/10 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/10">
              {project.metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/60" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white tracking-tight">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {metric.label}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CTA */}
              <div className="ml-auto">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Live
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="relative h-full border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden bg-[#0a0a0a]">
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          {/* Content wrapper */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColors[project.status]}`} />
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  {project.status}
                </span>
              </div>
              <span className="text-[10px] text-gray-600 font-mono">{project.year}</span>
            </div>

            {/* Main content */}
            <div className="p-6 flex-1 flex flex-col">
              {/* Category & Title */}
              <div className="mb-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-medium">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 tracking-tight group-hover:text-gray-100 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{project.subtitle}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-[10px] text-gray-400 bg-white/5 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 text-[10px] text-gray-500">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Metrics & Arrow */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {project.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="text-lg font-bold text-white">{metric.value}</div>
                      <div className="text-[10px] text-gray-600 uppercase tracking-wider">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function Work() {
  const featuredProject = projects.find((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="py-32 border-t border-white/10">
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
              Portfolio
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Shipped to
                <br />
                <span className="text-gray-500">production.</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-md text-base leading-relaxed lg:text-right">
              Hackathon-winning systems deployed across DeFi, AI infrastructure, and consumer applications. Every project live and verifiable.
            </p>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-6 border border-white/10 bg-white/[0.02]"
        >
          {[
            { value: "10+", label: "Products Built" },
            { value: "$7K+", label: "Prize Money Won" },
            { value: "5", label: "Hackathon Wins" },
            { value: "100%", label: "Live & Deployed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Featured Project */}
          {featuredProject && <FeaturedCard project={featuredProject} />}

          {/* Other Projects */}
          {otherProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 p-8 border border-white/10 bg-white/[0.02]"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Have a project in mind?</h3>
            <p className="text-sm text-gray-500">
              We ship fast. Get a proposal within 24 hours.
            </p>
          </div>
          <a
            href="#contact"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Start a Conversation
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
