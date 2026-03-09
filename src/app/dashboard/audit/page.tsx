const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: string;
  created_at: string;
}

async function getAudit() {
  try {
    const res = await fetch(`${API_BASE}/api/audit?limit=100`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AuditPage() {
  const data = await getAudit();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Audit Log</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 text-left">
              <th className="pb-2 pr-4">Actor</th>
              <th className="pb-2 pr-4">Action</th>
              <th className="pb-2 pr-4">Resource</th>
              <th className="pb-2 pr-4">Resource ID</th>
              <th className="pb-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {data.events.map((evt: AuditEvent) => (
              <tr key={evt.id} className="border-b border-neutral-800/50">
                <td className="py-2 pr-4 font-medium">{evt.actor}</td>
                <td className="py-2 pr-4 text-neutral-400">{evt.action}</td>
                <td className="py-2 pr-4 text-neutral-400">{evt.resource_type || "-"}</td>
                <td className="py-2 pr-4 text-xs text-neutral-500 font-mono">{evt.resource_id ? evt.resource_id.slice(0, 8) : "-"}</td>
                <td className="py-2 text-xs text-neutral-500">
                  {new Date(evt.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {data.events.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-neutral-500">No audit events</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
