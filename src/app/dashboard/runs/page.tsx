const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface Run {
  id: string;
  agent: string;
  model: string;
  action: string;
  status: string;
  duration_ms: number;
  input_summary: string;
  output_summary: string;
  cost_usd: number;
  tokens_input: number;
  tokens_output: number;
  created_at: string;
}

async function getRuns() {
  try {
    const res = await fetch(`${API_BASE}/api/runs?limit=50`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function RunsPage() {
  const data = await getRuns();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Runs</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Runs</h1>
        <span className="text-sm text-neutral-500">{data.total} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 text-left">
              <th className="pb-2 pr-4">Agent</th>
              <th className="pb-2 pr-4">Action</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Model</th>
              <th className="pb-2 pr-4">Duration</th>
              <th className="pb-2 pr-4">Cost</th>
              <th className="pb-2 pr-4">Tokens</th>
              <th className="pb-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {data.runs.map((run: Run) => (
              <tr key={run.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50">
                <td className="py-2 pr-4 font-medium">{run.agent}</td>
                <td className="py-2 pr-4 text-neutral-400">{run.action}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    run.status === "success" ? "bg-green-900/30 text-green-400" :
                    run.status === "error" ? "bg-red-900/30 text-red-400" :
                    "bg-yellow-900/30 text-yellow-400"
                  }`}>
                    {run.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-xs text-neutral-500">{run.model}</td>
                <td className="py-2 pr-4 text-neutral-400">{run.duration_ms}ms</td>
                <td className="py-2 pr-4 text-neutral-400">${run.cost_usd?.toFixed(4)}</td>
                <td className="py-2 pr-4 text-xs text-neutral-500">{run.tokens_input}+{run.tokens_output}</td>
                <td className="py-2 text-xs text-neutral-500">
                  {new Date(run.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
