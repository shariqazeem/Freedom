# REST API

Direct REST API access for Kyvern Shield.

## Base URL

```
https://api.kyvernlabs.com/v1
```

## Authentication

Include your API key in the Authorization header:

```
Authorization: Bearer sk_live_kyvern_xxxxx
```

## Analyze Transaction

Analyze a transaction before execution.

### Request

```bash
POST /analyze
Content-Type: application/json
Authorization: Bearer sk_live_kyvern_xxxxx

{
  "agent_id": "trading-bot-1",
  "target_address": "So11111111111111111111111111111111111111112",
  "amount_sol": 10.0,
  "reasoning": "User requested swap of SOL to USDC",
  "context": "Optional additional context",
  "metadata": {
    "custom_field": "value"
  }
}
```

### Response

```json
{
  "request_id": "req_abc123xyz",
  "timestamp": "2026-01-07T12:00:00.000Z",
  "decision": "allow",
  "risk_score": 15,
  "explanation": "Transaction appears safe. Known DEX program, reasonable amount.",
  "analysis_time_ms": 42.3,
  "source_detection_result": {
    "is_safe": true,
    "sandbox_mode": false,
    "flags": [],
    "confidence": 0.95
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
    "analysis": "Transaction intent matches stated reasoning."
  }
}
```

## Get Transactions

Retrieve recent transaction history.

### Request

```bash
GET /transactions?limit=50&agent_id=trading-bot-1
Authorization: Bearer sk_live_kyvern_xxxxx
```

### Response

```json
{
  "transactions": [
    {
      "request_id": "req_abc123",
      "timestamp": "2026-01-07T12:00:00.000Z",
      "decision": "allow",
      "risk_score": 15,
      "agent_id": "trading-bot-1"
    }
  ],
  "total": 1000,
  "limit": 50,
  "offset": 0
}
```

## Get Transaction

Retrieve a specific transaction by ID.

### Request

```bash
GET /transactions/req_abc123
Authorization: Bearer sk_live_kyvern_xxxxx
```

## Get Statistics

Retrieve aggregate statistics.

### Request

```bash
GET /stats
Authorization: Bearer sk_live_kyvern_xxxxx
```

### Response

```json
{
  "total": 10000,
  "allowed": 9500,
  "blocked": 500,
  "avg_latency_ms": 42.5,
  "period": "last_24h"
}
```

## Circuit Breaker

### Get State

```bash
GET /circuit-breaker/state
Authorization: Bearer sk_live_kyvern_xxxxx
```

### Trip

```bash
POST /circuit-breaker/trip
Content-Type: application/json
Authorization: Bearer sk_live_kyvern_xxxxx

{
  "reason": "Manual trip for investigation"
}
```

### Reset

```bash
POST /circuit-breaker/reset
Authorization: Bearer sk_live_kyvern_xxxxx
```

## Health Check

```bash
GET /health

Response:
{
  "status": "healthy",
  "version": "0.1.0"
}
```

## Error Responses

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: agent_id"
  }
}
```

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | INVALID_REQUEST | Invalid request body |
| 401 | UNAUTHORIZED | Invalid or missing API key |
| 429 | RATE_LIMITED | Rate limit exceeded |
| 500 | INTERNAL_ERROR | Server error |

## See Also

- [TypeScript SDK](/shield/sdk-typescript)
- [Python SDK](/shield/sdk-python)
- [API Reference](/api/)
