#!/usr/bin/env bash
# Daily backup — PostgreSQL + Redis + Qdrant + configs
set -euo pipefail

BACKUP_DIR="/opt/agents/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${DATE}"
RETAIN_DAYS=7

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] BACKUP: $*"; }

log "=== Starting backup ==="
mkdir -p "$BACKUP_PATH"

# PostgreSQL dump
log "Backing up PostgreSQL..."
docker exec postgres pg_dumpall -U "${POSTGRES_USER:-singularity}" | gzip > "${BACKUP_PATH}/postgres.sql.gz"
log "PostgreSQL backup complete."

# Redis dump
log "Backing up Redis..."
docker exec redis redis-cli -a "${REDIS_PASSWORD:-}" BGSAVE >/dev/null 2>&1 || true
sleep 2
docker cp redis:/data/dump.rdb "${BACKUP_PATH}/redis.rdb" 2>/dev/null || log "WARNING: Redis dump not found"
log "Redis backup complete."

# Qdrant snapshot
log "Backing up Qdrant..."
curl -sf -X POST "http://localhost:6333/snapshots" -o "${BACKUP_PATH}/qdrant_snapshot.json" 2>/dev/null || log "WARNING: Qdrant snapshot failed"
log "Qdrant backup complete."

# Config files
log "Backing up configs..."
cp -r "$(dirname "$0")/../.env" "${BACKUP_PATH}/env.backup" 2>/dev/null || true
cp -r "$(dirname "$0")/../docker-compose.yml" "${BACKUP_PATH}/docker-compose.yml" 2>/dev/null || true
cp -r "$(dirname "$0")/../caddy/Caddyfile" "${BACKUP_PATH}/Caddyfile" 2>/dev/null || true

# Compress
log "Compressing backup..."
tar -czf "${BACKUP_DIR}/backup_${DATE}.tar.gz" -C "$BACKUP_DIR" "$DATE"
rm -rf "$BACKUP_PATH"

# Cleanup old backups
log "Cleaning up backups older than ${RETAIN_DAYS} days..."
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +${RETAIN_DAYS} -delete 2>/dev/null || true

# Size report
BACKUP_SIZE=$(du -sh "${BACKUP_DIR}/backup_${DATE}.tar.gz" | cut -f1)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

log "=== Backup complete ==="
log "File: backup_${DATE}.tar.gz (${BACKUP_SIZE})"
log "Total backup storage: ${TOTAL_SIZE}"
