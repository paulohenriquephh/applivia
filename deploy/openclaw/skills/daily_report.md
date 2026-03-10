# Skill: Daily Report Generator

## Description
Generate a comprehensive daily CEO briefing covering all key metrics.

## Trigger Words
- "daily report", "briefing", "what happened today"
- "daily summary", "CEO briefing", "status report"

## How It Works
1. Gather data from all services
2. Compile into structured briefing
3. Send via Telegram and return in chat

## Data Sources
```
GET http://crewai-api:8001/budget/check     — Budget status
GET http://crewai-api:8001/health            — Service health
GET http://co-ceo-agent:8002/health          — CO-CEO status
POST http://co-ceo-agent:8002/ask            — Generate analysis
```

## Report Structure
1. **System Status** — All services health check
2. **Budget Overview** — Daily spend, monthly remaining, alerts
3. **Tasks Completed** — Crew executions in last 24h
4. **Revenue Update** — Latest revenue metrics
5. **Client Health** — Active clients, churn risk
6. **Alerts & Issues** — Any unresolved alerts
7. **Today's Priorities** — Scheduled tasks for today
8. **Key Metrics** — KPIs dashboard summary

## Schedule
- Automatic: 8:00 AM UTC daily (via scheduler)
- On-demand: user requests "daily report"

## Output
- Telegram message (formatted markdown)
- JSON data for dashboard ingestion
- Chat response (summarized version)
