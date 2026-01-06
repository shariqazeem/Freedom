# Getting Started

Welcome to Kyvern Shield, the security infrastructure for Web3 AI agents.

## What is Kyvern Shield?

Kyvern Shield is a security monitoring and protection layer for autonomous AI agents operating on Solana and other blockchains. It provides:

- **Real-time transaction monitoring** - Track every action your agents take
- **ML-powered threat detection** - Identify suspicious patterns automatically
- **Circuit breaker protection** - Automatically pause agents when anomalies detected
- **Policy enforcement** - Define rules for what agents can and cannot do
- **Comprehensive audit trail** - Full history for compliance and debugging

## Why You Need Agent Security

AI agents are increasingly managing real value - trading, staking, transferring funds. But they're also vulnerable:

| Risk | Description |
|------|-------------|
| Prompt Injection | Malicious inputs that manipulate agent behavior |
| Key Compromise | Leaked private keys leading to drained wallets |
| Logic Exploits | Bugs that cause unintended transactions |
| Rate Attacks | Overwhelming agents to trigger errors |
| Social Engineering | Tricking agents into unauthorized actions |

Kyvern Shield provides defense-in-depth against all these vectors.

## Prerequisites

Before getting started, you'll need:

- A Solana wallet for your agent
- Node.js 18+ or Python 3.11+
- An API key from [shield.kyvernlabs.com](https://shield.kyvernlabs.com)

## Installation

::: code-group

```bash [npm]
npm install @kyvern/sdk
```

```bash [pnpm]
pnpm add @kyvern/sdk
```

```bash [yarn]
yarn add @kyvern/sdk
```

```bash [pip]
pip install kyvern-shield
```

:::

## Quick Setup

### 1. Initialize the SDK

```typescript
import { KyvernShield } from '@kyvern/sdk';

const shield = new KyvernShield({
  apiKey: process.env.KYVERN_API_KEY,
  environment: 'production', // or 'development'
});
```

### 2. Register Your Agent

```typescript
const agent = await shield.agents.register({
  name: 'My Trading Bot',
  walletAddress: 'YourAgentWalletPublicKey',
  config: {
    maxTransactionValue: 1_000_000_000, // 1 SOL
    dailySpendLimit: 10_000_000_000,    // 10 SOL
    allowedPrograms: [
      'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', // Jupiter
    ],
    circuitBreaker: {
      enabled: true,
      anomalyThreshold: 5,
      timeWindowSeconds: 300,
    },
  },
});
```

### 3. Monitor Transactions

Shield automatically monitors all transactions from registered wallets. You can also manually submit transactions for analysis:

```typescript
const analysis = await shield.transactions.analyze({
  agentId: agent.id,
  signature: 'transaction-signature',
  programId: 'target-program-id',
  rawData: serializedTransaction,
});

if (analysis.risk.recommendation === 'block') {
  console.error('Transaction blocked:', analysis.risk.factors);
} else {
  // Proceed with transaction
}
```

### 4. Handle Alerts

```typescript
// Subscribe to real-time alerts
shield.alerts.subscribe(agent.id, (alert) => {
  console.log(`Alert: ${alert.severity} - ${alert.message}`);

  if (alert.severity === 'critical') {
    // Take immediate action
    shield.agents.pause(agent.id);
  }
});
```

## Next Steps

- [Quick Start Guide](/guides/quick-start) - Build a protected agent in 10 minutes
- [Core Concepts](/guides/concepts) - Understand how Shield works
- [Policy Configuration](/guides/policy-configuration) - Set up security rules
- [API Reference](/api-reference/) - Full API documentation

## Getting Help

- [GitHub Issues](https://github.com/kyvernlabs/kyvern-shield/issues) - Report bugs
- [Discord](https://discord.gg/kyvernlabs) - Community support
- [Twitter](https://twitter.com/kyvernlabs) - Updates and announcements
