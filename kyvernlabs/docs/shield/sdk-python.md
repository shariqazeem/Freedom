# Python SDK

The official Python SDK for Kyvern Shield.

## Installation

```bash
pip install kyvern-shield
```

## Quick Start

```python
from kyvern_shield import KyvernShield
import os

shield = KyvernShield(api_key=os.environ["KYVERN_API_KEY"])

result = await shield.analyze(
    agent_id="my-agent",
    target_address="wallet_address",
    amount_sol=10.0,
    reasoning="User requested transfer"
)

if result.decision == "allow":
    # Safe to execute
    pass
```

## Configuration

```python
shield = KyvernShield(
    api_key=api_key,
    base_url="https://api.kyvernlabs.com/v1",  # Custom endpoint
    timeout=5.0,  # Request timeout in seconds
    retries=3,  # Number of retries on failure
)
```

## API Reference

### `shield.analyze()`

Analyze a transaction before execution.

```python
result = await shield.analyze(
    agent_id: str,
    target_address: str,
    amount_sol: float,
    reasoning: str,
    context: Optional[str] = None,
    metadata: Optional[dict] = None,
)

# Returns AnalysisResult:
# - request_id: str
# - timestamp: datetime
# - decision: Literal["allow", "block"]
# - risk_score: int
# - explanation: str
# - analysis_time_ms: float
# - source_detection_result: SourceDetectionResult
# - heuristic_result: HeuristicResult
# - llm_result: LLMResult
```

### `shield.get_transactions()`

Get recent transaction history.

```python
transactions = await shield.get_transactions(
    limit=50,
    agent_id="my-agent",  # Optional filter
)
```

### `shield.get_stats()`

Get aggregate statistics.

```python
stats = await shield.get_stats()
# Stats(total=1000, allowed=950, blocked=50, avg_latency=42.0)
```

### Circuit Breaker

```python
# Get state
state = await shield.circuit_breaker.get_state()

# Trip
await shield.circuit_breaker.trip(reason="Emergency")

# Reset
await shield.circuit_breaker.reset()
```

## Sync Client

For synchronous usage:

```python
from kyvern_shield import KyvernShieldSync

shield = KyvernShieldSync(api_key=api_key)

result = shield.analyze(
    agent_id="my-agent",
    target_address="wallet_address",
    amount_sol=10.0,
    reasoning="User requested transfer"
)
```

## Error Handling

```python
from kyvern_shield import KyvernShield, ShieldError

try:
    result = await shield.analyze(...)
except ShieldError as e:
    print(f"Shield error: {e.code} - {e.message}")
```

## Type Hints

Full type hints are provided:

```python
from kyvern_shield import (
    AnalysisResult,
    SourceDetectionResult,
    HeuristicResult,
    LLMResult,
    CircuitState,
)
```

## See Also

- [Quick Start](/shield/quickstart)
- [TypeScript SDK](/shield/sdk-typescript)
- [API Reference](/api/)
