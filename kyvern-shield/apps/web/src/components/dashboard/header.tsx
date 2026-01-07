"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  ArrowUpRight,
  LogOut,
  User,
  ChevronDown,
  Settings,
  Key,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-white/10 bg-[#050505]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-4">
          <Link href="https://kyvernlabs.com" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm text-white tracking-tight">KYVERN SHIELD</span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm transition-colors ${
                isActive("/dashboard")
                  ? "text-white font-medium"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Monitor
            </Link>
            <Link
              href="/dashboard/integration"
              className={`text-sm transition-colors ${
                isActive("/dashboard/integration")
                  ? "text-white font-medium"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Integration
            </Link>
            <a
              href="https://docs.kyvernlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1"
            >
              Docs
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </nav>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-20 h-8 bg-white/5 animate-pulse rounded" />
          ) : user ? (
            /* Logged In - Account Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all bg-white/[0.02] hover:bg-white/[0.05]"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="hidden sm:block max-w-[150px] truncate">
                  {user.email}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-white/10 shadow-xl z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm text-white truncate">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/dashboard/integration"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Key className="w-4 h-4" />
                      API Keys
                    </Link>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                      <span className="ml-auto text-xs text-gray-600">Soon</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-white/5 py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out - Login/Signup Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-sm font-medium bg-white text-black hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
