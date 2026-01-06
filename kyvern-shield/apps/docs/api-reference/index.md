# API Reference

Complete reference for the Kyvern Shield API.

## Base URL

```
https://api.shield.kyvernlabs.com/v1
```

## Authentication

All API requests require authentication via API key:

```bash
curl -H "X-API-Key: your-api-key" \
  https://api.shield.kyvernlabs.com/v1/agents
```

Or using the SDK:

```typescript
const shield = new KyvernShield({
  apiKey: 'your-api-key',
});
```

## Endpoints Overview

| Resource | Description |
|----------|-------------|
| [Agents](/api-reference/agents) | Register and manage monitored agents |
| [Transactions](/api-reference/transactions) | Analyze and query transactions |
| [Alerts](/api-reference/alerts) | Manage security alerts |
| [Policies](/api-reference/policies) | Configure security policies |

## Rate Limits

| Plan | Requests/minute | Agents | Transactions/day |
|------|-----------------|--------|------------------|
| Free | 60 | 3 | 10,000 |
| Pro | 300 | 25 | 100,000 |
| Enterprise | Unlimited | Unlimited | Unlimited |

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-05T12:00:00Z"
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent with ID xyz not found",
    "details": { ... }
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-05T12:00:00Z"
  }
}
```

## SDKs

Official SDKs are available for:

- **TypeScript/JavaScript**: `@kyvern/sdk`
- **Python**: `kyvern-shield`
- **Rust**: `kyvern-shield-rs` (coming soon)

## OpenAPI Spec

Download our OpenAPI specification:

- [openapi.json](https://api.shield.kyvernlabs.com/openapi.json)
- [openapi.yaml](https://api.shield.kyvernlabs.com/openapi.yaml)
