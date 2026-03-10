# Skill: n8n Workflow Trigger

## Description
Call any n8n workflow via its webhook endpoint.

## Trigger Words
- "run workflow", "trigger workflow", "execute workflow"
- "start automation", "run n8n"

## How It Works
1. User specifies workflow name or webhook path
2. Extract any parameters from the user's message
3. POST to n8n webhook endpoint with parameters
4. Return the workflow execution result

## Endpoint
```
POST http://n8n-webhooks:5678/webhook/{path}
Content-Type: application/json
Body: { ...user parameters... }
```

## Parameters
- `path` (required): Webhook path of the workflow
- `data` (optional): JSON payload to send

## Examples
- "Run the morning scan workflow" → POST /webhook/morning-scan
- "Trigger lead generation for SaaS" → POST /webhook/lead-generation {"industry": "SaaS"}
- "Execute the budget check" → POST /webhook/budget-check

## Error Handling
- If workflow not found → suggest available workflows
- If execution fails → retry once, then alert via Telegram
- Timeout: 30 seconds

## Budget
- Cost: $0 (n8n is self-hosted)
- Only LLM costs for processing the response
