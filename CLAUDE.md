# CLAUDE.md — Applivia / Maestro AI Engine v3

## Project
Applivia — AI-powered automation platform with intelligent agents for marketing, sales, and business operations.

## Architecture
- **OpenAI-first spine**: Primary reasoning/orchestration via OpenAI API through LiteLLM
- **n8n**: Execution bus for integrations, webhooks, triggers, approval flows
- **Supabase/Postgres**: Authoritative ledger for all state (jobs, runs, events, costs, audit)
- **LiteLLM**: Provider routing, fallback, budget control
- **Langfuse**: Observability, tracing, prompt versioning, evals
- **Claude sidecar**: Adversarial review, code review, failure hunting
- **Next.js dashboard**: Real operational BI with live data from Postgres

## Key Directories
- `src/` — Next.js frontend (dashboard UI)
- `apps/api/` — FastAPI backend serving dashboard data
- `fundacao/` — Docker Compose infrastructure, brain, crewai, n8n workflows
- `workers/openai/` — OpenAI spine worker
- `workers/claude-review/` — Claude adversarial review sidecar
- `sql/` — Database schema
- `scripts/` — Health check, smoke test, backup scripts
- `packages/shared/` — Shared Python utilities

## Database
- PostgreSQL via Supabase or Docker
- Schema in `sql/schema.sql`
- Tables: jobs, runs, events, approvals, cost_tracking, errors, integrations, incidents, audit_events, deployment_events, knowledge_sources

## Commands
```bash
# Frontend
npm run dev          # Start Next.js dev server
npm run build        # Build for production

# Backend services
cd fundacao && docker compose up -d

# Run schema
psql $DATABASE_URL -f sql/schema.sql

# Health check
bash scripts/health-check.sh

# Smoke test
bash scripts/smoke-test.sh
```

## Rules
- Never hardcode secrets
- Never commit .env files
- All material actions must be logged to the runs table
- Every approval flow must go through the approvals table
- Dashboard must show real data only — never mock/placeholder
- Use LiteLLM for all LLM calls (routing + cost tracking)
- Use Langfuse for all tracing
