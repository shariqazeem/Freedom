# TypeScript SDK

The official TypeScript SDK for Kyvern Shield.

## Installation

```bash
npm install @kyvern/shield-sdk
```

## Quick Start

```typescript
import { KyvernShield } from '@kyvern/shield-sdk';

const shield = new KyvernShield(process.env.KYVERN_API_KEY);

const result = await shield.analyze({
  agent_id: 'my-agent',
  target_address: 'wallet_address',
  amount_sol: 10.0,
  reasoning: 'User requested transfer',
});

if (result.decision === 'allow') {
  // Safe to execute
}
```

## Configuration

```typescript
const shield = new KyvernShield(apiKey, {
  baseUrl: 'https://api.kyvernlabs.com/v1', // Custom endpoint
  timeout: 5000, // Request timeout in ms
  retries: 3, // Number of retries on failure
  trustedDomains: ['api.myservice.com'], // Allowlisted domains
});
```

## API Reference

### `shield.analyze(request)`

Analyze a transaction before execution.

```typescript
interface AnalyzeRequest {
  agent_id: string;
  target_address: string;
  amount_sol: number;
  reasoning: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

interface AnalysisResult {
  request_id: string;
  timestamp: string;
  decision: 'allow' | 'block';
  risk_score: number;
  explanation: string;
  analysis_time_ms: number;
  source_detection_result: SourceDetectionResult;
  heuristic_result: HeuristicResult;
  llm_result: LLMResult;
}
```

### `shield.getTransactions(options)`

Get recent transaction history.

```typescript
const transactions = await shield.getTransactions({
  limit: 50,
  agent_id: 'my-agent', // Optional filter
});
```

### `shield.getStats()`

Get aggregate statistics.

```typescript
const stats = await shield.getStats();
// { total: 1000, allowed: 950, blocked: 50, avg_latency: 42 }
```

### `shield.circuitBreaker`

Circuit breaker controls.

```typescript
// Get state
const state = await shield.circuitBreaker.getState();

// Trip
await shield.circuitBreaker.trip({ reason: 'Emergency' });

// Reset
await shield.circuitBreaker.reset();
```

## Error Handling

```typescript
import { KyvernShield, ShieldError } from '@kyvern/shield-sdk';

try {
  const result = await shield.analyze(request);
} catch (error) {
  if (error instanceof ShieldError) {
    console.error(`Shield error: ${error.code} - ${error.message}`);
  }
}
```

## TypeScript Types

All types are exported:

```typescript
import type {
  AnalyzeRequest,
  AnalysisResult,
  SourceDetectionResult,
  HeuristicResult,
  LLMResult,
  CircuitState,
} from '@kyvern/shield-sdk';
```

## See Also

- [Quick Start](/shield/quickstart)
- [Python SDK](/shield/sdk-python)
- [API Reference](/api/)
