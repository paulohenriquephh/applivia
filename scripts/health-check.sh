#!/bin/bash
# Applivia — Health Check Script
# Checks all services and reports status

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

HOST="${HOST:-localhost}"
HEALTHY=0
UNHEALTHY=0
TOTAL=0

check_service() {
    local name=$1
    local url=$2
    TOTAL=$((TOTAL + 1))

    if response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null); then
        if [ "$response" = "200" ]; then
            echo -e "${GREEN}[OK]${NC} $name ($url) -> $response"
            HEALTHY=$((HEALTHY + 1))
        else
            echo -e "${YELLOW}[WARN]${NC} $name ($url) -> HTTP $response"
            UNHEALTHY=$((UNHEALTHY + 1))
        fi
    else
        echo -e "${RED}[FAIL]${NC} $name ($url) -> unreachable"
        UNHEALTHY=$((UNHEALTHY + 1))
    fi
}

echo "=== Applivia Health Check ==="
echo "Host: $HOST"
echo "Time: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

check_service "Brain API" "http://$HOST:8000/health"
check_service "CrewAI API" "http://$HOST:8002/health"
check_service "LiteLLM" "http://$HOST:4000/health"
check_service "n8n" "http://$HOST:5678/healthz"
check_service "Dashboard API" "http://$HOST:3002/health"
check_service "OpenAI Worker" "http://$HOST:8010/health"
check_service "Claude Review" "http://$HOST:8011/health"
check_service "Langfuse" "http://$HOST:3100/api/public/health"
check_service "Grafana" "http://$HOST:3000/api/health"
check_service "Qdrant" "http://$HOST:6333/healthz"

echo ""
echo "=== Summary ==="
echo -e "Healthy: ${GREEN}$HEALTHY${NC} / $TOTAL"
echo -e "Unhealthy: ${RED}$UNHEALTHY${NC} / $TOTAL"

# Check Postgres
echo ""
echo "=== PostgreSQL ==="
if pg_isready -h "$HOST" -p 5432 -U maestro 2>/dev/null; then
    echo -e "${GREEN}[OK]${NC} PostgreSQL is accepting connections"
else
    echo -e "${YELLOW}[INFO]${NC} pg_isready not available or Postgres not reachable on $HOST:5432"
fi

# Check Redis
echo ""
echo "=== Redis ==="
if redis-cli -h "$HOST" -p 6379 ping 2>/dev/null | grep -q PONG; then
    echo -e "${GREEN}[OK]${NC} Redis PONG"
else
    echo -e "${YELLOW}[INFO]${NC} redis-cli not available or Redis not reachable on $HOST:6379"
fi

echo ""
echo "Health check completed at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [ "$UNHEALTHY" -gt 0 ]; then
    exit 1
fi
exit 0
