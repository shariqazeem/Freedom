# Quick Start

Get Kyvern Shield protecting your AI agents in under 5 minutes.

## Prerequisites

- Node.js 18+ or Python 3.9+
- A Kyvern API key (get one from the [Shield Dashboard](https://shield.kyvernlabs.com/dashboard/integration))

## Step 1: Install the SDK

::: code-group

```bash [npm]
npm install @kyvern/shield-sdk
```

```bash [pnpm]
pnpm add @kyvern/shield-sdk
```

```bash [pip]
pip install kyvern-shield
```

:::

## Step 2: Set Your API Key

Create a `.env` file in your project root:

```bash
KYVERN_API_KEY="sk_live_kyvern_your_key_here"
```

## Step 3: Integrate With Your Agent

::: code-group

```typescript [TypeScript]
import { KyvernShield } from '@kyvern/shield-sdk';

// Initialize the client
const shield = new KyvernShield(process.env.KYVERN_API_KEY);

// Wrap your agent's transaction execution
async function executeProtectedTransaction(intent: string, target: string, reasoning: string) {
  // 1. Analyze with Shield before executing
  const check = await shield.analyze({
    intent: intent,
    to: target,
    reasoning: reasoning,
    amount: parseAmount(intent),
  });

  // 2. Check Shield's decision
  if (check.decision === 'BLOCK') {
    console.error(`🛡️ Shield blocked transaction: ${check.explanation}`);
    console.error(`Risk Score: ${check.riskScore}/100`);
    return { success: false, blocked: true, reason: check.explanation };
  }

  // 3. Safe to execute
  console.log(`✅ Transaction approved (risk: ${check.riskScore}/100)`);
  return await agent.execute(intent);
}
```

```python [Python]
from kyvern_shield import KyvernShield
import os

# Initialize the client
shield = KyvernShield(api_key=os.environ["KYVERN_API_KEY"])

async def execute_protected_transaction(intent: str, target: str, reasoning: str):
    # 1. Analyze with Shield before executing
    result = await shield.analyze(
        intent=intent,
        to=target,
        reasoning=reasoning,
        amount_sol=parse_amount(intent)
    )

    # 2. Check Shield's decision
    if result.decision == "block":
        print(f"🛡️ Shield blocked: {result.explanation}")
        return {"success": False, "blocked": True}

    # 3. Safe to execute
    print(f"✅ Approved (risk: {result.risk_score}/100)")
    return await agent.execute(intent)
```

:::

## Step 4: Monitor in the Dashboard

Visit the [Shield Dashboard](https://shield.kyvernlabs.com/dashboard) to:

- View real-time transaction feed
- See blocked threats
- Monitor agent health
- Configure protection rules

## What's Next?

- [Source Detection](/shield/source-detection) - Learn about our indirect injection defense
- [Circuit Breaker](/shield/circuit-breaker) - Emergency protection controls
- [API Reference](/api/) - Full endpoint documentation

## Need Help?

- [GitHub Issues](https://github.com/kyvernlabs/shield-sdk/issues)
- [Twitter @kyvernlabs](https://twitter.com/kyvernlabs)
- Email: support@kyvernlabs.com
