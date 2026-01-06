# Kyvern Shield API

Security analysis and monitoring API for Web3 AI agents.

## Quick Start

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Copy environment file
cp .env.example .env

# Run development server
uvicorn src.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Project Structure

```
apps/api/
├── src/
│   ├── main.py           # FastAPI application
│   ├── config.py         # Configuration management
│   ├── routes/           # API endpoints
│   │   ├── agents.py     # Agent management
│   │   ├── transactions.py # Transaction analysis
│   │   ├── alerts.py     # Alert management
│   │   └── health.py     # Health checks
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   └── middleware/       # Custom middleware
├── tests/                # Test suite
├── pyproject.toml        # Project configuration
└── .env.example          # Environment template
```

## Development

```bash
# Run tests
pytest

# Type checking
mypy src/

# Linting
ruff check src/

# Formatting
black src/
```
