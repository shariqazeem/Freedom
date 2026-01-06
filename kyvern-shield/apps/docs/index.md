---
layout: home

hero:
  name: "Kyvern Shield"
  text: "Security Infrastructure for AI Agents"
  tagline: Monitor, govern, and protect your autonomous AI agents with real-time threat detection and circuit breaker protection.
  image:
    src: /shield-logo.svg
    alt: Kyvern Shield
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/kyvernlabs/kyvern-shield

features:
  - icon: 🛡️
    title: Real-time Monitoring
    details: Track every transaction your agents make with sub-second latency. See anomalies before they become incidents.
  - icon: 🚨
    title: Threat Detection
    details: AI-powered analysis identifies suspicious patterns, unauthorized access, and potential exploits in real-time.
  - icon: ⚡
    title: Circuit Breaker
    details: Automatically pause agents when anomalies are detected. Configurable thresholds and instant response.
  - icon: 🔒
    title: Policy Engine
    details: Define granular rules for what your agents can do. Allowlists, spending limits, and program restrictions.
  - icon: 📊
    title: Audit Trail
    details: Complete history of every action, decision, and transaction. Exportable logs for compliance.
  - icon: 🔔
    title: Instant Alerts
    details: Get notified via Slack, Discord, Telegram, or webhooks the moment something needs your attention.
---

## Why Kyvern Shield?

As AI agents become more autonomous and manage more value, security becomes critical. Traditional security tools weren't built for software that can act on its own.

**Kyvern Shield** provides the security infrastructure layer that lets you deploy agents confidently:

- **Monitor** every transaction in real-time
- **Detect** anomalies with ML-powered analysis
- **Respond** instantly with circuit breakers
- **Govern** with fine-grained policies

## Quick Example

```typescript
import { KyvernShield } from '@kyvern/sdk';

// Initialize Shield
const shield = new KyvernShield({
  apiKey: process.env.KYVERN_API_KEY,
});

// Register your agent
const agent = await shield.agents.register({
  name: 'Trading Bot Alpha',
  walletAddress: 'your-wallet-address',
  config: {
    maxTransactionValue: 1_000_000_000, // 1 SOL in lamports
    dailySpendLimit: 10_000_000_000,    // 10 SOL
    allowedPrograms: ['JUP...', 'RAY...'],
    circuitBreaker: {
      enabled: true,
      anomalyThreshold: 5,
    },
  },
});

// Shield now monitors all transactions
console.log(`Agent ${agent.id} is now protected`);
```

## Research

We publish our security research to help the ecosystem:

- [The AI Agent Security Crisis](/research/agent-security-crisis) - Why autonomous agents are a liability
- [Threat Landscape 2026](/research/threat-landscape) - Attack vectors targeting AI agents
- [Circuit Breaker Patterns](/research/circuit-breaker-patterns) - Best practices for fail-safe design

---

<div style="text-align: center; margin-top: 3rem;">
  <p style="color: #666;">Built by <a href="https://kyvernlabs.com">Kyvern Labs</a></p>
</div>
