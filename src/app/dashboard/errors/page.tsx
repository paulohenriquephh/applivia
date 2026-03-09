const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface ErrorEntry {
  id: string;
  error_type: string;
  message: string;
  severity: string;
  resolved: boolean;
  resolution: string | null;
  created_at: string;
}

async function getErrors() {
  try {
    const res = await fetch(`${API_BASE}/api/errors?limit=50`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ErrorsPage() {
  const data = await getErrors();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Errors</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Errors</h1>

      <div className="space-y-3">
        {data.errors.map((err: ErrorEntry) => (
          <div key={err.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  err.severity === "critical" ? "bg-red-900/30 text-red-400" :
                  err.severity === "error" ? "bg-orange-900/30 text-orange-400" :
                  "bg-yellow-900/30 text-yellow-400"
                }`}>
                  {err.severity}
                </span>
                <span className="font-medium text-sm">{err.error_type}</span>
              </div>
              <span className={`text-xs ${err.resolved ? "text-green-400" : "text-red-400"}`}>
                {err.resolved ? "Resolved" : "Open"}
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-1">{err.message}</p>
            {err.resolution && <p className="text-xs text-neutral-500">Resolution: {err.resolution}</p>}
            <p className="text-xs text-neutral-600 mt-1">{new Date(err.created_at).toLocaleString()}</p>
          </div>
        ))}
        {data.errors.length === 0 && (
          <div className="text-center py-8 text-neutral-500">No errors recorded</div>
        )}
      </div>
    </div>
  );
}
