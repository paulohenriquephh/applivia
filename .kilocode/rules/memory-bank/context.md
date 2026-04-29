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
- [x] Locadora Miami 2026 — Monte Carlo simulation engine (3 scenarios, 1000+ runs)
- [x] Forensic audit engine with 10 weighted criteria, contradictions, breakpoints
- [x] Interactive dashboard with 8 chart types (Recharts)
- [x] 7-day launch checklist with progress tracking
- [x] Rental contract template generator (FL Statute 559)
- [x] Partnership script generator (5 channels)
- [x] 5 nuclear guardrails with measurable triggers

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/dashboard/page.tsx` | Dashboard (agents & services) | ✅ Ready |
| `src/app/locadora/page.tsx` | Locadora Miami 2026 dashboard | ✅ Ready |
| `src/app/locadora/components/Charts.tsx` | 8 chart components (Recharts) | ✅ Ready |
| `src/lib/simulation-engine.ts` | Monte Carlo engine + 3 scenarios | ✅ Ready |
| `src/lib/forensic-audit.ts` | 10-criterion weighted audit | ✅ Ready |
| `src/lib/generators.ts` | Checklists, contracts, partnerships, guardrails | ✅ Ready |
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

Locadora Miami 2026 module is live with full simulation, audit, and operational tools.

Next steps:
1. Connect to real insurance quotes and pricing data
2. Add user authentication for saving checklist state
3. Expand Monte Carlo with custom parameter editor in UI

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
| 2026-04-29 | Added Locadora Miami 2026 module: Monte Carlo sim, forensic audit, dashboard, operational tools |
