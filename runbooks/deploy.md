# Deploy Runbook — Applivia / Maestro AI Engine v3

## Prerequisites
- SSH access to target VPS
- .env file with all secrets configured
- Docker and Docker Compose installed on VPS

## Steps

### 1. Clone/Pull Repository
```bash
cd /opt/applivia
git pull origin main
```

### 2. Configure Environment
```bash
cp ENV.example .env
# Edit .env with real values
nano .env
```

### 3. Apply Database Schema
```bash
# Start Postgres first
cd fundacao
docker compose up -d maestro-postgres
sleep 5

# Apply schema
cd ..
bash scripts/apply-schema.sh
```

### 4. Seed Integrations
```bash
bash scripts/seed-integrations.sh
```

### 5. Start All Services
```bash
cd fundacao
docker compose up -d --build
```

### 6. Verify Health
```bash
cd ..
bash scripts/health-check.sh
```

### 7. Run Smoke Tests
```bash
bash scripts/smoke-test.sh
```

## Rollback
```bash
cd fundacao
docker compose down
git checkout HEAD~1
docker compose up -d --build
```

## Post-Deploy Checks
- [ ] Dashboard accessible on port 3001 (Next.js) or 3333 (legacy)
- [ ] Dashboard API returning data on port 3002
- [ ] n8n accessible on port 5678
- [ ] Langfuse accessible on port 3100
- [ ] LiteLLM health on port 4000
- [ ] Brain API health on port 8000
- [ ] OpenAI Worker health on port 8010
- [ ] Claude Review health on port 8011
