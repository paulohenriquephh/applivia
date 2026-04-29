# Active Context: Applivia — Maestro AI Engine v3

## Current State

**Project Status**: ✅ Active development — Locadora Miami 2026 module added

Full-stack AI automation platform with Next.js frontend and Python/Docker backend services.
New module: Miami Car Rental business simulator with Monte Carlo engine, forensic audit, and operational planning.

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
- [x] **Locadora Miami 2026** — Monte Carlo simulator (10K runs, Box-Muller, seasonal)
- [x] **Locadora Miami 2026** — Forensic audit (10 weighted criteria, contradictions, breakpoints)
- [x] **Locadora Miami 2026** — Operations plan (7-day checklist, 5 guardrails, scaling roadmap)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page (links to locadora + dashboard) | ✅ Ready |
| `src/app/dashboard/page.tsx` | Dashboard (agents & services) | ✅ Ready |
| `src/app/locadora/page.tsx` | Locadora Miami hub page | ✅ Ready |
| `src/app/locadora/simulador/page.tsx` | Monte Carlo simulator with charts | ✅ Ready |
| `src/app/locadora/auditoria/page.tsx` | Forensic audit page | ✅ Ready |
| `src/app/locadora/operacoes/page.tsx` | Operations plan + checklist | ✅ Ready |
| `src/lib/monte-carlo.ts` | Monte Carlo simulation engine | ✅ Ready |
| `src/lib/forensic-audit.ts` | Forensic audit criteria engine | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `fundacao/brain/` | FastAPI backend | ✅ Ready |
| `fundacao/crewai/` | Multi-agent orchestration | ✅ Ready |
| `fundacao/dashboard/` | Static HTML dashboard | ✅ Ready |
| `fundacao/docker-compose.yml` | Full stack services | ✅ Ready |
| `README.md` | Project documentation | ✅ Ready |
| `.env.example` | Environment variables template | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

Locadora Miami 2026 module is complete and functional. Next steps:

1. Real insurance quotes to validate simulation parameters
2. Live data integration from actual operations
3. Additional business modules as needed

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
