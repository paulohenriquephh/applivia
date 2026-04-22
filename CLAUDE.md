# CLAUDE.md — Applivia (Maestro AI Engine v3)

## What is this project?

AI-powered automation platform for a luxury import/export business (watches, bags — China, Italy, Brazil). It has two main parts:

1. **Next.js frontend** (`src/`) — Dashboard UI for monitoring agents and workflows
2. **Backend infrastructure** (`fundacao/`) — Dockerized microservices: FastAPI brain, CrewAI multi-agent system, n8n automation, WhatsApp integration, vector search, and observability stack

## Project structure

```
src/app/              Next.js 16 App Router (pages, layouts)
fundacao/
  brain/main.py       FastAPI backend — chat, voice, agents, WebSocket, knowledge search
  crewai/main.py      CrewAI multi-agent orchestration (7 specialized agents)
  dashboard/          Legacy static HTML dashboard (served via nginx)
  n8n-workflows/      n8n workflow JSON exports
  scripts/            deploy.sh, watchdog.sh
  docker-compose.yml  Full stack definition (15+ services)
```

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Package manager:** Bun (not npm/yarn — no package-lock.json)
- **Backend:** Python (FastAPI + CrewAI), LiteLLM proxy, PostgreSQL 16, Redis 7, Qdrant
- **Messaging:** Evolution API (WhatsApp), n8n (workflow automation)
- **Monitoring:** Grafana, Prometheus, Uptime Kuma, Portainer
- **Path alias:** `@/*` maps to `./src/*`

## Commands

```bash
bun install           # Install frontend dependencies
bun dev               # Start Next.js dev server
bun run build         # Production build
bun run lint          # ESLint
bun run typecheck     # TypeScript type checking (tsc --noEmit)
```

Backend services run via Docker Compose from `fundacao/`:
```bash
cd fundacao && docker compose up -d
```

## Key conventions

- **Language:** Codebase comments and backend prompts are in Portuguese (pt-BR). The system prompt in brain/main.py is in Portuguese.
- **Strict TypeScript:** `tsconfig.json` has `"strict": true`
- **ESLint:** Uses `eslint-config-next` flat config (`eslint.config.mjs`)
- **No package-lock.json:** The repo uses Bun; `package-lock.json` is in `.gitignore`
- **Environment variables:** All secrets go in `.env` (gitignored). See `fundacao/docker-compose.yml` for the full list of required env vars (API keys for Anthropic, OpenRouter, Google, ElevenLabs, Telegram, Brave, Perplexity, plus DB passwords).

## Architecture notes

- **Brain API** (port 8000): Main FastAPI backend. Handles chat via LiteLLM proxy, voice via ElevenLabs, real-time WebSocket, vector knowledge search via Qdrant, and agent execution logging to PostgreSQL.
- **CrewAI** (port 8002): Hierarchical multi-agent system with 7 agents (orchestrator, import, advertising, luxury watch, WhatsApp SDR, TikTok growth, knowledge sync). Uses LiteLLM as the LLM backend.
- **LiteLLM** (port 4000): Unified LLM proxy — routes to Anthropic, OpenRouter, Google models.
- **Evolution API** (port 8080): WhatsApp integration.
- **n8n** (port 5678): Workflow automation (daily sync, WhatsApp webhooks).
- **Next.js frontend** (port 3000/3001): Dashboard UI. Note: Grafana also binds to port 3000 in Docker, so run the dev server on 3001 to avoid conflicts.

## Port map

| Service | Port |
|---------|------|
| Brain (FastAPI) | 8000 |
| CrewAI | 8002 |
| Legacy Dashboard | 3333 |
| LiteLLM | 4000 |
| n8n | 5678 |
| Evolution (WhatsApp) | 8080 |
| Qdrant | 6333 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Grafana | 3000 |
| Prometheus | 9090 |
| Uptime Kuma | 3001 |
| Portainer | 9000 |

## Things to watch out for

- The database connection string in `brain/main.py` has a quirky double-replacement for the password — be careful when modifying DB config.
- CrewAI agent modules are imported from `agents/` subpackage inside `fundacao/crewai/` but those files are not yet committed to the repo.
- The Next.js frontend is minimal (landing page + dashboard route). Most business logic lives in the Python backend.
- CORS is set to `allow_origins=["*"]` in the Brain API — tighten this for production.
