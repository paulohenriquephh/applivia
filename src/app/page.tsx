export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-6">Fundação</h1>
        <p className="text-xl text-neutral-400 mb-12">
          AI-powered automation platform with intelligent agents
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <a href="/locadora" className="block p-6 bg-orange-900/40 border border-orange-700 rounded-lg hover:bg-orange-900/60 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🚗</span>
              <h2 className="text-2xl font-semibold">Miami Car Rental</h2>
              <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded font-bold">NUCLEAR</span>
            </div>
            <p className="text-neutral-300">Dashboard operacional · Monte Carlo 10K runs · Auditoria Forense · Contratos · Marketing</p>
          </a>

          <a href="/dashboard" className="block p-6 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
            <p className="text-neutral-400">Monitor your AI agents and automation workflows</p>
          </a>
          
          <div className="block p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">AI Agents</h2>
            <p className="text-neutral-400">CrewAI-powered agents for marketing, sales & growth</p>
          </div>
          
          <div className="block p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Brain</h2>
            <p className="text-neutral-400">Python backend for AI processing</p>
          </div>
        </div>
      </div>
    </main>
  );
}
