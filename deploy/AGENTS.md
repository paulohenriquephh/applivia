# AGENTS.md — Codex Singularity V6

This repository contains the complete autonomous AI agent factory.
See README.md for quickstart and documentation.

## Execution Mode
- FSM: S1→S6 + Reentry
- Policy: block→bypass, uncertainty→hypothesis, ambiguity→useful-decision
- Budget: $500 hard cap 6 months, auto-reload alerts at <$10

## File Structure
- `deploy/` — All deployment files (84+ code files)
- `deploy/setup.sh` — One-command deploy
- `deploy/docker-compose.yml` — 17 containers
- `deploy/crewai-api/` — 10 crews, 30 agents, cascading LLM router
- `deploy/co-ceo-agent/` — 10 premium models, full capabilities
- `deploy/scripts/generate_workflows.py` — Generates 1000 n8n workflows
- `deploy/openclaw/` — Conversational interface with 10 skills
- `deploy/grafana/` — 10 dashboards
- `deploy/maestro/` — 10 playbooks for billionaire loop
