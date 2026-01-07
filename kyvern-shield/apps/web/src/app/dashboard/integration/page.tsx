"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Clock,
  ArrowUpRight,
  Code2,
  Terminal,
  BookOpen,
  Zap,
  AlertTriangle,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAPIKeys, APIKeyInfo } from "@/lib/api-client";

// =============================================================================
// CONSTANTS
// =============================================================================

// For demo purposes - in production, this would come from auth
const USER_EMAIL = "demo@kyvernlabs.com";

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
// NEW KEY MODAL COMPONENT
// =============================================================================

function NewKeyModal({
  secretKey,
  onClose,
}: {
  secretKey: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(secretKey);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0a0a0a] border border-white/10 max-w-lg w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">API Key Created</h3>
            <p className="text-sm text-gray-500">Save it now - you won&apos;t see it again!</p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-200/90 font-medium mb-1">
              This is your only chance to copy this key
            </p>
            <p className="text-xs text-amber-200/70">
              For security, we don&apos;t store the raw key. If you lose it, you&apos;ll need to create a new one.
            </p>
          </div>
        </div>

        {/* Key Display */}
        <div className="mb-6">
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
            Your Secret API Key
          </label>
          <div className="flex items-center gap-2 p-4 bg-white/[0.02] border border-white/10 font-mono text-sm">
            <Key className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <code className="text-emerald-400 flex-1 break-all">{secretKey}</code>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CREATE KEY MODAL
// =============================================================================

function CreateKeyModal({
  onSubmit,
  onClose,
  isLoading,
}: {
  onSubmit: (name: string) => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0a0a0a] border border-white/10 max-w-md w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/5 transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <Key className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create API Key</h3>
            <p className="text-sm text-gray-500">Give your key a name</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Key Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Production Bot"
              className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Key
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-3 border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================================================
// API KEY CARD COMPONENT
// =============================================================================

function APIKeyCard({
  apiKey,
  onDelete,
  isDeleting,
}: {
  apiKey: APIKeyInfo;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  // Format the date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border border-white/10 bg-[#0a0a0a] p-4 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-white">{apiKey.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Created {formatDate(apiKey.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1.5 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            title="Delete key"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5">
        <Key className="w-3 h-3 text-emerald-500" />
        <code className="text-xs font-mono text-gray-400 flex-1">
          {apiKey.key_prefix}•••••••••••••••••••
        </code>
      </div>

      {apiKey.last_used_at && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          Last used {formatDate(apiKey.last_used_at)}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN INTEGRATION PAGE
// =============================================================================

export default function IntegrationPage() {
  const {
    keys,
    isLoading,
    error,
    createKey,
    deleteKey: _deleteKey, // TODO: Implement after adding user sessions
    newlyCreatedKey,
    clearNewKey,
  } = useAPIKeys(USER_EMAIL);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  const handleCreateKey = async (name: string) => {
    try {
      await createKey(name);
      setShowCreateModal(false);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    // For deletion, we'd need an existing key to authenticate
    // In a real app, this would use the user's session token
    // For now, we'll show an alert
    if (!confirm("Are you sure you want to delete this API key? This cannot be undone.")) {
      return;
    }
    setDeletingKeyId(keyId);
    try {
      // Note: In production, you'd use proper auth here
      // await deleteKey(keyId, authToken);
      alert("Key deletion requires authentication. This feature will be available after implementing user sessions.");
    } finally {
      setDeletingKeyId(null);
    }
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

  const curlCode = `curl -X POST https://api.kyvernlabs.com/api/v1/analysis/intent \\
  -H "X-API-Key: sk_live_kyvern_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "your-agent-id",
    "target_address": "wallet_address",
    "amount_sol": 50.0,
    "reasoning": "Agent reasoning for this transaction"
  }'`;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* New Key Modal */}
      {newlyCreatedKey && (
        <NewKeyModal secretKey={newlyCreatedKey} onClose={clearNewKey} />
      )}

      {/* Create Key Modal */}
      {showCreateModal && (
        <CreateKeyModal
          onSubmit={handleCreateKey}
          onClose={() => setShowCreateModal(false)}
          isLoading={isLoading}
        />
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-[#050505]/95 backdrop-blur-sm sticky top-0 z-40">
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
                <span className="text-xs text-gray-500">{keys.length} active</span>
              </div>

              <div className="p-4 space-y-4">
                {/* Warning */}
                <div className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Keep your API keys secret. Never expose them in client-side code or public repositories.
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200/80 leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Keys List */}
                <div className="space-y-3">
                  {keys.length === 0 ? (
                    <div className="text-center py-8">
                      <Key className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No API keys yet</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Create your first key to get started
                      </p>
                    </div>
                  ) : (
                    keys.map((key) => (
                      <APIKeyCard
                        key={key.id}
                        apiKey={key}
                        onDelete={() => handleDeleteKey(key.id)}
                        isDeleting={deletingKeyId === key.id}
                      />
                    ))
                  )}
                </div>

                {/* Generate Button */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Generate New Key
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 border border-white/10 bg-[#0a0a0a] p-6">
              <h3 className="text-sm font-semibold text-white mb-4">This Month</h3>
              <div className="space-y-4">
                {[
                  { label: "API Calls", value: "—" },
                  { label: "Blocked Threats", value: "—" },
                  { label: "Avg. Latency", value: "—" },
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
