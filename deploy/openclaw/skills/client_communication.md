# Skill: Client Communication Manager

## Description
Manage client messaging across channels with confirmation safeguards.

## Trigger Words
- "message client", "email client", "contact client"
- "client update", "send report to client"

## How It Works
1. Draft the communication based on user's intent
2. Show draft to user for review
3. REQUIRE Telegram confirmation before sending
4. Send via appropriate channel (email, WhatsApp, etc.)
5. Log the communication

## Channels
- Email (via Resend API)
- WhatsApp Business (via API)
- Telegram (direct message)

## Safety Rules
- NEVER send client communications without confirmation
- Always show draft before sending
- Rate limit: max 10 client messages per hour
- Maintain professional tone regardless of context
- Include unsubscribe/opt-out options in marketing emails

## Workflow
```
1. User requests client communication
2. AI drafts message (using content crew if complex)
3. Draft shown in chat for review
4. User approves → Telegram confirmation sent
5. Admin confirms via Telegram → message sent
6. Delivery status tracked and logged
```

## Templates Available
- Project update
- Invoice reminder
- Meeting follow-up
- Service report
- Onboarding welcome
- Renewal reminder
- Feedback request
