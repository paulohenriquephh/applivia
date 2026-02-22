#!/bin/bash
# MAESTRO AI ENGINE v3 - Deploy Script

set -e

echo "=========================================="
echo "MAESTRO AI ENGINE v3 - DEPLOY"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUNDACAO_DIR="$(dirname "$SCRIPT_DIR")"
cd "$FUNDACAO_DIR"

echo -e "${YELLOW}1. Verificando dependências...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker não encontrado. Instale o Docker primeiro.${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose não encontrado.${NC}"
    exit 1
fi

DOCKER_COMPOSE="docker compose"
if ! command -v docker compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${GREEN}✓ Docker e Docker Compose OK${NC}"

# Check .env file
if [ ! -f "/root/maestro/.env" ]; then
    echo -e "${YELLOW}AVISO: Arquivo /root/maestro/.env não encontrado${NC}"
    echo "Criando arquivo de exemplo..."
    cat > .env.example << 'EOF'
# MAESTRO AI Engine Environment Variables
# IMPORTANT: Replace these with your actual values before running
POSTGRES_PASSWORD=your-postgres-password
LITELLM_MASTER_KEY=your-litellm-master-key
N8N_PASSWORD=your-n8n-password
GRAFANA_PASSWORD=your-grafana-password
PORTAINER_PASSWORD=your-porter-password
EVOLUTION_API_KEY=your-evolution-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
GOOGLE_API_KEY=your-google-api-key
BRAVE_API_KEY=your-brave-api-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
PERPLEXITY_API_KEY=your-perplexity-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
VULTR_API_KEY=your-vultr-api-key
EOF
fi

echo -e "${YELLOW}2. Criando diretórios necessários...${NC}"
mkdir -p brain/uploads
mkdir -p litellm-config
mkdir -p prometheus
mkdir -p n8n-workflows

echo -e "${YELLOW}3. Criando rede Docker...${NC}"
docker network create maestro-net 2>/dev/null || echo "Rede já existe"

echo -e "${YELLOW}4. Build das imagens...${NC}"

# Build Brain
echo "Buildando Brain..."
docker build -t maestro-brain:latest ./brain

# Build CrewAI
echo "Buildando CrewAI..."
docker build -t maestro-crewai:latest ./crewai

# Build Dashboard
echo "Buildando Dashboard..."
docker build -t maestro-dashboard:latest ./dashboard

echo -e "${GREEN}✓ Imagens buildadas com sucesso${NC}"

echo -e "${YELLOW}5. Iniciando serviços...${NC}"
$DOCKER_COMPOSE up -d

echo -e "${YELLOW}6. Verificando status...${NC}"
sleep 10

# Test endpoints
echo -e "${YELLOW}7. Testando endpoints...${NC}"

test_endpoint() {
    local name=$1
    local url=$2
    local max_attempts=5
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $name online${NC}"
            return 0
        fi
        echo "Aguardando $name... ($attempt/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}✗ $name offline${NC}"
    return 1
}

# Test endpoints
test_endpoint "Brain API" "http://localhost:8000/health"
test_endpoint "CrewAI" "http://localhost:8002/health"
test_endpoint "Dashboard" "http://localhost:3333"
test_endpoint "LiteLLM" "http://localhost:4000/health"
test_endpoint "n8n" "http://localhost:5678"
test_endpoint "Grafana" "http://localhost:3000"

echo ""
echo "=========================================="
echo -e "${GREEN}DEPLOY CONCLUÍDO!${NC}"
echo "=========================================="
echo ""
echo "Acesse o Dashboard: http://localhost:3333"
echo "Brain API: http://localhost:8000"
echo "CrewAI API: http://localhost:8002"
echo "LiteLLM: http://localhost:4000"
echo "n8n: http://localhost:5678"
echo "Grafana: http://localhost:3000"
echo ""
