import { Shield, Activity, AlertTriangle, Lock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-lg">Kyvern Shield</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href={"/docs" as Route} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href={"/pricing" as Route} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href={"/research" as Route} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Research
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Now in Private Beta
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Security Infrastructure for
            <span className="text-emerald-500"> AI Agents</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Monitor, govern, and protect your autonomous AI agents with real-time threat
            detection, policy enforcement, and circuit breaker protection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Start Monitoring
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={"/docs" as Route}
              className="w-full sm:w-auto px-8 py-3 border border-border text-foreground font-medium rounded-md hover:bg-accent transition-colors"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Detection Latency" },
            { value: "24/7", label: "Monitoring" },
            { value: "0", label: "Breaches" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to secure AI agents
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for developers who deploy autonomous agents on Solana and need
              enterprise-grade security without the complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Real-time Monitoring",
                description:
                  "Track every transaction your agents make with sub-second latency. See anomalies before they become incidents.",
              },
              {
                icon: AlertTriangle,
                title: "Threat Detection",
                description:
                  "AI-powered analysis identifies suspicious patterns, unauthorized access, and potential exploits in real-time.",
              },
              {
                icon: Shield,
                title: "Circuit Breaker",
                description:
                  "Automatically pause agents when anomalies are detected. Configurable thresholds and instant response.",
              },
              {
                icon: Lock,
                title: "Policy Engine",
                description:
                  "Define granular rules for what your agents can do. Allowlists, spending limits, and program restrictions.",
              },
              {
                icon: Zap,
                title: "Instant Alerts",
                description:
                  "Get notified via Slack, Discord, Telegram, or webhooks the moment something needs your attention.",
              },
              {
                icon: Activity,
                title: "Audit Trail",
                description:
                  "Complete history of every action, decision, and transaction. Exportable logs for compliance.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border border-border bg-card hover:border-emerald-500/50 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to secure your agents?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the private beta and get early access to Kyvern Shield. Limited spots
            available.
          </p>
          <Link
            href={"/waitlist" as Route}
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-semibold rounded-md hover:bg-emerald-600 transition-colors"
          >
            Join Waitlist
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold">Kyvern Shield</span>
            <span className="text-muted-foreground text-sm">by Kyvern Labs</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href={"/docs" as Route} className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href={"/research" as Route} className="hover:text-foreground transition-colors">
              Research
            </Link>
            <a href="https://twitter.com/kyvernlabs" className="hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="https://github.com/kyvernlabs" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
