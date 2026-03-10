# Skill: Maestro Sync

## Description
Synchronize task status and reports with Maestro command center.

## Trigger Words
- "sync maestro", "update maestro", "maestro status"
- "playbook status", "loop status"

## How It Works
1. Gather current system state from all services
2. Format status updates for Maestro consumption
3. Update shared state in Redis
4. Provide playbook execution status

## Sync Data
```json
{
  "timestamp": "ISO-8601",
  "system_status": "healthy|degraded|critical",
  "services": { "service_name": "status" },
  "active_tasks": 0,
  "completed_today": 0,
  "budget": {
    "daily_spend": 0.00,
    "monthly_spend": 0.00,
    "monthly_remaining": 83.33
  },
  "playbook_status": {
    "current_playbook": "00_morning_scan",
    "progress": "3/5 tasks",
    "loop_cycle": 1
  },
  "alerts": []
}
```

## Maestro Integration Points
- **Auto Run**: Reports task completion to Maestro
- **Loop Mode**: Tracks which playbook is currently executing
- **CLI**: Provides JSON output for cron-triggered runs
- **Session Analytics**: Cost tracking per agent/session
- **Remote Control**: Status available via web endpoint

## Redis Keys
- `maestro:status` — Current system status JSON
- `maestro:playbook:current` — Active playbook name
- `maestro:playbook:progress` — Task completion tracking
- `maestro:loop:cycle` — Current loop iteration number
- `maestro:last_sync` — Last sync timestamp

## Sync Schedule
- Every 5 minutes (automatic)
- After each playbook task completion
- On-demand via user request
