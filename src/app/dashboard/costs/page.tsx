const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface ProviderCost {
  provider: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  total_cost: number;
  call_count: number;
}

interface DayCost {
  day: string;
  cost: number;
  calls: number;
}

async function getCosts() {
  try {
    const res = await fetch(`${API_BASE}/api/costs?days=30`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CostsPage() {
  const data = await getCosts();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Costs</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Costs</h1>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
          <span className="text-xs text-neutral-500">Total (30d)</span>
          <p className="text-xl font-bold">${data.total_cost_usd.toFixed(2)}</p>
        </div>
      </div>

      {/* By Provider */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">By Provider / Model</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 text-left">
                <th className="pb-2 pr-4">Provider</th>
                <th className="pb-2 pr-4">Model</th>
                <th className="pb-2 pr-4">Calls</th>
                <th className="pb-2 pr-4">Tokens In</th>
                <th className="pb-2 pr-4">Tokens Out</th>
                <th className="pb-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.by_provider.map((row: ProviderCost, i: number) => (
                <tr key={i} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4 font-medium">{row.provider}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.model}</td>
                  <td className="py-2 pr-4">{row.call_count}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.tokens_in?.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.tokens_out?.toLocaleString()}</td>
                  <td className="py-2 font-medium">${Number(row.total_cost).toFixed(4)}</td>
                </tr>
              ))}
              {data.by_provider.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-neutral-500">No cost data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* By Day */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Daily Costs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 text-left">
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Calls</th>
                <th className="pb-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.by_day.map((row: DayCost, i: number) => (
                <tr key={i} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4">{row.day}</td>
                  <td className="py-2 pr-4">{row.calls}</td>
                  <td className="py-2 font-medium">${Number(row.cost).toFixed(4)}</td>
                </tr>
              ))}
              {data.by_day.length === 0 && (
                <tr><td colSpan={3} className="py-4 text-center text-neutral-500">No cost data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
