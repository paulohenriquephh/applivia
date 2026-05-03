# System Patterns: P2HM Imoveis landing

## Architecture Overview

```
src/
├── app/
│   ├── layout.tsx          # Metadata raiz + idioma pt-BR
│   ├── page.tsx            # Landing page P2HM Imoveis
│   ├── dashboard/page.tsx  # Dashboard secundario legado
│   ├── globals.css         # Import global do Tailwind
│   └── favicon.ico
└── (expand as needed)
    ├── components/         # Componentes reutilizaveis futuros
    ├── lib/                # Helpers/utilitarios futuros
    └── db/                 # Persistencia, se o produto evoluir
```

## Key Design Patterns

### 1. App Router Pattern

Usa Next.js App Router com duas rotas principais ativas:
```
src/app/
├── page.tsx              # Route: / (landing P2HM)
└── dashboard/page.tsx    # Route: /dashboard
```

### 2. Conteudo orientado por arrays

A landing principal usa arrays locais para renderizar secoes repetidas como validacoes, tiers, canais, stack, KPIs e budget. Isso reduz markup duplicado e facilita evoluir o conteudo sem introduzir estado cliente desnecessario.

### 3. Server Components por padrao

Toda a interface continua em Server Components. Nao ha necessidade de `"use client"` porque a experiencia atual e inteiramente estatica/informativa.
```tsx
// Server Component (default) - can fetch data, access DB
export default function Page() {
  return <div>Server rendered</div>;
}

// Client Component - for interactivity
"use client";
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 4. Layout Pattern

O `layout.tsx` centraliza metadata e idioma do documento. A pagina principal fica livre para focar apenas na narrativa visual da landing.
```tsx
// src/app/layout.tsx - Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// src/app/dashboard/layout.tsx - Nested layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Styling Conventions

### Tailwind CSS Usage
- Utility classes directly on elements
- Component composition for repeated patterns
- Responsive: `sm:`, `md:`, `lg:`, `xl:`

### Common Patterns
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox centering
<div className="flex items-center justify-center">
```

## File Naming Conventions

- Components: PascalCase (`Button.tsx`, `Header.tsx`)
- Utilities: camelCase (`utils.ts`, `helpers.ts`)
- Pages/Routes: lowercase (`page.tsx`, `layout.tsx`)
- Directories: kebab-case (`api-routes/`) or lowercase (`components/`)

## State Management

For simple needs:
- `useState` for local component state
- `useContext` for shared state
- Server Components for data fetching

For complex needs (add when necessary):
- Zustand for client state
- React Query for server state
