"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/kyvernlabs" },
  { name: "GitHub", href: "https://github.com/kyvernlabs" },
  { name: "LinkedIn", href: "https://linkedin.com/company/kyvernlabs" },
];

const navLinks = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10">
      {/* Main CTA Section */}
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16"
        >
          {/* Left - CTA */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-white/20" />
              <span className="text-xs text-gray-500 uppercase tracking-[0.3em] font-medium">
                Contact
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-8">
              Let&apos;s build
              <br />
              <span className="text-gray-500">together.</span>
            </h2>
            <p className="text-gray-400 max-w-md leading-relaxed mb-8">
              Have a project in mind? We&apos;d love to hear about it. Send us a message and we&apos;ll get back to you within 24 hours.
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              <a
                href="mailto:hello@kyvernlabs.com"
                className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-lg">hello@kyvernlabs.com</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-lg">Remote-First · Worldwide</span>
              </div>
            </div>
          </div>

          {/* Right - Quick contact card */}
          <div className="lg:mt-20">
            <div className="border border-white/10 bg-white/[0.02] p-8">
              <h3 className="text-lg font-bold text-white mb-2">Quick inquiry</h3>
              <p className="text-sm text-gray-500 mb-6">
                For faster response, include your project timeline and budget range.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:hello@kyvernlabs.com?subject=Project%20Inquiry"
                  className="group w-full flex items-center justify-between px-6 py-4 bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  <span>Send an Email</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                  href="https://twitter.com/kyvernlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full flex items-center justify-between px-6 py-4 border border-white/20 text-white font-medium text-sm hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  <span>DM on Twitter</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              <p className="text-xs text-gray-600 mt-6">
                Typical response time: &lt;24 hours
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-white tracking-tight">
                KYVERN LABS
              </span>
              <span className="text-xs text-gray-600">
                &copy; {new Date().getFullYear()} All rights reserved
              </span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
