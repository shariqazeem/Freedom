# Installation

Install the Kyvern Shield SDK for your platform.

## TypeScript / JavaScript

### npm

```bash
npm install @kyvern/shield-sdk
```

### pnpm

```bash
pnpm add @kyvern/shield-sdk
```

### yarn

```bash
yarn add @kyvern/shield-sdk
```

### Basic Usage

```typescript
import { KyvernShield } from '@kyvern/shield-sdk';

const shield = new KyvernShield(process.env.KYVERN_API_KEY);

const result = await shield.analyze({
  intent: "Swap 10 SOL for USDC",
  to: "raydium_amm_program_id",
  reasoning: "User requested to swap tokens for stablecoin",
  amount: 10.0,
});

console.log(result.decision); // "allow" or "block"
console.log(result.riskScore); // 0-100
```

## Python

### pip

```bash
pip install kyvern-shield
```

### poetry

```bash
poetry add kyvern-shield
```

### Basic Usage

```python
from kyvern_shield import KyvernShield
import os

shield = KyvernShield(api_key=os.environ["KYVERN_API_KEY"])

result = await shield.analyze(
    intent="Swap 10 SOL for USDC",
    to="raydium_amm_program_id",
    reasoning="User requested to swap tokens for stablecoin",
    amount_sol=10.0
)

print(result.decision)  # "allow" or "block"
print(result.risk_score)  # 0-100
```

## REST API

If you're using a language without an official SDK, you can use the REST API directly:

```bash
curl -X POST https://api.kyvernlabs.com/v1/analyze \
  -H "Authorization: Bearer sk_live_kyvern_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "your-agent-id",
    "target_address": "wallet_address",
    "amount_sol": 10.0,
    "reasoning": "Agent reasoning for this transaction"
  }'
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `KYVERN_API_KEY` | Your Shield API key | Yes |
| `KYVERN_API_URL` | Custom API endpoint (for self-hosted) | No |
| `KYVERN_TIMEOUT` | Request timeout in ms (default: 5000) | No |

## Next Steps

- [Quick Start](/shield/quickstart) - Complete integration guide
- [TypeScript SDK Reference](/shield/sdk-typescript)
- [Python SDK Reference](/shield/sdk-python)
