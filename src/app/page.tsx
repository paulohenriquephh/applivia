export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-6">Fundação</h1>
        <p className="text-xl text-neutral-400 mb-12">
          AI-powered automation platform with intelligent agents
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <a href="/dashboard" className="block p-6 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
            <p className="text-neutral-400">Monitor your AI agents and automation workflows</p>
          </a>
          
          <div className="block p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">AI Agents</h2>
            <p className="text-neutral-400">CrewAI-powered agents for marketing, sales & growth</p>
          </div>
          
          <div className="block p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Automation</h2>
            <p className="text-neutral-400">n8n workflows for daily sync & webhooks</p>
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
