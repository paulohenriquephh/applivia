import Link from "next/link";

const agents = [
  { id: "orchestrator", name: "Orchestrator", icon: "👔", description: "Coordenador geral de operações" },
  { id: "import", name: "Importação", icon: "🚢", description: "Fornecedores China/Itália" },
  { id: "advertising", name: "Publicidade", icon: "📢", description: "Meta, Google, TikTok Ads" },
  { id: "luxury_watch", name: "Relógios", icon: "⌚", description: "Análise técnica de luxo" },
  { id: "whatsapp_sdr", name: "WhatsApp SDR", icon: "💬", description: "Vendas via WhatsApp" },
  { id: "tiktok_growth", name: "TikTok", icon: "🎵", description: "Crescimento orgânico" },
  { id: "knowledge_sync", name: "Knowledge Sync", icon: "🧠", description: "Sincronização de dados" },
];

const services = [
  { name: "maestro-brain", port: 8000, description: "FastAPI backend" },
  { name: "maestro-crewai", port: 8002, description: "Multi-agent orchestration" },
  { name: "maestro-litellm", port: 4000, description: "LLM proxy" },
  { name: "maestro-n8n", port: 5678, description: "Automation workflows" },
  { name: "maestro-evolution", port: 8080, description: "WhatsApp API" },
  { name: "maestro-qdrant", port: 6333, description: "Vector database" },
  { name: "maestro-postgres", port: 5432, description: "PostgreSQL" },
  { name: "maestro-redis", port: 6379, description: "Redis cache" },
  { name: "maestro-grafana", port: 3000, description: "Monitoring" },
  { name: "maestro-prometheus", port: 9090, description: "Metrics" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-neutral-400 mt-1">Maestro AI Engine v3</p>
          </div>
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors text-sm">
            ← Back
          </Link>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">AI Agents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-neutral-800 rounded-lg p-4 flex items-start gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-neutral-400">{agent.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.name} className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{service.name}</p>
                  <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">
                    :{service.port}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
