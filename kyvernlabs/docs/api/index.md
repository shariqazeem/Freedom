# API Reference

The Kyvern Shield API provides real-time transaction analysis and threat detection for autonomous AI agents.

## Base URL

```
https://api.kyvernlabs.com/v1
```

## Authentication

All API requests require authentication via Bearer token:

```bash
Authorization: Bearer sk_live_kyvern_xxxxx
```

Get your API key from the [Shield Dashboard](https://shield.kyvernlabs.com/dashboard/integration).

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze a transaction before execution |
| GET | `/transactions` | Get recent transaction history |
| GET | `/transactions/:id` | Get a specific transaction |
| GET | `/stats` | Get aggregate statistics |
| GET | `/health` | API health check |

## Quick Example

```bash
curl -X POST https://api.kyvernlabs.com/v1/analyze \
  -H "Authorization: Bearer sk_live_kyvern_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "trading-bot-1",
    "target_address": "So11111111111111111111111111111111111111112",
    "amount_sol": 10.0,
    "reasoning": "User requested swap of SOL to USDC via Raydium"
  }'
```

## Response Format

All responses follow this structure:

```json
{
  "request_id": "req_abc123",
  "timestamp": "2026-01-07T12:00:00Z",
  "decision": "allow",
  "risk_score": 15,
  "explanation": "Transaction appears safe. Low risk indicators.",
  "analysis_time_ms": 45.2,
  "source_detection_result": { ... },
  "heuristic_result": { ... },
  "llm_result": { ... }
}
```

## Rate Limits

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Free | 10 | 1,000 |
| Pro | 100 | 50,000 |
| Enterprise | Unlimited | Unlimited |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 401 | Invalid or missing API key |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## SDKs

- [TypeScript SDK](/shield/sdk-typescript)
- [Python SDK](/shield/sdk-python)

## Next Steps

- [Authentication](/api/authentication) - API key management
- [Analyze Endpoint](/api/analyze) - Transaction analysis
- [Transactions](/api/transactions) - Historical data
