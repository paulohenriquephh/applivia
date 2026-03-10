# Skill: Self-Healing Monitor

## Description
Check container health and automatically restart unhealthy services.

## Trigger Words
- "health check", "service status", "is everything running"
- "restart service", "fix containers", "self heal"

## How It Works
1. Check health endpoints for all services
2. Identify unhealthy or unresponsive services
3. Attempt automatic restart for failed containers
4. Alert via Telegram on any issues

## Health Endpoints
| Service         | Endpoint                               | Method |
|-----------------|----------------------------------------|--------|
| CrewAI API      | http://crewai-api:8001/health          | GET    |
| CO-CEO          | http://co-ceo-agent:8002/health        | GET    |
| n8n Editor      | http://n8n-editor:5678/healthz         | GET    |
| Grafana         | http://grafana:3000/api/health         | GET    |
| Prometheus      | http://prometheus:9090/-/healthy       | GET    |
| Qdrant          | http://qdrant:6333/healthz             | GET    |

## Self-Healing Actions
1. **Restart**: `docker restart <container>` for unhealthy services
2. **Clear Cache**: Flush Redis cache if causing issues
3. **Rotate Logs**: Truncate oversized log files
4. **Free Disk**: Remove old n8n execution data
5. **Reconnect**: Reset database connection pools

## Escalation
- 1st failure: automatic restart attempt
- 2nd failure: Telegram alert to admin
- 3rd failure: escalate to CO-CEO for decision
- All critical services down: emergency protocol

## Monitoring Schedule
- Every 30 minutes (via heartbeat)
- On-demand via user request
- After any deployment or restart
