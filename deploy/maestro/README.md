# Maestro Command Center — Singularity V6

## Overview
Maestro is the visual command center for controlling the AI agent factory.
It runs 10 playbooks in a continuous loop (the "Billionaire Loop") for 24/7 autonomous operation.

## Setup
1. Download Maestro from [runmaestro.ai](https://runmaestro.ai) (FREE, open-source)
2. Connect to your VPS via SSH or Cloudflare tunnel
3. Load playbooks from `playbooks/` directory

## Playbook Cycle (Billionaire Loop)
| # | Playbook | Est. Time | Crew Used |
|---|----------|-----------|-----------|
| 0 | Morning Scan | 15 min | market_research |
| 1 | Lead Generation | 20 min | data_enrichment |
| 2 | Outreach Engine | 15 min | outreach |
| 3 | Content Creation | 25 min | content |
| 4 | Social Posting | 10 min | social_media |
| 5 | Competitor Watch | 15 min | market_research |
| 6 | Revenue Check | 10 min | finance |
| 7 | Client Health | 15 min | support |
| 8 | Budget Audit | 10 min | finance |
| 9 | CEO Briefing | 15 min | coceo |

**Total cycle: ~2.5 hours = ~10 cycles per day**

## Access Methods
- **Desktop**: Maestro app with Auto Run + Loop Mode
- **Phone**: Maestro Remote Control via QR code + Cloudflare tunnel
- **Web**: Direct access to dashboards (dash.{DOMAIN}, n8n.{DOMAIN})
- **Telegram**: Bot commands for quick actions
- **CLI**: `maestro-cli playbook billionaire-loop --json` for cron jobs

## Cron Backup
If Maestro is not running, cron jobs ensure the loop continues:
```bash
0 */4 * * * /usr/local/bin/maestro-cli playbook billionaire-loop --json
0 8 * * * curl -s http://localhost:5678/webhook/ceo-briefing
0 * * * * curl -s http://localhost:5678/webhook/health-check
*/5 * * * * curl -s http://localhost:8001/budget/check
0 3 * * * /opt/agents/backups/backup.sh
```
