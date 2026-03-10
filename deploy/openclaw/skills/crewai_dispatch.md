# Skill: CrewAI Task Dispatch

## Description
Submit a task to any of the 10 CrewAI crews for execution.

## Trigger Words
- "send to crew", "dispatch task", "run crew"
- "analyze", "research", "create content", "find leads"

## How It Works
1. Determine the best crew based on user's request
2. Extract task parameters from the message
3. POST to CrewAI API /kickoff endpoint
4. Monitor task status and return results

## Endpoint
```
POST http://crewai-api:8001/kickoff
Content-Type: application/json
Body: {
  "crew": "<crew_name>",
  "task": "<task_description>",
  "inputs": { ...parameters... }
}
```

## Available Crews
1. market_research — Market analysis, competitor intel, trends
2. content — Blog posts, articles, copy
3. sales — Lead qualification, pitching, closing strategy
4. ads — Ad copy, media planning, ROI projections
5. support — Issue triage, resolution, CSAT tracking
6. finance — Bookkeeping, forecasting, expense audits
7. outreach — Prospect finding, email sequences
8. social_media — Social posts, scheduling, engagement
9. seo — Technical audit, link building, content optimization
10. data_enrichment — Scraping, cleaning, enriching data

## Crew Selection Logic
- Market/competitor questions → market_research
- Content requests → content
- Lead/sales questions → sales or outreach
- Ad requests → ads
- Support tickets → support
- Financial questions → finance
- Social media → social_media
- SEO questions → seo
- Data requests → data_enrichment

## Error Handling
- Unknown crew → suggest closest match
- Task timeout (5 min) → alert and offer retry
- Budget exceeded → notify and use free models only
