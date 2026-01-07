# Circuit Breaker

The Circuit Breaker is an emergency protection system that can halt all agent transactions when anomalies are detected.

## Overview

In electrical systems, a circuit breaker trips when too much current flows, preventing damage. Kyvern Shield's Circuit Breaker works the same way for AI agents - when abnormal activity is detected, it automatically halts transactions to prevent loss.

## Circuit States

| State | Description | Behavior |
|-------|-------------|----------|
| **CLOSED** | Normal operation | Transactions flow normally |
| **OPEN** | Circuit tripped | All transactions blocked |
| **HALF-OPEN** | Testing recovery | Limited transactions allowed |

## Automatic Triggers

The circuit breaker automatically trips when:

### 1. Anomaly Threshold Exceeded

```yaml
anomaly_threshold: 5  # Trips after 5 anomalies in 5 minutes
window_minutes: 5
```

### 2. High-Risk Transaction Detected

```yaml
auto_trip_risk_score: 90  # Trip on any transaction with risk > 90
```

### 3. Blocked Transaction Rate

```yaml
blocked_rate_threshold: 0.3  # Trip if >30% of transactions blocked
window_transactions: 100
```

### 4. Spending Velocity

```yaml
max_spending_velocity: 100  # SOL per hour
velocity_window: 60  # minutes
```

## Manual Control

### Emergency Trip

Immediately halt all transactions:

```typescript
await shield.circuitBreaker.trip({
  reason: 'Suspicious activity detected',
  operator: 'security-team',
});
```

### Reset Circuit

Resume normal operations:

```typescript
await shield.circuitBreaker.reset({
  operator: 'security-team',
  notes: 'False positive confirmed',
});
```

## Protection Rules

Configure protection rules in the Shield dashboard:

### Transaction Limits

| Rule | Description |
|------|-------------|
| Max Transaction Value | Block transactions exceeding X SOL |
| Daily Spend Limit | Maximum daily spending across all agents |
| Single Address Limit | Max to send to any single address |

### Allowlist / Blocklist

| Rule | Description |
|------|-------------|
| Program Allowlist | Only allow transactions to approved programs |
| Address Blocklist | Block transactions to known malicious addresses |
| Domain Blocklist | Block content from suspicious domains |

### Rate Limiting

| Rule | Description |
|------|-------------|
| Transactions per Minute | Max transactions per agent per minute |
| Value per Hour | Max total value per hour |

## API Endpoints

### Get Circuit State

```bash
GET /api/v1/circuit-breaker/state

Response:
{
  "state": "closed",
  "last_trip": null,
  "anomaly_count": 2,
  "protected_agents": 7
}
```

### Trip Circuit

```bash
POST /api/v1/circuit-breaker/trip
{
  "reason": "Manual trip for investigation"
}
```

### Reset Circuit

```bash
POST /api/v1/circuit-breaker/reset
{
  "notes": "Investigation complete"
}
```

## Dashboard Integration

The Shield dashboard provides real-time circuit breaker controls:

- View current state and history
- One-click emergency trip
- Configure automatic triggers
- Review trip events and reasons
- Set up alert notifications

## Recovery Procedures

When the circuit trips:

1. **Assess** - Review what triggered the trip
2. **Investigate** - Check recent transactions and agent behavior
3. **Remediate** - Address the root cause if a real threat
4. **Test** - Use HALF-OPEN state to test recovery
5. **Resume** - Reset to CLOSED when confident

## Best Practices

### 1. Set Conservative Initial Limits

Start with strict limits and relax as you understand your agents' normal behavior.

### 2. Configure Alerts

Set up notifications for:
- Circuit state changes
- Anomaly threshold warnings
- Blocked transaction spikes

### 3. Regular Reviews

Review circuit breaker events weekly to:
- Identify false positives
- Tune thresholds
- Update allowlists

### 4. Test Your Procedures

Regularly test your incident response:
- Practice manual trip/reset
- Verify alerts work
- Document procedures

## See Also

- [Transaction Analysis](/shield/transaction-analysis)
- [Source Detection](/shield/source-detection)
- [API Reference](/api/)
