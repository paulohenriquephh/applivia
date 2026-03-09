import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function getOverview() {
  try {
    const res = await fetch(`${API_BASE}/api/overview`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getSystemHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/system-health`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <p className="text-xs text-neutral-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
    </div>
  );
}

export default async function DashboardOverview() {
  const [overview, health] = await Promise.all([getOverview(), getSystemHealth()]);

  if (!overview) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Overview</h1>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
          <p className="text-neutral-400">Dashboard API unavailable</p>
          <p className="text-xs text-neutral-600 mt-2">
            Ensure the API is running at {API_BASE}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Runs (24h)" value={overview.runs_24h} sub={`${overview.success_rate_24h}% success`} />
        <StatCard label="Runs (7d)" value={overview.runs_7d} />
        <StatCard label="Errors (24h)" value={overview.errors_24h} />
        <StatCard label="Avg Latency" value={`${overview.avg_latency_ms}ms`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Cost (24h)" value={`$${overview.cost_24h_usd.toFixed(2)}`} />
        <StatCard label="Cost (7d)" value={`$${overview.cost_7d_usd.toFixed(2)}`} />
        <StatCard label="Pending Approvals" value={overview.pending_approvals} />
        <StatCard label="Open Incidents" value={overview.open_incidents} />
      </div>

      {/* Integrations Health */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Integrations</h2>
          <span className="text-xs text-neutral-500">
            {overview.integrations_healthy}/{overview.integrations_total} healthy
          </span>
        </div>
        <Link href="/dashboard/integrations" className="text-sm text-blue-400 hover:text-blue-300">
          View all integrations
        </Link>
      </div>

      {/* System Health */}
      {health && (
        <div>
          <h2 className="text-lg font-semibold mb-3">System Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(health).map(([service, data]) => {
              const d = data as { status: string };
              const color = d.status === "healthy" ? "text-green-400" : d.status === "unhealthy" ? "text-red-400" : "text-yellow-400";
              return (
                <div key={service} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
                  <p className="text-xs text-neutral-500">{service}</p>
                  <p className={`text-sm font-medium ${color}`}>{d.status}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
