import Link from "next/link";

export default function LocadoraPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-neutral-500 hover:text-white text-sm transition-colors">
            &larr; Home
          </Link>
          <span className="text-xs text-neutral-600 font-mono">v1.0 &middot; 29/04/2026</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Locadora Miami 2026
          </h1>
          <p className="text-neutral-400 text-lg">
            Simulação forense, Monte Carlo 10.000 runs, auditoria de 10 critérios ponderados.
            <br />
            <span className="text-amber-400">Sem alucinação. Sem falso consenso. Dados reais FL 2026.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/locadora/simulador"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900/40 to-neutral-900 border border-emerald-800/30 p-8 hover:border-emerald-600/50 transition-all"
          >
            <div className="text-3xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
              Simulador Monte Carlo
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              10.000 simulações com distribuição probabilística. P&L mensal, frota, payback, equity.
              Percentis P5/P25/P50/P75/P95. Parâmetros ajustáveis.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded">Monte Carlo</span>
              <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded">10K runs</span>
              <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded">Box-Muller</span>
            </div>
          </Link>

          <Link
            href="/locadora/auditoria"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-900/40 to-neutral-900 border border-red-800/30 p-8 hover:border-red-600/50 transition-all"
          >
            <div className="text-3xl mb-4">🔬</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">
              Auditoria Forense
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              10 critérios ponderados. Notas 1-10. Peso real. Força, fraqueza, armadilha,
              unknown unknowns. Contradições. Veredito objetivo.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">10 Critérios</span>
              <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">Pesos Reais</span>
              <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">Forense</span>
            </div>
          </Link>

          <Link
            href="/locadora/operacoes"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/40 to-neutral-900 border border-blue-800/30 p-8 hover:border-blue-600/50 transition-all"
          >
            <div className="text-3xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              Plano Operacional
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Cronograma 7 dias. Checklist executável. Contratos admin.
              Script parcerias. Guardrails. Breakpoints.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded">7 Dias</span>
              <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded">Executável</span>
              <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded">Guardrails</span>
            </div>
          </Link>
        </div>

        <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-8">
          <h3 className="text-lg font-semibold mb-4 text-amber-400">Premissas Base (Dados Reais FL 2026)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">Mercado FL</p>
              <p className="text-xl font-bold">$7.2B</p>
              <p className="text-xs text-neutral-500">Mordor Intelligence 2026</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">Turistas Miami/ano</p>
              <p className="text-xl font-bold">28M</p>
              <p className="text-xs text-neutral-500">Visit Florida 2025</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">Util Off-Airport</p>
              <p className="text-xl font-bold">70-85%</p>
              <p className="text-xs text-neutral-500">Rentscout + GetHapn</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">Income Tax FL</p>
              <p className="text-xl font-bold">0%</p>
              <p className="text-xs text-neutral-500">Tax Foundation 2026</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">RAV4 Hybrid Cash</p>
              <p className="text-xl font-bold">$32K</p>
              <p className="text-xs text-neutral-500">KBB 2026 avg</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">Insurance Fleet/car</p>
              <p className="text-xl font-bold">$300-500</p>
              <p className="text-xs text-neutral-500">GMI/Mesa FL 2026</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">Brasileiros/ano</p>
              <p className="text-xl font-bold">1M+</p>
              <p className="text-xs text-neutral-500">Consulado Miami</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 mb-1">Resale 36mo</p>
              <p className="text-xl font-bold">65-70%</p>
              <p className="text-xs text-neutral-500">KBB RAV4 Hybrid</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
