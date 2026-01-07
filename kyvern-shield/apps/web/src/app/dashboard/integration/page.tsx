"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Clock,
  ArrowUpRight,
  Code2,
  Terminal,
  BookOpen,
  Zap,
  AlertTriangle,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
}

// =============================================================================
// COPY BUTTON COMPONENT
// =============================================================================

function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 hover:bg-white/5 transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500 hover:text-gray-300" />
      )}
    </button>
  );
}

// =============================================================================
// CODE BLOCK COMPONENT
// =============================================================================

function CodeBlock({
  code,
  title,
}: {
  code: string;
  title?: string;
}) {
  return (
    <div className="border border-white/10 bg-[#0a0a0a] overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500 font-mono">{title}</span>
          </div>
          <CopyButton text={code} />
        </div>
      )}
      <div className="relative">
        {!title && (
          <div className="absolute top-2 right-2">
            <CopyButton text={code} />
          </div>
        )}
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm font-mono text-gray-300 leading-relaxed">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

// =============================================================================
// API KEY CARD COMPONENT
// =============================================================================

function APIKeyCard({
  apiKey,
  onReveal,
  onDelete,
  isRevealed,
}: {
  apiKey: APIKey;
  onReveal: () => void;
  onDelete: () => void;
  isRevealed: boolean;
}) {
  const maskedKey = apiKey.key.slice(0, 7) + "..." + apiKey.key.slice(-4);

  return (
    <div className="border border-white/10 bg-[#0a0a0a] p-4 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-white">{apiKey.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">Created {apiKey.created}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onReveal}
            className="p-1.5 hover:bg-white/5 transition-colors"
            title={isRevealed ? "Hide key" : "Reveal key"}
          >
            {isRevealed ? (
              <EyeOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <CopyButton text={apiKey.key} />
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-500/10 transition-colors"
            title="Delete key"
          >
            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5">
        <Key className="w-3 h-3 text-emerald-500" />
        <code className="text-xs font-mono text-gray-400 flex-1">
          {isRevealed ? apiKey.key : maskedKey}
        </code>
      </div>

      {apiKey.lastUsed && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          Last used {apiKey.lastUsed}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN INTEGRATION PAGE
// =============================================================================

export default function IntegrationPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Production Key",
      key: "sk_live_kyvern_a1b2c3d4e5f6g7h8i9j0",
      created: "2 days ago",
      lastUsed: "5 minutes ago",
    },
  ]);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newKey: APIKey = {
        id: Date.now().toString(),
        name: `API Key ${apiKeys.length + 1}`,
        key: `sk_live_kyvern_${Math.random().toString(36).substring(2, 22)}`,
        created: "Just now",
        lastUsed: null,
      };
      setApiKeys([...apiKeys, newKey]);
      setIsGenerating(false);
    }, 500);
  };

  const toggleReveal = (id: string) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedKeys(newRevealed);
  };

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    revealedKeys.delete(id);
  };

  // SDK Code Examples
  const installCode = `npm install @kyvern/shield-sdk`;

  const usageCode = `import { KyvernShield } from '@kyvern/shield-sdk';

// Initialize with your API key
const shield = new KyvernShield(process.env.KYVERN_API_KEY);

// Before your agent executes any transaction:
async function executeTransaction(intent, targetAddress, reasoning) {
  // Analyze the transaction with Kyvern Shield
  const check = await shield.analyze({
    intent: intent,           // e.g., "Transfer 50 SOL"
    to: targetAddress,        // Target wallet address
    reasoning: reasoning,     // Your agent's reasoning
    amount: 50.0,            // Amount in SOL
  });

  // Shield returns a decision
  if (check.decision === 'BLOCK') {
    console.error('🛡️ Attack prevented:', check.explanation);
    console.error('Risk score:', check.riskScore);
    return { blocked: true, reason: check.explanation };
  }

  // Safe to proceed with transaction
  console.log('✅ Transaction approved, risk score:', check.riskScore);
  return await agent.execute(intent);
}`;

  const pythonCode = `from kyvern_shield import KyvernShield

# Initialize the Shield client
shield = KyvernShield(api_key=os.environ["KYVERN_API_KEY"])

# Analyze before executing
result = shield.analyze(
    intent="Transfer 50 SOL",
    to="target_wallet_address",
    reasoning=agent.last_reasoning,
    amount_sol=50.0
)

if result.decision == "block":
    print(f"🛡️ Blocked: {result.explanation}")
else:
    # Safe to proceed
    agent.execute_transaction()`;

  const curlCode = `curl -X POST https://api.kyvern.network/v1/analyze \\
  -H "Authorization: Bearer sk_live_kyvern_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "your-agent-id",
    "target_address": "wallet_address",
    "amount_sol": 50.0,
    "reasoning": "Agent reasoning for this transaction"
  }'`;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#050505]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="https://kyvernlabs.com" className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-sm text-white tracking-tight">KYVERN SHIELD</span>
            </Link>
            <div className="h-5 w-px bg-white/10" />
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Monitor
              </Link>
              <Link
                href="/dashboard/integration"
                className="text-sm text-white font-medium"
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
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-white/20" />
            <span className="text-xs text-gray-500 uppercase tracking-[0.3em] font-medium">
              Integration
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Connect your
            <span className="text-gray-500"> agents.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Protect your autonomous AI agents with Kyvern Shield. Generate an API key
            and integrate our SDK in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - API Keys */}
          <div className="lg:col-span-1">
            <div className="border border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-sm font-semibold text-white">API Keys</h2>
                </div>
                <span className="text-xs text-gray-500">{apiKeys.length} active</span>
              </div>

              <div className="p-4 space-y-4">
                {/* Warning */}
                <div className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Keep your API keys secret. Never expose them in client-side code or public repositories.
                  </p>
                </div>

                {/* Keys List */}
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <APIKeyCard
                      key={key.id}
                      apiKey={key}
                      isRevealed={revealedKeys.has(key.id)}
                      onReveal={() => toggleReveal(key.id)}
                      onDelete={() => deleteKey(key.id)}
                    />
                  ))}
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateNewKey}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {isGenerating ? "Generating..." : "Generate New Key"}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 border border-white/10 bg-[#0a0a0a] p-6">
              <h3 className="text-sm font-semibold text-white mb-4">This Month</h3>
              <div className="space-y-4">
                {[
                  { label: "API Calls", value: "12,847" },
                  { label: "Blocked Threats", value: "23" },
                  { label: "Avg. Latency", value: "45ms" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <span className="text-sm font-mono text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - SDK Documentation */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Start */}
            <div className="border border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
                <Zap className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-semibold text-white">Quick Start</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Step 1: Install */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                      1
                    </span>
                    <h3 className="text-sm font-medium text-white">Install the SDK</h3>
                  </div>
                  <CodeBlock code={installCode} title="Terminal" />
                </div>

                {/* Step 2: Set API Key */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                      2
                    </span>
                    <h3 className="text-sm font-medium text-white">Set your API key</h3>
                  </div>
                  <CodeBlock
                    code={`export KYVERN_API_KEY="sk_live_kyvern_xxxxx"`}
                    title=".env"
                  />
                </div>

                {/* Step 3: Integrate */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                      3
                    </span>
                    <h3 className="text-sm font-medium text-white">Protect your transactions</h3>
                  </div>
                  <CodeBlock code={usageCode} title="agent.ts" />
                </div>
              </div>
            </div>

            {/* More Examples */}
            <div className="border border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-semibold text-white">More Examples</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Python */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Python</h3>
                  <CodeBlock code={pythonCode} title="agent.py" />
                </div>

                {/* cURL */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">REST API (cURL)</h3>
                  <CodeBlock code={curlCode} title="Terminal" />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://docs.kyvernlabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/10 bg-[#0a0a0a] p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Documentation</h3>
                    <p className="text-xs text-gray-500">Full API reference</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-emerald-500 transition-colors">
                  docs.kyvernlabs.com
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>

              <a
                href="https://github.com/kyvernlabs/shield-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/10 bg-[#0a0a0a] p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">SDK Source</h3>
                    <p className="text-xs text-gray-500">Open source on GitHub</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-emerald-500 transition-colors">
                  github.com/kyvernlabs
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Kyvern Shield v0.1.0</span>
            <span className="text-xs text-gray-700">|</span>
            <a
              href="https://kyvernlabs.com"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              kyvernlabs.com
            </a>
          </div>
          <span className="text-xs text-gray-600">
            Built by Kyvern Labs
          </span>
        </div>
      </footer>
    </div>
  );
}
