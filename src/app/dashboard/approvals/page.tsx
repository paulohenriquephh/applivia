const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface Approval {
  id: string;
  request_type: string;
  description: string;
  status: string;
  requested_by: string;
  approved_by: string | null;
  decided_at: string | null;
  created_at: string;
}

async function getApprovals() {
  try {
    const res = await fetch(`${API_BASE}/api/approvals?status=`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ApprovalsPage() {
  const data = await getApprovals();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Approvals</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Approvals</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 text-left">
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2 pr-4">Description</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Requested By</th>
              <th className="pb-2 pr-4">Decided By</th>
              <th className="pb-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.approvals.map((a: Approval) => (
              <tr key={a.id} className="border-b border-neutral-800/50">
                <td className="py-2 pr-4 font-medium">{a.request_type}</td>
                <td className="py-2 pr-4 text-neutral-400 max-w-xs truncate">{a.description}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    a.status === "approved" ? "bg-green-900/30 text-green-400" :
                    a.status === "rejected" ? "bg-red-900/30 text-red-400" :
                    "bg-yellow-900/30 text-yellow-400"
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-neutral-400">{a.requested_by}</td>
                <td className="py-2 pr-4 text-neutral-400">{a.approved_by || "-"}</td>
                <td className="py-2 text-xs text-neutral-500">
                  {new Date(a.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {data.approvals.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-neutral-500">No approval requests</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
