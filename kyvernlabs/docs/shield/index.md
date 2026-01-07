# Kyvern Shield

Kyvern Shield is a real-time transaction firewall designed to protect autonomous AI agents from malicious attacks, prompt injection, and unauthorized transactions.

## Why Shield?

Autonomous AI agents are increasingly being used to manage wallets, execute trades, and interact with DeFi protocols. This creates a new attack surface:

- **Indirect Prompt Injection**: Malicious instructions embedded in external data sources
- **Transaction Manipulation**: Attacks that trick agents into draining wallets
- **Social Engineering**: Urgency-based manipulation patterns

Shield provides a security layer between your agent's decision-making and actual transaction execution.

## How It Works

```
[Agent Decision] → [Shield Analysis] → [Allow/Block] → [Execute/Reject]
```

1. Your agent prepares a transaction
2. Shield analyzes the transaction context, reasoning, and target
3. Shield returns a risk score and decision (allow/block)
4. Your code either executes or rejects based on Shield's recommendation

## Key Features

### Multi-Layer Analysis

- **Source Detection**: Identifies suspicious content sources using our novel SANDBOX_TRIGGER mechanism
- **Heuristic Analysis**: Pattern matching against known attack vectors
- **LLM Analysis**: Deep semantic analysis of agent reasoning and context

### Real-Time Protection

- Sub-50ms average latency
- Real-time transaction feed monitoring
- Instant threat alerts

### Circuit Breaker

Emergency kill switch that can halt all agent transactions when anomalies are detected.

## Quick Example

```typescript
import { KyvernShield } from '@kyvern/shield-sdk';

const shield = new KyvernShield(process.env.KYVERN_API_KEY);

// Before executing any transaction
const result = await shield.analyze({
  intent: "Transfer 50 SOL to wallet",
  to: targetAddress,
  reasoning: agent.lastReasoning,
  amount: 50.0,
});

if (result.decision === 'BLOCK') {
  console.error('Attack prevented:', result.explanation);
  return;
}

// Safe to execute
await agent.execute();
```

## Next Steps

- [Quick Start Guide](/shield/quickstart) - Get up and running in 5 minutes
- [Installation](/shield/installation) - Install the SDK
- [API Reference](/api/) - Full API documentation
