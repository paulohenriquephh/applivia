import Link from 'next/link';

export default function LocadoraHome() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-orange-900 to-yellow-900 border-b border-orange-500/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🚗</span>
            <h1 className="text-3xl font-black tracking-tight">LOCADORA MIAMI NUCLEAR</h1>
          </div>
          <p className="text-orange-300 font-semibold">
            Sistema Operacional Completo · Miami 2026 · Monte Carlo 10.000 Runs · Auditoria Forense
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="bg-green-900/50 border border-green-500/40 text-green-300 px-3 py-1 rounded-full">✓ Payback Real: 3.5–4.5 meses</span>
            <span className="bg-blue-900/50 border border-blue-500/40 text-blue-300 px-3 py-1 rounded-full">✓ Frota alvo: 50 carros em 6 meses</span>
            <span className="bg-purple-900/50 border border-purple-500/40 text-purple-300 px-3 py-1 rounded-full">✓ Lucro P50: $2.4M em 18 meses</span>
            <span className="bg-yellow-900/50 border border-yellow-500/40 text-yellow-300 px-3 py-1 rounded-full">✓ Equity Frota: $1.5M+ em 18 meses</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Alerta forense crítico */}
        <div className="mb-8 p-5 bg-red-950/60 border border-red-500/50 rounded-xl">
          <h2 className="text-red-400 font-black text-lg mb-3">⚠ ALERTAS FORENSES CRÍTICOS (leia antes de executar)</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-red-200">
            <div>• <strong>DEALER LICENSE MV-205 obrigatória</strong> antes do mês 2 (30-60 dias para obter)</div>
            <div>• <strong>Payback 2.5 meses é cenário otimista</strong> – cenário provável: 4.0 meses</div>
            <div>• <strong>FL Rental Surcharge NÃO foi abolida</strong> – reduzida para $1/dia (HB 7063/2023)</div>
            <div>• <strong>Admin 1 pessoa = máx 8-10 carros</strong> – 50 carros requer 3-5 pessoas</div>
            <div>• <strong>5.000 parcerias em 6 meses</strong> é irrealista – meta real: 100-200 ativas</div>
            <div>• <strong>Sourcing 50 RAV4 Hybrid</strong> em 6 meses é gargalo real de mercado</div>
          </div>
        </div>

        {/* Módulos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link href="/locadora/simulador" className="group block p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-orange-500/60 hover:bg-gray-800/80 transition-all">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-orange-300 transition-colors">Simulador Monte Carlo</h3>
            <p className="text-gray-400 text-sm mb-3">10.000 runs · P10/P50/P90 · Payback real · Equity projetado · Análise de risco por cenário</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-orange-900/40 text-orange-300 px-2 py-0.5 rounded">10K runs</span>
              <span className="text-xs bg-orange-900/40 text-orange-300 px-2 py-0.5 rounded">Monte Carlo</span>
              <span className="text-xs bg-orange-900/40 text-orange-300 px-2 py-0.5 rounded">Payback</span>
            </div>
          </Link>

          <Link href="/locadora/auditoria" className="group block p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-red-500/60 hover:bg-gray-800/80 transition-all">
            <div className="text-4xl mb-3">🔬</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-red-300 transition-colors">Auditoria Forense</h3>
            <p className="text-gray-400 text-sm mb-3">10 critérios ponderados · Scores A vs B · Alertas nucleares · 20+ unknown unknowns · Fontes primárias</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-red-900/40 text-red-300 px-2 py-0.5 rounded">10 critérios</span>
              <span className="text-xs bg-red-900/40 text-red-300 px-2 py-0.5 rounded">Fontes primárias</span>
              <span className="text-xs bg-red-900/40 text-red-300 px-2 py-0.5 rounded">Veredito</span>
            </div>
          </Link>

          <Link href="/locadora/contrato" className="group block p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-blue-500/60 hover:bg-gray-800/80 transition-all">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">Contrato Admin 20%</h3>
            <p className="text-gray-400 text-sm mb-3">Gerador de contrato com KPIs assassinos · Cláusula 21 dias · Bônus occupancy · Trigger de rescisão</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">KPIs</span>
              <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">NPS 4.8</span>
              <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Occupancy</span>
            </div>
          </Link>

          <Link href="/locadora/parcerias" className="group block p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-green-500/60 hover:bg-gray-800/80 transition-all">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-green-300 transition-colors">Scripts de Parcerias</h3>
            <p className="text-gray-400 text-sm mb-3">5 canais · Airbnb hosts EN · Hotéis B2B · Grupos brasileiros PT · Cruise lines · Agências BR</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-0.5 rounded">8% comissão</span>
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-0.5 rounded">PT/EN/ES</span>
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-0.5 rounded">5 canais</span>
            </div>
          </Link>

          <Link href="/locadora/operacoes" className="group block p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-purple-500/60 hover:bg-gray-800/80 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">Cronograma 7 Dias</h3>
            <p className="text-gray-400 text-sm mb-3">Checklist hora a hora · LLC + EIN + Seguro + Frota + Lançamento · Triggers de pivot</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded">Dia 1</span>
              <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded">LLC</span>
              <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded">Primeiro aluguel</span>
            </div>
          </Link>

          <div className="p-6 bg-gray-900/50 border border-gray-700/50 rounded-xl">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-xl font-bold mb-2 text-gray-400">KPI Dashboard Live</h3>
            <p className="text-gray-500 text-sm mb-3">Acompanhamento em tempo real · Occupancy · NPS · Revenue · Fleet status</p>
            <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded">Em breve</span>
          </div>
        </div>

        {/* Scorecard rápido */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-200">Opção A vs B – Score Final</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Opção A (Conservador)</span>
                  <span className="text-yellow-400 font-bold">28.5 / 100</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-600 rounded-full" style={{width: '28.5%'}} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Opção B (Nuclear)</span>
                  <span className="text-green-400 font-bold">78.1 / 100</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '78.1%'}} />
                </div>
              </div>
            </div>
            <p className="text-green-300 text-sm mt-4 font-semibold">Veredito: B vence por +49.6 pontos (critérios ponderados)</p>
          </div>

          <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-200">Payback – Análise Forense</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Otimista (util 90% mo1)</span>
                <span className="text-green-400 font-bold">2.5 meses</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Provável (util 70% mo1)</span>
                <span className="text-yellow-400 font-bold">4.0 meses ✓</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Pessimista (jul-ago low season)</span>
                <span className="text-red-400 font-bold">6.5 meses</span>
              </div>
            </div>
            <p className="text-yellow-300 text-xs mt-3">Investimento: $64K cash (2× RAV4 Hybrid). Lucro/mês mo2: ~$16K.</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-900/60 border border-gray-700/50 rounded-lg text-xs text-gray-500">
          Data de referência: 29/04/2026 · Fontes: Mordor Intelligence, Rentscout, Tax Foundation FL, FHSMV, Manheim, iSeeCars, BLS FL, InsuranceQuotes specialty brokers · Este material é educacional, não constitui assessoria financeira ou jurídica.
        </div>
      </div>
    </main>
  );
}
