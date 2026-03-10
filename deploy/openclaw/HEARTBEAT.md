# OpenClaw Heartbeat Configuration

## Health Check Schedule
- Frequency: Every 30 minutes
- Method: HTTP GET to service health endpoints
- Timeout: 10 seconds per service
- Retry: 1 attempt before alerting

## Services to Monitor
| Service    | URL                              | Critical |
|------------|----------------------------------|----------|
| CrewAI API | http://crewai-api:8001/health    | Yes      |
| CO-CEO     | http://co-ceo-agent:8002/health  | Yes      |
| n8n        | http://n8n-editor:5678/healthz   | Yes      |
| Redis      | redis://redis:6379 (PING)        | Yes      |
| PostgreSQL | postgres:5432 (pg_isready)       | Yes      |
| Qdrant     | http://qdrant:6333/healthz       | No       |
| Grafana    | http://grafana:3000/api/health   | No       |
| Prometheus | http://prometheus:9090/-/healthy  | No       |

## Alert Rules
- Critical service down → Immediate Telegram alert
- Non-critical service down → Alert after 2 consecutive failures
- All services down → Emergency protocol (attempt restart)
- Service recovered → Send recovery notification

## Self-Healing Actions
1. Container restart: `docker restart <container_name>`
2. Cache clear: Redis FLUSHDB on non-critical databases
3. Log rotation: Truncate logs over 100MB
4. Disk cleanup: Remove old workflow execution data

## Reporting
- Include in daily 8:00 AM briefing
- Track uptime percentage per service
- Alert if uptime drops below 99% for critical services
