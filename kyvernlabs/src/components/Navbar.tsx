"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050505]/90 backdrop-blur-sm border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <span className="text-sm font-bold text-white tracking-tight">
                KYVERN LABS
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="group text-sm text-white flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                Start a Project
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-[#050505]"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white hover:text-gray-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 px-6 py-3 bg-white text-black font-semibold text-sm"
              >
                Start a Project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
