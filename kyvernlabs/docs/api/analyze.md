# Analyze Endpoint

The core Shield API endpoint for analyzing transactions.

## Endpoint

```
POST /v1/analyze
```

## Request

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer sk_live_kyvern_xxxxx` |
| `Content-Type` | Yes | `application/json` |

### Body

```json
{
  "agent_id": "trading-bot-1",
  "target_address": "So11111111111111111111111111111111111111112",
  "amount_sol": 10.0,
  "reasoning": "User requested swap of SOL to USDC via Raydium",
  "context": "Additional context about the transaction",
  "metadata": {
    "user_id": "user123",
    "session_id": "sess456"
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_id` | string | Yes | Unique identifier for your agent |
| `target_address` | string | Yes | Transaction target address |
| `amount_sol` | number | Yes | Transaction amount in SOL |
| `reasoning` | string | Yes | Agent's reasoning for the transaction |
| `context` | string | No | Additional context |
| `metadata` | object | No | Custom metadata (stored for analysis) |

## Response

### Success (200)

```json
{
  "request_id": "req_7f8e9d0c1b2a",
  "timestamp": "2026-01-07T12:00:00.000Z",
  "decision": "allow",
  "risk_score": 15,
  "explanation": "Transaction appears safe. Known DEX program, reasonable amount, no manipulation detected.",
  "analysis_time_ms": 42.3,

  "source_detection_result": {
    "is_safe": true,
    "sandbox_mode": false,
    "flags": [],
    "confidence": 0.95,
    "detected_patterns": []
  },

  "heuristic_result": {
    "passed": true,
    "triggered_rules": [],
    "risk_contribution": 5
  },

  "llm_result": {
    "safe": true,
    "manipulation_detected": false,
    "confidence": 0.92,
    "analysis": "Transaction intent aligns with stated reasoning. No indicators of prompt injection or manipulation."
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | string | Unique request identifier |
| `timestamp` | string | ISO 8601 timestamp |
| `decision` | string | `"allow"` or `"block"` |
| `risk_score` | number | 0-100 risk assessment |
| `explanation` | string | Human-readable explanation |
| `analysis_time_ms` | number | Processing time in milliseconds |

#### Source Detection Result

| Field | Type | Description |
|-------|------|-------------|
| `is_safe` | boolean | Whether source appears safe |
| `sandbox_mode` | boolean | Whether sandbox trigger was detected |
| `flags` | array | Detection flags triggered |
| `confidence` | number | Confidence score (0-1) |

#### Heuristic Result

| Field | Type | Description |
|-------|------|-------------|
| `passed` | boolean | Whether heuristics passed |
| `triggered_rules` | array | Rules that were triggered |
| `risk_contribution` | number | Score contribution |

#### LLM Result

| Field | Type | Description |
|-------|------|-------------|
| `safe` | boolean | LLM safety assessment |
| `manipulation_detected` | boolean | Whether manipulation found |
| `confidence` | number | Confidence score (0-1) |
| `analysis` | string | Detailed analysis |

## Error Responses

### 400 Bad Request

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: agent_id"
  }
}
```

### 401 Unauthorized

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### 429 Rate Limited

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Please wait 60 seconds."
  }
}
```

## Examples

### cURL

```bash
curl -X POST https://api.kyvernlabs.com/v1/analyze \
  -H "Authorization: Bearer sk_live_kyvern_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "my-agent",
    "target_address": "wallet_address",
    "amount_sol": 10.0,
    "reasoning": "User requested transfer"
  }'
```

### TypeScript

```typescript
const result = await shield.analyze({
  agent_id: 'my-agent',
  target_address: 'wallet_address',
  amount_sol: 10.0,
  reasoning: 'User requested transfer',
});
```

### Python

```python
result = await shield.analyze(
    agent_id="my-agent",
    target_address="wallet_address",
    amount_sol=10.0,
    reasoning="User requested transfer"
)
```

## See Also

- [Transaction Analysis](/shield/transaction-analysis)
- [Source Detection](/shield/source-detection)
- [TypeScript SDK](/shield/sdk-typescript)
