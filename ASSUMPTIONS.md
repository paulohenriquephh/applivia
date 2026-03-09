# ASSUMPTIONS.md

## [ASSUMIDO] Items

1. **VPS Target**: DigitalOcean VPS 2 is the deployment target for this project
2. **Database**: Using Docker PostgreSQL for now; can migrate to managed Supabase later
3. **Domain**: No custom domain configured yet; services accessed via IP:port
4. **OpenAI as primary**: OpenAI GPT-4o is the primary model; fallback chain: OpenAI → Anthropic → DeepSeek → OpenRouter
5. **Single VPS**: All services run on one VPS via Docker Compose
6. **n8n auth**: Using basic auth (username/password) for n8n
7. **Langfuse**: Self-hosted via Docker, not cloud version
8. **LiteLLM config**: File-based config, not DB-stored models

## [DESCONHECIDO] Items

1. Exact VPS IP and SSH access method from this environment
2. Current state of running Docker containers on VPS
3. Whether Supabase cloud project (uwjpgjquewwsltczhgnd) should be used instead of local Postgres
4. Budget limits for LLM costs

## [INACESSÍVEL] Items

1. VPS SSH connection from this sandbox environment
2. Supabase cloud project admin panel
3. n8n instance on VPS (would need SSH tunnel)
4. Langfuse cloud (using self-hosted instead)
