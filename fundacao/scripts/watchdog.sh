#!/bin/bash
# MAESTRO AI ENGINE v3 - Watchdog Script
# Monitora containers e reinicia se necessário

set -e

# Configuration
CHECK_INTERVAL=60  # seconds
SLACK_WEBHOOK=""
EMAIL_ALERT=""

# Services to monitor
SERVICES=(
    "maestro-brain:8000"
    "maestro-crewai:8002"
    "maestro-dashboard:3333"
    "maestro-api:8001"
    "maestro-litellm:4000"
    "maestro-n8n:5678"
    "maestro-evolution:8080"
    "maestro-qdrant:6333"
    "maestro-postgres:5432"
    "maestro-redis:6379"
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARN:${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

check_container() {
    local container=$1
    local port=$2
    
    # Check if container is running
    if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        error "Container $container não está rodando!"
        return 1
    fi
    
    # Check container health
    local status=$(docker inspect --format='{{.State.Status}}' $container 2>/dev/null)
    if [ "$status" != "running" ]; then
        error "Container $container não está saudável: $status"
        return 1
    fi
    
    # Check port
    if ! docker exec $container nc -z localhost $port 2>/dev/null; then
        warn "Porta $port não está respondendo em $container"
    fi
    
    return 0
}

restart_container() {
    local container=$1
    
    warn "Reiniciando container $container..."
    docker restart $container
    
    # Wait for container to start
    sleep 10
    
    # Verify restart
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        log "Container $container reiniciado com sucesso"
        return 0
    else
        error "Falha ao reiniciar $container"
        return 1
    fi
}

check_disk_space() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -gt 90 ]; then
        error "Uso de disco em $usage% - acima de 90%!"
        return 1
    elif [ "$usage" -gt 80 ]; then
        warn "Uso de disco em $usage% - acima de 80%"
    fi
    
    return 0
}

check_memory() {
    local available=$(free -m | awk 'NR==2 {print $7}')
    
    if [ "$available" -lt 512 ]; then
        warn "Memória disponível baixa: ${available}MB"
    fi
}

send_alert() {
    local message=$1
    
    # Log
    error "$message"
    
    # Could add Slack/Email alerts here
    # if [ -n "$SLACK_WEBHOOK" ]; then
    #     curl -X POST -H 'Content-type: application/json' \
    #         --data "{\"text\":\"$message\"}" \
    #         "$SLACK_WEBHOOK" 2>/dev/null || true
    # fi
}

# Main loop
log "Iniciando Watchdog do MAESTRO AI Engine..."

while true; do
    log "Verificando containers..."
    
    local failed=0
    
    for service in "${SERVICES[@]}"; do
        IFS=':' read -r container port <<< "$service"
        
        if ! check_container "$container" "$port"; then
            ((failed++))
            
            # Try to restart
            if restart_container "$container"; then
                log "Recuperação automática bem-sucedida para $container"
            else
                send_alert "FALHA CRÍTICA: $container não está respondendo após reinício"
            fi
        fi
    done
    
    # Check resources
    check_disk_space
    check_memory
    
    if [ $failed -gt 0 ]; then
        warn "$failed serviço(s) apresentaram problemas"
    else
        log "Todos os serviços OK"
    fi
    
    sleep $CHECK_INTERVAL
done
