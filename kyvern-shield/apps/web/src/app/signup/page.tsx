"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="border border-white/10 bg-[#0a0a0a] p-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-gray-400 mb-6">
              We sent a confirmation link to <strong className="text-white">{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Click the link in the email to verify your account and start protecting your AI agents.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-emerald-500" />
            <span className="text-xl font-bold text-white tracking-tight">
              KYVERN SHIELD
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm">
            Start protecting your AI agents in minutes
          </p>
        </div>

        {/* Form */}
        <div className="border border-white/10 bg-[#0a0a0a] p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0a0a0a] px-4 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            href="/login"
            className="block w-full text-center px-4 py-3 border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Sign in instead
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          By creating an account, you agree to our{" "}
          <a href="https://kyvernlabs.com/terms" className="text-gray-400 hover:text-white">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="https://kyvernlabs.com/privacy" className="text-gray-400 hover:text-white">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
