# Kyvern Shield

> Security Infrastructure for Web3 AI Agents

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Anchor%200.30-purple.svg)](https://www.anchor-lang.com/)

Kyvern Shield provides real-time monitoring, threat detection, and circuit breaker protection for autonomous AI agents operating on Solana and other blockchains.

## Features

- **Real-time Monitoring** - Track every transaction with sub-second latency
- **ML-powered Threat Detection** - Identify suspicious patterns automatically
- **On-chain Circuit Breaker** - Solana smart contract for instant protection
- **Policy Engine** - Granular rules for agent behavior
- **Comprehensive Audit Trail** - Full history for compliance

## Architecture

```
kyvern-shield/
├── apps/
│   ├── web/          # Next.js 15 dashboard & marketing
│   ├── api/          # Python FastAPI backend
│   └── docs/         # VitePress documentation
├── packages/
│   ├── ui/           # Shared React components (Shadcn)
│   ├── types/        # TypeScript type definitions
│   ├── sdk/          # Shield SDK for developers
│   └── config/       # Shared configurations
└── contracts/
    └── circuit-breaker/  # Solana Anchor program
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Python 3.11+ (for API)
- Rust + Anchor CLI (for contracts)

### Installation

```bash
# Clone the repository
git clone https://github.com/kyvernlabs/kyvern-shield.git
cd kyvern-shield

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### Development Commands

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm dev:web     # Frontend only
pnpm dev:docs    # Docs only

# Build all packages
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm type-check

# Run tests
pnpm test
```

### API Development

```bash
cd apps/api

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -e ".[dev]"

# Start API server
uvicorn src.main:app --reload --port 8000
```

### Contract Development

```bash
cd contracts/circuit-breaker

# Build
anchor build

# Test
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## Project Structure

| Directory | Description |
|-----------|-------------|
| `apps/web` | Next.js 15 frontend with Shadcn UI |
| `apps/api` | Python FastAPI backend for analysis |
| `apps/docs` | VitePress documentation site |
| `packages/ui` | Shared UI component library |
| `packages/types` | Shared TypeScript definitions |
| `packages/sdk` | Shield SDK for integration |
| `contracts/circuit-breaker` | Solana Anchor smart contract |

## Documentation

- [Getting Started](./apps/docs/guides/getting-started.md)
- [API Reference](./apps/docs/api-reference/index.md)
- [Security Research](./apps/docs/research/index.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Security

If you discover a security vulnerability, please email security@kyvernlabs.com instead of opening a public issue.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

Built by [Kyvern Labs](https://kyvernlabs.com) | [Twitter](https://twitter.com/kyvernlabs) | [GitHub](https://github.com/kyvernlabs)
