# Skill: Budget Guard

## Description
Monitor LLM spend, enforce budget limits, and provide cost reports.

## Trigger Words
- "budget", "spending", "costs", "how much spent"
- "budget status", "cost report", "spending alert"

## How It Works
1. Query the budget tracker for current status
2. Analyze spend patterns
3. Alert on anomalies or threshold breaches
4. Provide recommendations for cost optimization

## Endpoint
```
GET http://crewai-api:8001/budget/check
```

## Budget Limits
- Monthly hard cap: $83.33 ($500/6 months)
- Daily cap per provider: $25.00
- Alert threshold: $10 remaining
- Conversation budget: $2.00

## Alert Levels
- **OK**: Monthly spend < 80% of cap
- **Warning**: Monthly spend 80-100% of cap
- **Critical**: Monthly spend > cap → auto-shutdown non-essential

## Cost Optimization Recommendations
1. Route to free models (GLM-4.7-Flash, Gemini free tier) when possible
2. Use DeepSeek for batch processing ($0.028 with cache)
3. Limit CO-CEO premium calls to essential decisions
4. Cache frequent queries in Redis
5. Reduce polling frequency if approaching limit

## Reports
- Real-time: current spend by model/provider
- Daily: trend analysis with projections
- Weekly: optimization recommendations
- Monthly: full audit with breakdown
