# INVENTORY.md — Applivia / Maestro AI Engine v3

## Environment
- **OS**: Linux 4.4.0
- **Node.js**: 22.22.0
- **Python**: 3.11.14
- **Docker**: 29.2.1
- **Git**: 2.43.0
- **npm**: 10.9.4
- **pip**: 24.0

## Project Isolation
- **Project**: Applivia / Maestro AI Engine v3
- **Repo**: paulohenriquephh/applivia
- **Branch**: claude/setup-execution-kernel-yHIcQ
- **VPS**: [ASSUMIDO] DigitalOcean VPS 2
- **Database**: PostgreSQL (maestroapp)
- **Docker Network**: maestro-net

## Services (Docker Compose)

| Service | Image | Port | Role |
|---------|-------|------|------|
| maestro-brain | custom (FastAPI) | 8000 | AI backend, WebSocket, chat |
| maestro-crewai | custom (CrewAI) | 8002 | Multi-agent orchestration |
| maestro-dashboard | custom (nginx) | 3333 | Legacy static dashboard |
| maestro-litellm | ghcr.io/berriai/litellm | 4000 | LLM routing + budget |
| maestro-n8n | n8nio/n8n | 5678 | Execution bus |
| maestro-evolution | atendai/evolution-api | 8080 | WhatsApp API |
| maestro-qdrant | qdrant/qdrant | 6333 | Vector database |
| maestro-postgres | postgres:16-alpine | 5432 | Authoritative DB |
| maestro-redis | redis:7-alpine | 6379 | Cache |
| maestro-grafana | grafana/grafana | 3000 | Monitoring |
| maestro-prometheus | prom/prometheus | 9090 | Metrics |
| maestro-portainer | portainer/portainer-ce | 9000 | Container management |
| maestro-uptime-kuma | louislam/uptime-kuma | 3001 | Uptime monitoring |
| maestro-langfuse | langfuse/langfuse | 3100 | Observability + evals |
| dashboard-api | custom (FastAPI) | 3002 | Dashboard backend API |
| openai-worker | custom (Python) | 8010 | OpenAI spine worker |
| claude-review | custom (Python) | 8011 | Claude adversarial sidecar |

## Secrets Matrix

| Key | Status | Scope |
|-----|--------|-------|
| OPENAI_API_KEY | NOT VALIDATED | Chat completions, embeddings |
| ANTHROPIC_API_KEY | NOT VALIDATED | Claude API |
| SUPABASE_SERVICE_ROLE_KEY | NOT VALIDATED | Full DB access |
| LITELLM_MASTER_KEY | NOT VALIDATED | LiteLLM admin |
| LANGFUSE_SECRET_KEY | NOT VALIDATED | Tracing write |
| LANGFUSE_PUBLIC_KEY | NOT VALIDATED | Tracing read |
| N8N_API_KEY | NOT VALIDATED | n8n automation |
| TELEGRAM_BOT_TOKEN | NOT VALIDATED | Bot control |
| STRIPE_SECRET_KEY | NOT VALIDATED | Live billing |
| CLOUDFLARE_API_TOKEN | NOT VALIDATED | DNS/CDN |
| DEEPSEEK_API_KEY | NOT VALIDATED | DeepSeek model |
| OPENROUTER_API_KEY | NOT VALIDATED | Multi-model routing |
| PERPLEXITY_API_KEY | NOT VALIDATED | Search AI |
| ELEVENLABS_API_KEY | NOT VALIDATED | TTS |
| RESEND_API_KEY | NOT VALIDATED | Email |
| VERCEL_TOKEN | NOT VALIDATED | Deploy |
| DIGITALOCEAN_TOKEN | NOT VALIDATED | VPS management |
| EVOLUTION_API_KEY | NOT VALIDATED | WhatsApp |
