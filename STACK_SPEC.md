# STACK_SPEC.md — Applivia / Maestro AI Engine v3

## Architecture Decision

### Topology: Monorepo + Docker Compose + Supabase

**Weighted Score: 8.2/10**

| Criterion | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Operational impact | 18 | 9 | 162 |
| Risk of not acting | 15 | 8 | 120 |
| Root-cause leverage | 13 | 8 | 104 |
| Ease of correction | 11 | 9 | 99 |
| Evidence quality | 10 | 7 | 70 |
| Production robustness | 9 | 8 | 72 |
| Governance/auditability | 8 | 9 | 72 |
| Cost/ROI | 7 | 8 | 56 |
| Third-party fragility | 5 | 7 | 35 |
| Expandability | 4 | 8 | 32 |
| **Total** | **100** | | **822/1000** |

### Component Responsibilities

#### A. OpenAI Spine (workers/openai/)
- Primary reasoning engine
- Agent orchestration via OpenAI Assistants API
- Task routing and execution
- Logs all runs to Postgres

#### B. n8n Execution Bus (fundacao/docker-compose: maestro-n8n)
- External integrations (Telegram, WhatsApp, email)
- Webhook handling
- Scheduled jobs
- Approval-by-exception workflows

#### C. Supabase/Postgres Ledger (sql/schema.sql)
- 12 core tables: jobs, runs, events, approvals, cost_tracking, errors, integrations, incidents, audit_events, deployment_events, knowledge_sources
- 6 materialized views for dashboard
- Immutable audit trail

#### D. LiteLLM (fundacao/docker-compose: maestro-litellm)
- Provider routing: OpenAI → Anthropic → DeepSeek → OpenRouter
- Budget caps per model
- Rate limiting
- Cost tracking passthrough

#### E. Langfuse (fundacao/docker-compose: maestro-langfuse)
- Trace every LLM call
- Prompt versioning
- Evaluation pipelines
- Cost visibility

#### F. Claude Sidecar (workers/claude-review/)
- Adversarial review of OpenAI outputs
- Code review
- Assumption challenging
- Failure path analysis

#### G. Dashboard (src/app/dashboard/)
- Next.js with Tailwind CSS
- Real data from apps/api/ → Postgres
- Pages: Overview, Runs, Traces, Integrations, Approvals, Incidents, Costs, Audit, Security, Knowledge

### Alternatives Considered

| Alternative | Why Rejected |
|------------|-------------|
| LangGraph | Unnecessary complexity — n8n + simple workers sufficient for current workflows |
| Kubernetes | Overkill — Docker Compose adequate for single-VPS deployment |
| Separate Supabase project | Already have Postgres in Docker; can migrate to managed Supabase later |
| Lovable/Replit UI | Next.js already in repo; no benefit to external UI builder |
| CrewAI as primary | OpenAI Assistants API is simpler, more maintainable; CrewAI kept as optional |
