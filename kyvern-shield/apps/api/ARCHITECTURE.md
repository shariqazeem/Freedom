# Kyvern Shield API Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           KYVERN SHIELD                                      │
│                    AI Agent Security Infrastructure                          │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   AI AGENT      │
                              │  (Client SDK)   │
                              └────────┬────────┘
                                       │
                                       │ Transaction Intent
                                       │ {target_address, amount_sol,
                                       │  function_signature, reasoning}
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI BACKEND                                     │
│                       POST /api/v1/analysis/intent                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    LAYER 1: HEURISTIC ANALYSIS                        │   │
│  │                         (< 1ms latency)                               │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  ✓ Blacklist Check (SQLite + In-Memory Cache)                        │   │
│  │  ✓ Amount Limit Enforcement (configurable)                           │   │
│  │  ✓ Suspicious Pattern Detection (regex)                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                       │                                      │
│                                       ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │              LAYER 2: SOURCE DETECTION (RESEARCH-BASED)               │   │
│  │                   Indirect Prompt Injection Defense                   │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  ✓ URL Extraction from Reasoning                                     │   │
│  │  ✓ Domain Trust Verification (allowlist/blocklist)                   │   │
│  │  ✓ Indirect Injection Pattern Detection                              │   │
│  │  ✓ SANDBOX MODE Trigger for Elevated Scrutiny                        │   │
│  │                                                                       │   │
│  │  RESEARCH BASIS:                                                      │   │
│  │  Paper: "Prompt Injection in Large Language Models" (2023)            │   │
│  │  Attack: Indirect Prompt Injection via Web Content                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                       │                                      │
│                                       ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    LAYER 3: LLM ANALYSIS                              │   │
│  │                    (Ollama + Llama 3)                                 │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  Standard Mode:                                                       │   │
│  │    ✓ Consistency Check (reasoning vs transaction)                    │   │
│  │    ✓ Direct Prompt Injection Detection                               │   │
│  │    ✓ Risk Scoring (0-100)                                            │   │
│  │                                                                       │   │
│  │  SANDBOX Mode (when untrusted sources detected):                     │   │
│  │    ✓ Enhanced scrutiny prompt                                        │   │
│  │    ✓ Indirect injection analysis                                     │   │
│  │    ✓ Manipulation pattern detection                                  │   │
│  │    ✓ Data integrity verification                                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                       │                                      │
│                                       ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     DECISION ENGINE                                   │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  Combine scores from all layers:                                      │   │
│  │    - Heuristic weight: 40%                                           │   │
│  │    - LLM weight: 60%                                                 │   │
│  │    - Source detection penalties applied                              │   │
│  │                                                                       │   │
│  │  Auto-block threshold: 80                                            │   │
│  │  Auto-allow threshold: 20                                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │    ANALYSIS RESULT      │
                         │  {decision, risk_score, │
                         │   explanation, warnings}│
                         └─────────────────────────┘
```

## API Endpoints

### Core Analysis
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/analysis/intent` | POST | Analyze transaction intent |
| `/api/v1/analysis/simulate/rogue` | POST | Test attack scenarios |

### Blacklist Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/analysis/blacklist` | GET | List all entries |
| `/api/v1/analysis/blacklist` | POST | Add new entry |
| `/api/v1/analysis/blacklist/{value}` | DELETE | Remove entry |
| `/api/v1/analysis/blacklist/check/{addr}` | GET | Quick lookup |

## Attack Scenarios (Testing)

| Scenario | Description | Expected Result |
|----------|-------------|-----------------|
| `blacklisted_address` | Known malicious address | BLOCK (score: 100) |
| `excessive_amount` | Amount > limit | BLOCK (score: 75) |
| `prompt_injection` | Direct injection | BLOCK (score: 100) |
| `indirect_injection` | External data manipulation | BLOCK (score: 100) |
| `inconsistent_reasoning` | Mismatched goals | BLOCK/FLAG |

## Research-to-Code Workflow

1. **Identify Threat** → "Indirect Prompt Injection via Web Content"
2. **Extract Attack Vector** → Agent reads malicious data from HTTP source
3. **Implement Defense**:
   - `source_detection.py` - URL extraction, domain verification
   - `llm_analyzer.py` - SANDBOX mode prompt
   - `analyzer.py` - Combined scoring with penalties

## File Structure

```
apps/api/src/
├── main.py              # FastAPI application
├── config.py            # Configuration (Ollama, limits)
├── models/
│   ├── intent.py        # TransactionIntent, AnalysisResult
│   └── blacklist.py     # BlacklistEntry
├── db/
│   └── blacklist.py     # SQLite with in-memory cache
├── services/
│   ├── heuristic.py     # Layer 1: Rule-based analysis
│   ├── source_detection.py  # Layer 2: Research-based defense
│   ├── llm_analyzer.py  # Layer 3: Ollama/Llama 3
│   └── analyzer.py      # Orchestrator
└── routes/
    └── analysis.py      # API endpoints
```

## Running the API

```bash
cd apps/api
source .venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

## Connecting to Dashboard

The web dashboard connects via the API client:

```typescript
// apps/web/src/lib/api-client.ts
import { shieldAPI } from '@/lib/api-client';

const result = await shieldAPI.analyzeIntent({
  agent_id: "...",
  target_address: "...",
  amount_sol: 1.0,
  reasoning: "..."
});

if (result.decision === "block") {
  // Handle blocked transaction
}
```
