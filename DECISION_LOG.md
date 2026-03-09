# DECISION_LOG.md

## 2026-03-09: Architecture Decisions

### D001: OpenAI as primary spine, not CrewAI
- **Reason**: OpenAI Assistants API is simpler, better documented, lower latency
- **Alternative**: CrewAI (already in repo) — kept as optional module
- **Risk**: OpenAI API changes; mitigated by LiteLLM abstraction layer

### D002: Self-hosted Langfuse over cloud
- **Reason**: No additional cost, full data control, same network as other services
- **Alternative**: Langfuse Cloud — would require signup and paid plan for volume
- **Risk**: Self-hosted maintenance; mitigated by Docker auto-restart

### D003: Postgres views for dashboard instead of materialized views
- **Reason**: Simpler, no refresh needed, sufficient for current scale
- **Alternative**: Materialized views with cron refresh
- **Risk**: Slow queries at scale; mitigated by proper indexes

### D004: Single docker-compose for all services
- **Reason**: Single VPS, simpler operations, atomic deploy
- **Alternative**: Separate compose files per service group
- **Risk**: All-or-nothing restarts; mitigated by depends_on and restart policies

### D005: Next.js dashboard with server-side API routes
- **Reason**: Already in repo, Tailwind already configured, SSR for real-time data
- **Alternative**: Separate React SPA + dedicated API
- **Risk**: Bundle size; acceptable for internal dashboard

### D006: Keep existing brain/crewai services
- **Reason**: Working code, backward compatibility, incremental migration
- **Alternative**: Replace entirely with OpenAI worker
- **Risk**: Dual systems; mitigated by routing through LiteLLM
