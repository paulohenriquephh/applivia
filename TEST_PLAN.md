# TEST_PLAN.md — Applivia / Maestro AI Engine v3

## Acceptance Criteria

### 1. Infrastructure
- [ ] Docker Compose starts all services without errors
- [ ] PostgreSQL accepts connections
- [ ] Schema applied successfully (12 tables, 6 views)
- [ ] Redis responds to PING
- [ ] Qdrant health endpoint returns OK

### 2. OpenAI Spine
- [ ] Worker health endpoint returns 200
- [ ] Can process a simple chat completion
- [ ] Run is logged to runs table
- [ ] Cost is logged to cost_tracking table
- [ ] Trace appears in Langfuse

### 3. Claude Sidecar
- [ ] Worker health endpoint returns 200
- [ ] Can review an OpenAI output
- [ ] Review is logged to runs table

### 4. n8n
- [ ] n8n UI accessible on port 5678
- [ ] Can create and execute a test workflow
- [ ] Webhook endpoint responds

### 5. LiteLLM
- [ ] Health endpoint returns OK
- [ ] Can route to OpenAI
- [ ] Fallback to Anthropic works when OpenAI fails
- [ ] Budget limits enforced

### 6. Langfuse
- [ ] UI accessible on port 3100
- [ ] Traces from OpenAI worker visible
- [ ] Cost data populated

### 7. Dashboard
- [ ] Next.js builds without errors
- [ ] Overview page loads with real data
- [ ] Runs page shows run history
- [ ] Costs page shows cost breakdown
- [ ] Approvals page shows pending items

### 8. Security
- [ ] No secrets in code or logs
- [ ] CORS configured appropriately
- [ ] n8n has auth enabled
- [ ] Audit events being recorded

### 9. End-to-End
- [ ] Submit task → OpenAI processes → logged in DB → visible in dashboard
- [ ] Trigger approval → pending in DB → visible in dashboard → approve → completed
- [ ] Induce error → error logged → incident created → visible in dashboard
- [ ] Webhook received by n8n → triggers workflow → logged

## Smoke Test Script
See `scripts/smoke-test.sh`
