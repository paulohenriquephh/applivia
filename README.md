# Applivia — Maestro AI Engine v3

AI-powered automation platform with intelligent agents, built for marketing, sales, and business operations.

## Architecture

```
applivia/
├── src/                    # Next.js frontend (dashboard UI)
│   └── app/
│       ├── page.tsx        # Home page
│       └── dashboard/      # Agent monitoring dashboard
├── fundacao/               # Backend infrastructure
│   ├── brain/              # FastAPI backend (WebSocket, voice, chat)
│   ├── crewai/             # CrewAI multi-agent orchestration
│   ├── dashboard/          # Static HTML dashboard (legacy)
│   ├── n8n-workflows/      # n8n automation workflows
│   ├── scripts/            # Deploy and watchdog scripts
│   └── docker-compose.yml  # Full stack Docker Compose
└── package.json            # Node.js dependencies (Next.js frontend)
```

## Services

| Service             | Port  | Description                        |
|---------------------|-------|------------------------------------|
| maestro-brain       | 8000  | FastAPI backend (AI, WebSocket)    |
| maestro-crewai      | 8002  | Multi-agent orchestration          |
| maestro-dashboard   | 3333  | Static web dashboard               |
| maestro-litellm     | 4000  | LLM proxy (Anthropic, OpenRouter)  |
| maestro-n8n         | 5678  | Automation workflows               |
| maestro-evolution   | 8080  | WhatsApp API                       |
| maestro-qdrant      | 6333  | Vector database                    |
| maestro-postgres    | 5432  | PostgreSQL database                |
| maestro-redis       | 6379  | Redis cache                        |
| maestro-grafana     | 3000  | Monitoring dashboards              |
| maestro-prometheus  | 9090  | Metrics collection                 |

## AI Agents

- **Orchestrator** — General operations coordinator
- **Import** — China/Italy supplier management
- **Advertising** — Meta, Google, TikTok Ads
- **Luxury Watch** — Technical analysis for luxury watches
- **WhatsApp SDR** — Sales via WhatsApp
- **TikTok Growth** — Organic growth automation
- **Knowledge Sync** — Data synchronization

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for the Next.js frontend)
- Bun (recommended package manager)

### 1. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your API keys and credentials
```

### 2. Start backend services

```bash
cd fundacao
docker compose up -d
```

### 3. Start the Next.js frontend

```bash
bun install
bun dev
```

The frontend will be available at [http://localhost:3001](http://localhost:3001).

> **Note:** Grafana also defaults to port 3000 in the Docker stack. Run the Next.js dev server on a different port to avoid conflicts: `npm run dev -- --port 3001` (or configure `PORT=3001` in your environment).

## Development

### Frontend (Next.js)

```bash
bun dev          # Start development server
bun run build    # Build for production
bun run lint     # Run ESLint
bun run typecheck # Run TypeScript type checking
```

### Backend (Python)

Each service has its own `requirements.txt`. Install dependencies:

```bash
pip install -r fundacao/brain/requirements.txt
pip install -r fundacao/crewai/requirements.txt
```

## Deployment

Use the provided deploy script:

```bash
bash fundacao/scripts/deploy.sh
```
