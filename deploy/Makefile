.PHONY: up down restart logs ps build clean backup restore health budget workflows import-workflows

COMPOSE=docker compose

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down && $(COMPOSE) up -d

build:
	$(COMPOSE) build --no-cache

logs:
	$(COMPOSE) logs -f --tail=100

ps:
	$(COMPOSE) ps

clean:
	$(COMPOSE) down -v --remove-orphans

backup:
	bash backups/backup.sh

restore:
	bash backups/restore.sh

health:
	@echo "=== Service Health ==="
	@curl -sf http://localhost:8001/health && echo " CrewAI: OK" || echo " CrewAI: DOWN"
	@curl -sf http://localhost:8002/health && echo " CO-CEO: OK" || echo " CO-CEO: DOWN"
	@curl -sf http://localhost:5678/healthz && echo " n8n: OK" || echo " n8n: DOWN"
	@curl -sf http://localhost:3000/api/health && echo " Grafana: OK" || echo " Grafana: DOWN"
	@curl -sf http://localhost:9090/-/healthy && echo " Prometheus: OK" || echo " Prometheus: DOWN"

budget:
	@curl -sf http://localhost:8001/budget/check | python3 -m json.tool

workflows:
	cd scripts && python3 generate_workflows.py

import-workflows:
	bash scripts/generate_and_import.sh

crewai-logs:
	$(COMPOSE) logs -f crewai-api

coceo-logs:
	$(COMPOSE) logs -f co-ceo-agent

n8n-logs:
	$(COMPOSE) logs -f n8n-editor
