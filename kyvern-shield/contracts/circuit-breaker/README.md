# Kyvern Shield Circuit Breaker

On-chain smart contract for AI agent protection on Solana.

## Overview

The Circuit Breaker program provides on-chain security for AI agents by:

- **Monitoring transactions** against configurable policies
- **Detecting anomalies** and tracking violation counts
- **Triggering protection** automatically when thresholds are exceeded
- **Emitting events** for off-chain monitoring systems

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent Wallet                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Shield PDA Account                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │    Config     │  │ Circuit State │  │   Counters    │   │
│  │ - max_value   │  │ - Closed      │  │ - total_tx    │   │
│  │ - allowlist   │  │ - Open        │  │ - blocked_tx  │   │
│  │ - blocklist   │  │ - HalfOpen    │  │ - anomalies   │   │
│  │ - thresholds  │  │               │  │               │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Target Programs                        │
│              (Jupiter, Raydium, etc.)                       │
└─────────────────────────────────────────────────────────────┘
```

## Instructions

### `initialize`
Create a new Shield configuration for an agent wallet.

### `update_config`
Update the Shield configuration (authority only).

### `record_transaction`
Record a transaction and validate against policies.

### `trigger_circuit_breaker`
Manually trigger the circuit breaker (authority only).

### `reset_circuit_breaker`
Reset the circuit breaker after investigation (authority only).

### `close_shield`
Close the Shield account and recover rent.

## Circuit Breaker States

| State | Description |
|-------|-------------|
| **Closed** | Normal operation, all valid transactions allowed |
| **Open** | Circuit tripped, all transactions blocked until cooldown |
| **HalfOpen** | Cooldown expired, next valid transaction resets to Closed |

## Build & Test

```bash
# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest

# Build the program
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## Security Considerations

- Only the authority can modify configuration
- Circuit breaker can be manually triggered by authority
- Events are emitted for all state changes (monitor off-chain)
- PDA accounts ensure deterministic addressing

## License

MIT License - See LICENSE file for details.
