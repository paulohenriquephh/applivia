# Applivia — Maestro AI Engine v3

AI-powered automation platform with intelligent agents for marketing, sales, and business operations.

## Architecture

```
applivia/
├── src/                        # Next.js dashboard (10 pages)
│   ├── app/
│   │   ├── page.tsx            # Home
│   │   └── dashboard/          # BI Dashboard
│   │       ├── page.tsx        # Overview
│   │       ├── runs/           # Execution history
│   │       ├── costs/          # Cost tracking
│   │       ├── approvals/      # Approval queue
│   │       ├── incidents/      # Incident management
│   │       ├── integrations/   # Integration health
│   │       ├── audit/          # Audit log
│   │       ├── errors/         # Error log
│   │       ├── knowledge/      # Knowledge sources
│   │       └── security/       # Security posture
│   └── lib/                    # Shared utilities
├── apps/api/                   # Dashboard API (FastAPI)
├── workers/
│   ├── openai/                 # OpenAI spine worker
│   └── claude-review/          # Claude adversarial sidecar
├── fundacao/                   # Docker infrastructure
│   ├── brain/                  # FastAPI backend
│   ├── crewai/                 # CrewAI agents
│   ├── litellm-config/        # LiteLLM routing config
│   ├── n8n-workflows/         # n8n automation
│   └── docker-compose.yml     # Full stack
├── sql/schema.sql             # Database schema (12 tables, 6 views)
├── scripts/                   # Health check, smoke test, deploy
├── runbooks/                  # Operational runbooks
├── docs/                      # Documentation
└── packages/shared/           # Shared utilities
```

## Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Primary Spine | OpenAI GPT-4o | Reasoning, orchestration |
| Execution Bus | n8n | Integrations, webhooks, triggers |
| Ledger | PostgreSQL | Authoritative state (12 tables) |
| LLM Routing | LiteLLM | Multi-provider routing, budgets |
| Observability | Langfuse | Tracing, evals, prompt versioning |
| Review Sidecar | Claude | Adversarial review, failure hunting |
| Dashboard | Next.js | Real-time operational BI |

## Services

| Service | Port | Description |
|---------|------|-------------|
| maestro-brain | 8000 | FastAPI backend (AI, WebSocket) |
| maestro-crewai | 8002 | Multi-agent orchestration |
| dashboard-api | 3002 | Dashboard data API |
| openai-worker | 8010 | OpenAI spine worker |
| claude-review | 8011 | Claude adversarial sidecar |
| maestro-litellm | 4000 | LLM proxy + routing |
| maestro-n8n | 5678 | Automation workflows |
| maestro-langfuse | 3100 | Observability + evals |
| maestro-postgres | 5432 | PostgreSQL database |
| maestro-redis | 6379 | Redis cache |
| maestro-qdrant | 6333 | Vector database |
| maestro-evolution | 8080 | WhatsApp API |
| maestro-grafana | 3000 | Monitoring |
| maestro-prometheus | 9090 | Metrics |

## Getting Started

### 1. Configure environment
```bash
cp ENV.example .env
# Fill in API keys and passwords
```

### 2. Start infrastructure
```bash
cd fundacao
docker compose up -d
```

### 3. Apply database schema
```bash
bash scripts/apply-schema.sh
bash scripts/seed-integrations.sh
```

### 4. Start dashboard
```bash
npm install
npm run dev -- --port 3001
```

### 5. Verify
```bash
bash scripts/health-check.sh
bash scripts/smoke-test.sh
```

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant context |
| `STATUS.md` | Current system status |
| `INVENTORY.md` | Environment inventory |
| `STACK_SPEC.md` | Architecture decisions |
| `ASSUMPTIONS.md` | Assumptions and unknowns |
| `DECISION_LOG.md` | Decision history |
| `TEST_PLAN.md` | Acceptance criteria |
| `ENV.example` | Environment template |
| `sql/schema.sql` | Database schema |
