# Skill: CO-CEO Escalation

## Description
Escalate complex questions or decisions to the CO-CEO super-agent with its 10 premium models.

## Trigger Words
- "escalate", "need CEO", "complex decision"
- "strategic question", "important decision"
- Automatic: confidence < 60%

## How It Works
1. Detect that the query requires premium model capabilities
2. Format the request with full context
3. POST to CO-CEO agent endpoint
4. Return the premium analysis

## Endpoints
```
POST http://co-ceo-agent:8002/ask      — General questions
POST http://co-ceo-agent:8002/decide   — Business decisions
POST http://co-ceo-agent:8002/analyze  — Deep analysis
```

## Escalation Criteria
- Confidence score < 60% on current response
- User explicitly requests escalation
- Strategic/financial decisions over $1000 impact
- Multi-model cross-reference needed
- Real-time market data required
- Code generation or technical architecture
- Image generation needed

## Context Passed to CO-CEO
- Original user query
- Conversation history (last 5 messages)
- Any data gathered so far
- Reason for escalation
- Urgency level

## Budget
- CO-CEO uses premium models ($0.20 - $25/M tokens)
- Warn user before expensive operations
- Track cost in conversation budget
