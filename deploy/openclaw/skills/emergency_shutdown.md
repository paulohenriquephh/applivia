# Skill: Emergency Shutdown

## Description
Kill non-essential services in crisis situations (budget exhaustion, security breach, system overload).

## Trigger Words
- "emergency", "shutdown", "kill services"
- "stop everything", "crisis mode"
- Automatic: budget critical, security alert

## How It Works
1. Identify the crisis type
2. Determine which services to stop
3. Execute shutdown of non-essential services
4. Alert admin via all channels
5. Maintain essential services only

## Service Priority Tiers
### KEEP RUNNING (Essential)
- PostgreSQL (data integrity)
- Redis (state management)
- Caddy (HTTPS access)
- Telegram Bot (communication)

### STOP FIRST (Non-Essential)
- Appsmith (admin panel)
- Metabase (BI queries)
- crewai-scheduler (recurring tasks)
- n8n-worker-2 (second worker)

### STOP IF CRITICAL (Important but Sacrificable)
- Grafana (dashboards)
- Prometheus (metrics)
- AlertManager (alerts — keep Telegram direct)
- n8n-worker-1 (first worker)
- OpenClaw (this service)

### NEVER STOP
- PostgreSQL
- Redis
- Caddy

## Triggers
1. **Budget Critical**: Monthly cap exceeded
2. **Security Alert**: Suspicious API activity detected
3. **System Overload**: RAM > 95% or disk > 95%
4. **Manual**: Admin request via Telegram command

## Recovery
- After crisis resolved → restart services in reverse priority order
- Run full health check after recovery
- Generate incident report
