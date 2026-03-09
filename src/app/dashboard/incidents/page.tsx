const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  source: string;
  assigned_to: string;
  resolved_at: string | null;
  resolution: string | null;
  created_at: string;
}

async function getIncidents() {
  try {
    const res = await fetch(`${API_BASE}/api/incidents`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function IncidentsPage() {
  const data = await getIncidents();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Incidents</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Incidents</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 text-left">
              <th className="pb-2 pr-4">Severity</th>
              <th className="pb-2 pr-4">Title</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Source</th>
              <th className="pb-2 pr-4">Assigned</th>
              <th className="pb-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.incidents.map((inc: Incident) => (
              <tr key={inc.id} className="border-b border-neutral-800/50">
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    inc.severity === "critical" ? "bg-red-900/30 text-red-400" :
                    inc.severity === "high" ? "bg-orange-900/30 text-orange-400" :
                    inc.severity === "medium" ? "bg-yellow-900/30 text-yellow-400" :
                    "bg-neutral-800 text-neutral-400"
                  }`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="py-2 pr-4 font-medium">{inc.title}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    inc.status === "resolved" ? "bg-green-900/30 text-green-400" :
                    inc.status === "open" ? "bg-red-900/30 text-red-400" :
                    "bg-yellow-900/30 text-yellow-400"
                  }`}>
                    {inc.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-neutral-400">{inc.source}</td>
                <td className="py-2 pr-4 text-neutral-400">{inc.assigned_to || "-"}</td>
                <td className="py-2 text-xs text-neutral-500">
                  {new Date(inc.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {data.incidents.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-neutral-500">No incidents</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
