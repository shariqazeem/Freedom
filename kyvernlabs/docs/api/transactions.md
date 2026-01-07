# Transactions Endpoint

Retrieve transaction history and details.

## List Transactions

Get recent transaction history.

### Endpoint

```
GET /v1/transactions
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Number of transactions (max 100) |
| `offset` | number | 0 | Pagination offset |
| `agent_id` | string | - | Filter by agent ID |
| `decision` | string | - | Filter by decision (`allow` or `block`) |
| `min_risk` | number | - | Minimum risk score |
| `max_risk` | number | - | Maximum risk score |

### Response

```json
{
  "transactions": [
    {
      "request_id": "req_abc123",
      "timestamp": "2026-01-07T12:00:00.000Z",
      "agent_id": "trading-bot-1",
      "target_address": "So111...",
      "amount_sol": 10.0,
      "decision": "allow",
      "risk_score": 15,
      "analysis_time_ms": 42.3
    }
  ],
  "total": 1000,
  "limit": 50,
  "offset": 0
}
```

### Example

```bash
# Get last 20 blocked transactions
curl "https://api.kyvernlabs.com/v1/transactions?limit=20&decision=block" \
  -H "Authorization: Bearer sk_live_kyvern_xxxxx"
```

## Get Transaction

Retrieve a specific transaction by ID.

### Endpoint

```
GET /v1/transactions/:id
```

### Response

Returns the full `AnalysisResult` object:

```json
{
  "request_id": "req_abc123",
  "timestamp": "2026-01-07T12:00:00.000Z",
  "decision": "allow",
  "risk_score": 15,
  "explanation": "Transaction appears safe.",
  "analysis_time_ms": 42.3,
  "source_detection_result": { ... },
  "heuristic_result": { ... },
  "llm_result": { ... }
}
```

### Example

```bash
curl "https://api.kyvernlabs.com/v1/transactions/req_abc123" \
  -H "Authorization: Bearer sk_live_kyvern_xxxxx"
```

## Error Responses

### 404 Not Found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Transaction not found"
  }
}
```

## SDK Usage

### TypeScript

```typescript
// List transactions
const transactions = await shield.getTransactions({
  limit: 50,
  decision: 'block',
});

// Get specific transaction
const tx = await shield.getTransaction('req_abc123');
```

### Python

```python
# List transactions
transactions = await shield.get_transactions(
    limit=50,
    decision="block"
)

# Get specific transaction
tx = await shield.get_transaction("req_abc123")
```

## See Also

- [Analyze Endpoint](/api/analyze)
- [API Reference](/api/)
