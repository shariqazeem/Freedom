# Authentication

All Kyvern Shield API requests require authentication via API key.

## Getting Your API Key

1. Visit the [Shield Dashboard](https://shield.kyvernlabs.com/dashboard/integration)
2. Navigate to the **Integration** tab
3. Click **Generate New Key**
4. Copy and securely store your key

::: warning
API keys are only shown once. Store them securely and never commit them to version control.
:::

## Using Your API Key

Include your API key in the `Authorization` header:

```bash
Authorization: Bearer sk_live_kyvern_xxxxx
```

### Example Request

```bash
curl -X POST https://api.kyvernlabs.com/v1/analyze \
  -H "Authorization: Bearer sk_live_kyvern_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "my-agent",
    "target_address": "wallet_address",
    "amount_sol": 10.0,
    "reasoning": "Transaction reasoning"
  }'
```

### SDK Configuration

::: code-group

```typescript [TypeScript]
const shield = new KyvernShield(process.env.KYVERN_API_KEY);
```

```python [Python]
shield = KyvernShield(api_key=os.environ["KYVERN_API_KEY"])
```

:::

## Key Types

| Type | Prefix | Environment |
|------|--------|-------------|
| Live | `sk_live_` | Production |
| Test | `sk_test_` | Development |

Test keys work identically to live keys but transactions are not billed.

## Key Management

### Rotating Keys

To rotate a key:
1. Generate a new key in the dashboard
2. Update your applications to use the new key
3. Delete the old key

### Revoking Keys

You can revoke a key immediately from the dashboard. Revoked keys return `401 Unauthorized`.

## Security Best Practices

### 1. Use Environment Variables

Never hardcode API keys:

```bash
# .env
KYVERN_API_KEY=sk_live_kyvern_xxxxx
```

### 2. Restrict Key Permissions

Coming soon: Scoped keys with limited permissions.

### 3. Monitor Usage

Review API usage in the dashboard to detect unauthorized access.

### 4. Rotate Regularly

Rotate keys periodically as a security best practice.

## Error Responses

### 401 Unauthorized

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

Causes:
- Missing `Authorization` header
- Invalid key format
- Revoked key
- Expired key

## See Also

- [API Reference](/api/)
- [Integration Guide](/shield/installation)
