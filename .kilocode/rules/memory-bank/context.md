# Active Context: Applivia — Maestro AI Engine v3

## Current State

**Project Status**: ✅ Organized and documented

Full-stack AI automation platform with Next.js frontend and Python/Docker backend services.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Maestro AI Engine backend (brain, crewai, dashboard, n8n, etc.)
- [x] README.md with project overview and setup instructions
- [x] .env.example with all required environment variables
- [x] Next.js `/dashboard` route listing agents and services

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/dashboard/page.tsx` | Dashboard (agents & services) | ✅ Ready |
| `src/app/locadora/page.tsx` | Miami Car Rental FSM Nuclear | ✅ Ready |
| `src/app/api/monte-carlo/route.ts` | Monte Carlo 10K runs API | ✅ Ready |
| `src/app/api/contrato/route.ts` | Contract generator API | ✅ Ready |
| `src/app/api/auditoria/route.ts` | Forensic audit API | ✅ Ready |
| `src/components/locadora/MonteCarloSimulator.tsx` | Monte Carlo UI + charts | ✅ Ready |
| `src/components/locadora/AuditoriaForense.tsx` | 10-criteria weighted audit | ✅ Ready |
| `src/components/locadora/ContratoGenerator.tsx` | Contract generator | ✅ Ready |
| `src/components/locadora/MarketingScripts.tsx` | Marketing scripts + checklist | ✅ Ready |
| `src/components/locadora/KPIDashboard.tsx` | Operational KPI dashboard | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles + input-field class | ✅ Ready |
| `fundacao/brain/` | FastAPI backend | ✅ Ready |
| `fundacao/crewai/` | Multi-agent orchestration | ✅ Ready |
| `fundacao/dashboard/` | Static HTML dashboard | ✅ Ready |
| `fundacao/docker-compose.yml` | Full stack services | ✅ Ready |
| `README.md` | Project documentation | ✅ Ready |
| `.env.example` | Environment variables template | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-04-29 | Miami Car Rental Nuclear: Monte Carlo 10K runs + Auditoria Forense + Contrato + Marketing + KPI Dashboard adicionados em /locadora |
