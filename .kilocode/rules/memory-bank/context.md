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
- [x] Car Deal Hunter dashboard for below-market vehicle sourcing with WhatsApp/e-mail alert blueprint

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/dashboard/page.tsx` | Dashboard (agents, services & Car Deal Hunter) | ✅ Ready |
| `src/app/api/car-deal-alerts/route.ts` | Car deal alert blueprint API | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `fundacao/brain/` | FastAPI backend | ✅ Ready |
| `fundacao/crewai/` | Multi-agent orchestration | ✅ Ready |
| `fundacao/dashboard/` | Static HTML dashboard | ✅ Ready |
| `fundacao/docker-compose.yml` | Full stack services | ✅ Ready |
| `README.md` | Project documentation | ✅ Ready |
| `.env.example` | Environment variables template, including domain/e-mail/WhatsApp alert config | ✅ Ready |
| `fundacao/n8n-workflows/car-deal-alerts.json` | n8n workflow blueprint for car deal alerts | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The app now includes a Car Deal Hunter operating view for sourcing vehicles 20-40% below market, scoring deals, and routing high-score opportunities to WhatsApp and e-mail automation.

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
| 2026-04-29 | Added Car Deal Hunter dashboard, alert blueprint API, n8n workflow, and alert/domain environment variables |
