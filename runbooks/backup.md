# Backup Runbook — Applivia

## Database Backup
```bash
# Full backup
docker exec maestro-postgres pg_dump -U maestro maestroapp > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed
docker exec maestro-postgres pg_dump -U maestro maestroapp | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

## Restore
```bash
# From backup file
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i maestro-postgres psql -U maestro maestroapp

# From compressed
gunzip -c backup_YYYYMMDD_HHMMSS.sql.gz | docker exec -i maestro-postgres psql -U maestro maestroapp
```

## Docker Volumes
```bash
# List volumes
docker volume ls | grep maestro

# Backup Redis
docker exec maestro-redis redis-cli BGSAVE

# Backup Qdrant
# Qdrant snapshots via API
curl -X POST http://localhost:6333/collections/knowledge/snapshots
```

## Automated Backup (crontab)
```bash
# Add to crontab:
# Daily DB backup at 3am
0 3 * * * docker exec maestro-postgres pg_dump -U maestro maestroapp | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Keep last 30 days
0 4 * * * find /backups -name "db_*.sql.gz" -mtime +30 -delete
```
