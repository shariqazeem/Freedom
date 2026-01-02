"use client";

import { motion } from "framer-motion";
import { Twitter, Github, Disc, CircleDot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-obsidian pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">

          <div>
            <h4 className="text-sm font-mono text-gray-400 mb-8 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              {["Intelligence Layer", "Sentinel Module", "Overseer Module", "Architect Module"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white hover:text-cobalt transition-colors duration-200 block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-mono text-gray-400 mb-8 uppercase tracking-widest">Developers</h4>
            <ul className="space-y-4">
              {["Documentation", "API Reference", "SDKs", "Status"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white hover:text-cobalt transition-colors duration-200 block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-mono text-gray-400 mb-8 uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              {["Manifesto", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white hover:text-cobalt transition-colors duration-200 block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-mono text-gray-400 mb-8 uppercase tracking-widest">Connect</h4>
            <ul className="space-y-4">
              {["Twitter", "Discord", "GitHub", "Telegram"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white hover:text-cobalt transition-colors duration-200 block text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end pt-12 border-t border-white/5">
          <div className="mb-8 md:mb-0">
            <span className="text-2xl font-bold tracking-tighter text-white">STRATUM LABS</span>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              ADAPTIVE INTELLIGENCE INFRASTRUCTURE<br />
              EST. 2024
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Disc size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
