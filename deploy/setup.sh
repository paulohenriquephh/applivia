#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# CODEX SINGULARITY V6 — One-Command Setup
# Usage: bash setup.sh
# Deploys 17 containers on a fresh Ubuntu 24.04 VPS
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== CODEX SINGULARITY V6 — Setup Starting ==="

# --- Step 1: System packages ---
log "Step 1/8: Installing system dependencies..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq \
    ca-certificates curl gnupg lsb-release \
    python3 python3-pip python3-venv \
    jq wget unzip git htop \
    > /dev/null 2>&1
log "System packages installed."

# --- Step 2: Docker ---
log "Step 2/8: Installing Docker..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log "Docker installed."
else
    log "Docker already installed."
fi

if ! docker compose version &>/dev/null; then
    apt-get install -y -qq docker-compose-plugin > /dev/null 2>&1
fi

# --- Step 3: Create .env ---
log "Step 3/8: Configuring environment..."
if [ ! -f .env ]; then
    cp .env.template .env
    # Generate random passwords for fresh install
    RAND_PG=$(openssl rand -hex 16)
    RAND_REDIS=$(openssl rand -hex 16)
    RAND_N8N_PASS=$(openssl rand -hex 16)
    RAND_N8N_ENC=$(openssl rand -hex 32)
    RAND_GRAFANA=$(openssl rand -hex 16)

    sed -i "s/CHANGE_ME_STRONG_PASSWORD_1/${RAND_PG}/" .env
    sed -i "s/CHANGE_ME_STRONG_PASSWORD_2/${RAND_REDIS}/" .env
    sed -i "s/CHANGE_ME_STRONG_PASSWORD_3/${RAND_N8N_PASS}/" .env
    sed -i "s/CHANGE_ME_RANDOM_STRING_32/${RAND_N8N_ENC}/" .env
    sed -i "s/CHANGE_ME_STRONG_PASSWORD_4/${RAND_GRAFANA}/" .env

    log ".env created with random passwords."
    log "IMPORTANT: Edit .env to add your API keys and domain!"
else
    log ".env already exists, skipping."
fi

# --- Step 4: Create directories ---
log "Step 4/8: Creating data directories..."
mkdir -p /opt/agents/backups
mkdir -p /var/log/singularity

# --- Step 5: Generate workflows ---
log "Step 5/8: Generating n8n workflows..."
if [ -f scripts/generate_workflows.py ]; then
    python3 scripts/generate_workflows.py
    log "Workflows generated."
else
    log "WARNING: generate_workflows.py not found, skipping workflow generation."
fi

# --- Step 6: Build and start containers ---
log "Step 6/8: Building and starting containers..."
docker compose build --parallel
docker compose up -d

# --- Step 7: Wait for services ---
log "Step 7/8: Waiting for services to be healthy..."
SERVICES=("postgres" "redis" "qdrant" "n8n-editor" "crewai-api" "co-ceo-agent")
MAX_WAIT=120
for svc in "${SERVICES[@]}"; do
    elapsed=0
    while [ $elapsed -lt $MAX_WAIT ]; do
        STATUS=$(docker compose ps "$svc" --format json 2>/dev/null | jq -r '.Health // .State' 2>/dev/null || echo "waiting")
        if [ "$STATUS" = "healthy" ] || [ "$STATUS" = "running" ]; then
            log "  $svc: ready"
            break
        fi
        sleep 5
        elapsed=$((elapsed + 5))
    done
    if [ $elapsed -ge $MAX_WAIT ]; then
        log "  WARNING: $svc did not become healthy within ${MAX_WAIT}s"
    fi
done

# --- Step 8: Install cron jobs ---
log "Step 8/8: Installing cron jobs..."
CRON_FILE="/tmp/singularity_cron"
cat > "$CRON_FILE" << 'CRON'
# Singularity V6 — Autonomous cron jobs
# Billionaire loop every 4 hours
0 */4 * * * /usr/local/bin/maestro-cli playbook billionaire-loop --json >> /var/log/maestro-loop.jsonl 2>&1
# CEO briefing every morning 8am UTC
0 8 * * * curl -sf http://localhost:5678/webhook/ceo-briefing >> /var/log/singularity/ceo-briefing.log 2>&1
# Health check every hour
0 * * * * curl -sf http://localhost:5678/webhook/health-check >> /var/log/singularity/health.log 2>&1
# Budget tracker every 5 minutes
*/5 * * * * curl -sf http://localhost:8001/budget/check >> /var/log/singularity/budget.log 2>&1
# Daily backup at 3am UTC
0 3 * * * /opt/agents/backups/backup.sh >> /var/log/singularity/backup.log 2>&1
CRON
crontab "$CRON_FILE"
rm "$CRON_FILE"
log "Cron jobs installed."

# --- Done ---
log "=== CODEX SINGULARITY V6 — Setup Complete ==="
log ""
log "Services running:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
log ""
log "Next steps:"
log "  1. Edit .env with your API keys and domain"
log "  2. Run: docker compose restart"
log "  3. Import workflows: make import-workflows"
log "  4. Access dashboards at https://dash.\${DOMAIN}"
log ""
log "Quick commands:"
log "  make health    — Check all services"
log "  make logs      — Tail all logs"
log "  make budget    — Check budget status"
log "  make backup    — Run backup now"
