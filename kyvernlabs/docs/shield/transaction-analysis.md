# Transaction Analysis

Transaction Analysis is Shield's core capability - evaluating every transaction before it executes to determine if it's safe.

## Analysis Pipeline

Every transaction goes through three analysis layers:

```
Request → Source Detection → Heuristic Analysis → LLM Analysis → Decision
```

### 1. Source Detection

First pass: Check if the transaction was influenced by malicious content.

- SANDBOX_TRIGGER detection
- Pattern matching for injection attempts
- Domain reputation checks

**Latency**: <5ms

### 2. Heuristic Analysis

Second pass: Rule-based pattern matching against known attack vectors.

- Transaction amount anomalies
- Address reputation
- Timing patterns
- Instruction patterns

**Latency**: <10ms

### 3. LLM Analysis

Third pass: Semantic analysis of the agent's reasoning.

- Intent verification
- Manipulation detection
- Context consistency

**Latency**: 30-50ms

## Risk Scoring

Each analysis layer contributes to a final risk score (0-100):

| Score Range | Risk Level | Default Action |
|-------------|------------|----------------|
| 0-25 | Low | Allow |
| 26-50 | Medium | Allow (with logging) |
| 51-75 | High | Review required |
| 76-100 | Critical | Block |

## Request Format

```typescript
interface AnalyzeRequest {
  agent_id: string;        // Your agent identifier
  target_address: string;  // Transaction target
  amount_sol: number;      // Amount in SOL
  reasoning: string;       // Agent's reasoning for this transaction
  context?: string;        // Additional context (optional)
  metadata?: object;       // Custom metadata (optional)
}
```

## Response Format

```typescript
interface AnalysisResult {
  request_id: string;
  timestamp: string;
  decision: 'allow' | 'block';
  risk_score: number;
  explanation: string;
  analysis_time_ms: number;

  source_detection_result: {
    is_safe: boolean;
    sandbox_mode: boolean;
    flags: string[];
    confidence: number;
  };

  heuristic_result: {
    passed: boolean;
    triggered_rules: string[];
    risk_contribution: number;
  };

  llm_result: {
    safe: boolean;
    manipulation_detected: boolean;
    confidence: number;
    analysis: string;
  };
}
```

## Example

```typescript
const result = await shield.analyze({
  agent_id: 'trading-bot-1',
  target_address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount_sol: 25.0,
  reasoning: `
    User requested to swap 25 SOL for BONK tokens.
    I found the best price on Jupiter aggregator.
    The swap will execute through the Jupiter program.
  `,
});

console.log(result);
// {
//   decision: 'allow',
//   risk_score: 12,
//   explanation: 'Transaction appears safe. Known DEX program, reasonable amount.',
//   analysis_time_ms: 42.3,
//   ...
// }
```

## Optimizing Latency

### Async Analysis

For non-blocking analysis:

```typescript
// Fire-and-forget with callback
shield.analyzeAsync(request, (result) => {
  if (result.decision === 'block') {
    cancelTransaction();
  }
});
```

### Batch Analysis

For multiple transactions:

```typescript
const results = await shield.analyzeBatch([
  { agent_id: 'bot-1', ... },
  { agent_id: 'bot-2', ... },
]);
```

### Caching

Shield automatically caches analysis for identical requests (5 minute TTL).

## See Also

- [Source Detection](/shield/source-detection)
- [Circuit Breaker](/shield/circuit-breaker)
- [API Reference](/api/analyze)
