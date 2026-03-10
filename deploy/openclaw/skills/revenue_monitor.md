# Skill: Revenue Monitor

## Description
Track revenue anomalies, analyze trends, and alert on significant changes.

## Trigger Words
- "revenue", "income", "earnings", "MRR"
- "revenue report", "money coming in", "sales numbers"

## How It Works
1. Query revenue data from database
2. Compare against historical baselines
3. Detect anomalies (spikes, drops, trends)
4. Generate actionable insights

## Data Sources
- PostgreSQL: revenue transactions, client payments
- Redis: real-time revenue counters
- CrewAI finance crew: detailed analysis

## Anomaly Detection Rules
- Revenue drop > 20% from 7-day average → ALERT
- Revenue spike > 50% from baseline → POSITIVE ALERT
- New client acquisition rate change > 30% → NOTIFY
- Churn rate increase > 10% → WARNING
- MRR growth stall (< 1% for 30 days) → STRATEGY ALERT

## Reports
- **Real-time**: Current day revenue vs target
- **Daily**: Revenue by source, client, product
- **Weekly**: Trend analysis with growth rate
- **Monthly**: Full P&L summary with projections

## Actions on Alert
1. Notify via Telegram with context
2. Trigger finance crew for deep analysis
3. Update Grafana revenue dashboard
4. Escalate to CO-CEO if strategic action needed
