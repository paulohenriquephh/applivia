# CODEX SINGULARITY V6 — AI Agent Factory

Complete autonomous AI agent factory with 1000+ n8n workflows, 10 CrewAI crews, CO-CEO super-agent, and 24/7 billionaire loop.

## Quickstart

```bash
# 1. Clone and enter
cd deploy

# 2. One-command setup (fresh Ubuntu 24.04)
sudo bash setup.sh

# 3. Edit your API keys
nano .env

# 4. Restart with keys
docker compose restart

# 5. Generate and import 1000 workflows
make workflows
make import-workflows
```

## Architecture

| Component | Port | Purpose |
|-----------|------|---------|
| PostgreSQL | 5432 | State & data |
| Redis | 6379 | Cache, queues, budget |
| Qdrant | 6333 | Vector memory |
| n8n Editor | 5678 | Workflow editor |
| n8n Webhooks | 5679 | Webhook receiver |
| CrewAI API | 8001 | 10 crews, 30 agents |
| CO-CEO Agent | 8002 | 10 premium models |
| OpenClaw | 18789 | Chat interface |
| Grafana | 3000 | 10 dashboards |
| Metabase | 3001 | Business intelligence |
| Appsmith | 3002 | Admin panel |
| Prometheus | 9090 | Metrics |
| AlertManager | 9093 | Alerts → Telegram |
| Caddy | 80/443 | Reverse proxy, auto-TLS |

## Web Access (via Caddy)

| URL | Service |
|-----|---------|
| n8n.{DOMAIN} | Workflow editor |
| hook.{DOMAIN} | Webhook receiver |
| api.{DOMAIN} | CrewAI REST API |
| ceo.{DOMAIN} | CO-CEO interface |
| dash.{DOMAIN} | Grafana dashboards |
| bi.{DOMAIN} | Metabase BI |
| admin.{DOMAIN} | Appsmith admin |
| claw.{DOMAIN} | OpenClaw chat |

## LLM Tiers

**Tier 1 — CO-CEO (10 premium models):** GPT-5.4, Claude Opus 4.6, Grok 4.1 Fast, o4-mini, Claude Sonnet 4.5, GPT-5 Mini, Gemini 3.1 Pro, DeepSeek V3.2, Grok 4, Mistral Medium 3

**Tier 2 — Workers (5 cheap/free):** GLM-4.7-Flash (FREE), Gemini 2.0 Flash-Lite (FREE), DeepSeek V3.2, Qwen-Flash, GPT-4.1 Nano

**Tier 3 — Fallback:** GPT-5 Mini, Grok 3 Mini, Qwen-Plus

## CrewAI Crews

| Crew | Agents | Purpose |
|------|--------|---------|
| market_research | Analyst, Spotter, Writer | Market analysis |
| content | Writer, SEO Editor, QA | Content creation |
| sales | Qualifier, Pitcher, Closer | Sales pipeline |
| ads | Copywriter, Planner, Analyst | Advertising |
| support | Triager, Solver, CSAT | Customer support |
| finance | Bookkeeper, Forecaster, Auditor | Financial ops |
| outreach | Finder, Composer, Tracker | Email outreach |
| social_media | Creator, Scheduler, Analyst | Social media |
| seo | Auditor, Linker, Optimizer | SEO optimization |
| data_enrichment | Scraper, Cleaner, Enricher | Data ops |

## Budget

- **Total:** $500 for 6 months (~$83.33/month)
- **Hosting:** Hetzner CPX42 ~$23/month
- **LLM APIs:** ~$35/month (mostly free/cheap models)
- **Buffer:** $95 safety margin

## Commands

```bash
make up              # Start all services
make down            # Stop all services
make health          # Check service health
make budget          # Check budget status
make logs            # Tail all logs
make backup          # Run backup
make restore         # Restore from backup
make workflows       # Generate 1000 workflows
make import-workflows # Import into n8n
```

## Telegram Bot Commands

- `/health` — Service status
- `/budget` — Budget check
- `/crews` — List crews
- `/kickoff <crew>` — Run a crew
- `/ask <question>` — Ask CO-CEO
- `/briefing` — CEO briefing
- `/status <id>` — Task status
- `/models` — Available models

## Billionaire Loop (24/7)

10 playbooks cycle continuously via Maestro Auto Run:
1. Morning Scan → 2. Lead Gen → 3. Outreach → 4. Content → 5. Social
6. Competitor Watch → 7. Revenue → 8. Client Health → 9. Budget → 10. CEO Briefing
→ LOOP BACK TO 1

~2.5 hours per cycle, ~10 cycles per day.
