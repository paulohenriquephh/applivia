const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface Integration {
  id: string;
  name: string;
  integration_type: string;
  status: string;
  endpoint: string;
  last_health_check: string | null;
  last_health_status: string | null;
}

async function getIntegrations() {
  try {
    const res = await fetch(`${API_BASE}/api/integrations`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function IntegrationsPage() {
  const data = await getIntegrations();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Integrations</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Integrations</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.integrations.map((intg: Integration) => (
          <div key={intg.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{intg.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs ${
                intg.last_health_status === "healthy" ? "bg-green-900/30 text-green-400" :
                intg.last_health_status === "unhealthy" ? "bg-red-900/30 text-red-400" :
                "bg-neutral-800 text-neutral-400"
              }`}>
                {intg.last_health_status || "unknown"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-1">Type: {intg.integration_type}</p>
            <p className="text-xs text-neutral-500 mb-1">Status: {intg.status}</p>
            {intg.last_health_check && (
              <p className="text-xs text-neutral-600">
                Last check: {new Date(intg.last_health_check).toLocaleString()}
              </p>
            )}
          </div>
        ))}
        {data.integrations.length === 0 && (
          <div className="col-span-full text-center py-8 text-neutral-500">
            No integrations registered
          </div>
        )}
      </div>
    </div>
  );
}
