import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/runs", label: "Runs" },
  { href: "/dashboard/costs", label: "Costs" },
  { href: "/dashboard/integrations", label: "Integrations" },
  { href: "/dashboard/approvals", label: "Approvals" },
  { href: "/dashboard/incidents", label: "Incidents" },
  { href: "/dashboard/audit", label: "Audit Log" },
  { href: "/dashboard/errors", label: "Errors" },
  { href: "/dashboard/knowledge", label: "Knowledge" },
  { href: "/dashboard/security", label: "Security" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <Link href="/" className="text-lg font-bold tracking-tight">Applivia</Link>
          <p className="text-xs text-neutral-500 mt-0.5">Maestro AI Engine v3</p>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-neutral-800 text-xs text-neutral-600">
          System v3.0
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
