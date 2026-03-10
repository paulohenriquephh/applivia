#!/usr/bin/env bash
# One-command restore from backup
set -euo pipefail

BACKUP_DIR="/opt/agents/backups"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] RESTORE: $*"; }

if [ $# -eq 0 ]; then
    log "Usage: restore.sh <backup_file.tar.gz>"
    log ""
    log "Available backups:"
    ls -lh "${BACKUP_DIR}"/backup_*.tar.gz 2>/dev/null || log "  No backups found."
    exit 1
fi

BACKUP_FILE="$1"
if [ ! -f "$BACKUP_FILE" ]; then
    BACKUP_FILE="${BACKUP_DIR}/$1"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    log "ERROR: Backup file not found: $1"
    exit 1
fi

RESTORE_DIR=$(mktemp -d)
log "=== Starting restore from $(basename "$BACKUP_FILE") ==="

# Extract
log "Extracting backup..."
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"
BACKUP_CONTENT=$(ls "$RESTORE_DIR")
RESTORE_PATH="${RESTORE_DIR}/${BACKUP_CONTENT}"

# Stop services (except data layer)
log "Stopping application services..."
cd "$(dirname "$0")/.."
docker compose stop crewai-api co-ceo-agent crewai-scheduler n8n-editor n8n-worker-1 n8n-worker-2 n8n-webhooks 2>/dev/null || true

# Restore PostgreSQL
if [ -f "${RESTORE_PATH}/postgres.sql.gz" ]; then
    log "Restoring PostgreSQL..."
    gunzip -c "${RESTORE_PATH}/postgres.sql.gz" | docker exec -i postgres psql -U "${POSTGRES_USER:-singularity}" >/dev/null 2>&1
    log "PostgreSQL restored."
else
    log "WARNING: No PostgreSQL backup found, skipping."
fi

# Restore Redis
if [ -f "${RESTORE_PATH}/redis.rdb" ]; then
    log "Restoring Redis..."
    docker exec redis redis-cli -a "${REDIS_PASSWORD:-}" SHUTDOWN NOSAVE 2>/dev/null || true
    sleep 2
    docker cp "${RESTORE_PATH}/redis.rdb" redis:/data/dump.rdb
    docker compose restart redis
    log "Redis restored."
else
    log "WARNING: No Redis backup found, skipping."
fi

# Restore configs
if [ -f "${RESTORE_PATH}/env.backup" ]; then
    log "Config backup available at: ${RESTORE_PATH}/env.backup"
    log "Restore manually if needed: cp ${RESTORE_PATH}/env.backup .env"
fi

# Restart services
log "Restarting all services..."
docker compose up -d

# Cleanup
rm -rf "$RESTORE_DIR"

log "=== Restore complete ==="
log "Run 'make health' to verify all services are running."
