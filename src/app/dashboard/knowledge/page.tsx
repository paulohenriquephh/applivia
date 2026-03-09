const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface KnowledgeSource {
  id: string;
  name: string;
  source_type: string;
  url: string | null;
  status: string;
  last_sync: string | null;
  record_count: number;
}

async function getKnowledge() {
  try {
    const res = await fetch(`${API_BASE}/api/knowledge`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function KnowledgePage() {
  const data = await getKnowledge();

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Knowledge Sources</h1>
        <p className="text-neutral-400">API unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Knowledge Sources</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {data.sources.map((src: KnowledgeSource) => (
          <div key={src.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{src.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs ${
                src.status === "active" ? "bg-green-900/30 text-green-400" :
                "bg-neutral-800 text-neutral-400"
              }`}>
                {src.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500">Type: {src.source_type}</p>
            <p className="text-xs text-neutral-500">Records: {src.record_count}</p>
            {src.last_sync && (
              <p className="text-xs text-neutral-600">Last sync: {new Date(src.last_sync).toLocaleString()}</p>
            )}
          </div>
        ))}
        {data.sources.length === 0 && (
          <div className="col-span-full text-center py-8 text-neutral-500">
            No knowledge sources configured
          </div>
        )}
      </div>
    </div>
  );
}
