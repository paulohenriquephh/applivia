import { CRITERIOS, calcularAuditoria } from '@/lib/auditoria-forense';

export default function AuditoriaPage() {
  const auditoria = calcularAuditoria();

  const corPeso = (p: number) => p === 3 ? 'text-red-400' : p === 2 ? 'text-orange-400' : 'text-gray-400';
  const corNota = (n: number) => n >= 8 ? 'text-green-400' : n >= 5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/locadora" className="text-gray-500 hover:text-gray-300 text-sm">← Voltar</a>
          <h1 className="text-3xl font-black mt-2">🔬 Auditoria Forense</h1>
          <p className="text-gray-400 mt-1">10 critérios · Fontes primárias · 20+ Unknown Unknowns · Veredito objetivo</p>
        </div>

        {/* Scorecard global */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-gray-900 border border-yellow-500/30 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Opção A – Score Ponderado</p>
            <p className="text-4xl font-black text-yellow-400">{auditoria.scoreA}<span className="text-xl text-gray-500">/100</span></p>
            <p className="text-sm text-gray-400 mt-2">Conservador · 2 carros · Slow growth</p>
            <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full transition-all" style={{width: `${auditoria.scoreA}%`}} />
            </div>
          </div>
          <div className="p-5 bg-gray-900 border border-green-500/30 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Opção B – Score Ponderado</p>
            <p className="text-4xl font-black text-green-400">{auditoria.scoreB}<span className="text-xl text-gray-500">/100</span></p>
            <p className="text-sm text-gray-400 mt-2">Nuclear · 200 carros · AI Full</p>
            <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{width: `${auditoria.scoreB}%`}} />
            </div>
          </div>
          <div className="p-5 bg-gray-900 border border-orange-500/30 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Veredito</p>
            <p className="text-4xl font-black text-orange-400">B VENCE</p>
            <p className="text-sm text-gray-400 mt-2">Margem: +{auditoria.margemVitoria} pontos</p>
            <div className="mt-3 text-sm">
              <span className="text-green-400">{auditoria.criteriosB} critérios B</span>
              {' · '}
              <span className="text-yellow-400">{auditoria.criteriosA} critérios A</span>
            </div>
          </div>
        </div>

        {/* Payback real */}
        <div className="mb-8 p-5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
          <h3 className="font-bold text-lg mb-3 text-indigo-300">Payback Real – Análise Tri-cenário</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-indigo-900/30 rounded-lg">
              <p className="text-3xl font-black text-green-400">{auditoria.paybackRealMeses.otimista} meses</p>
              <p className="text-sm text-gray-400 mt-1">Otimista</p>
              <p className="text-xs text-gray-500">Util 90%+ dia 1 · Diária $90+ · Alta temporada</p>
            </div>
            <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/50">
              <p className="text-3xl font-black text-yellow-400">{auditoria.paybackRealMeses.provavel} meses</p>
              <p className="text-sm text-gray-400 mt-1">Provável ✓ BASE</p>
              <p className="text-xs text-gray-500">Util 70% mo1 → 82% mo3 · Diária $68 base</p>
            </div>
            <div className="p-4 bg-indigo-900/30 rounded-lg">
              <p className="text-3xl font-black text-red-400">{auditoria.paybackRealMeses.pessimista} meses</p>
              <p className="text-sm text-gray-400 mt-1">Pessimista</p>
              <p className="text-xs text-gray-500">Início jul-ago · Util 55% mo1 · Claims mo2</p>
            </div>
          </div>
        </div>

        {/* Alertas nucleares */}
        <div className="mb-8 p-5 bg-red-950/40 border border-red-500/40 rounded-xl">
          <h3 className="font-black text-lg mb-3 text-red-300">⚠ ALERTAS NUCLEARES – Destruidores de tese</h3>
          <ul className="space-y-2">
            {auditoria.alertasNucleares.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-red-200">
                <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Guardrails críticos */}
        <div className="mb-8 p-5 bg-green-950/30 border border-green-500/30 rounded-xl">
          <h3 className="font-black text-lg mb-3 text-green-300">✓ GUARDRAILS CRÍTICOS – Pré-requisitos de execução</h3>
          <ul className="space-y-2">
            {auditoria.guardrailsCriticos.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm text-green-200">
                <span className="text-green-400 mt-0.5 flex-shrink-0">G{i+1}</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critérios detalhados */}
        <h3 className="font-black text-2xl mb-4">10 Critérios – Análise Completa</h3>
        <div className="space-y-5">
          {CRITERIOS.map(c => (
            <div key={c.id} className="p-5 bg-gray-900 border border-gray-700 rounded-xl">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <span className="text-gray-500 text-sm font-mono">#{c.id}</span>
                <h4 className="font-bold text-lg flex-1">{c.nome}</h4>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs font-bold ${corPeso(c.peso)}`}>Peso {c.peso}</span>
                  <span className={`text-sm font-black px-2 py-0.5 rounded bg-yellow-900/30 ${corNota(c.notaA)}`}>A:{c.notaA}</span>
                  <span className={`text-sm font-black px-2 py-0.5 rounded bg-green-900/30 ${corNota(c.notaB)}`}>B:{c.notaB}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${c.verdict === 'B' ? 'bg-green-900/40 text-green-300' : c.verdict === 'A' ? 'bg-yellow-900/40 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>
                    {c.verdict === 'B' ? '→ B vence' : c.verdict === 'A' ? '→ A vence' : 'Empate'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{c.descricao}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <p className="text-xs text-yellow-400 font-bold">OPÇÃO A</p>
                  <p className="text-sm text-gray-300"><span className="text-green-400">+ </span>{c.forcaA}</p>
                  {c.fracassaA !== 'N/A' && <p className="text-sm text-gray-300"><span className="text-red-400">− </span>{c.fracassaA}</p>}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-green-400 font-bold">OPÇÃO B</p>
                  <p className="text-sm text-gray-300"><span className="text-green-400">+ </span>{c.forcaB}</p>
                  <p className="text-sm text-gray-300"><span className="text-red-400">− </span>{c.fracassaB}</p>
                </div>
              </div>

              <div className="p-3 bg-orange-950/30 border border-orange-500/20 rounded-lg mb-3">
                <p className="text-xs text-orange-400 font-bold mb-1">⚠ ARMADILHA DE B</p>
                <p className="text-sm text-orange-200">{c.armadilhaB}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg">
                  <p className="text-xs text-indigo-400 font-bold mb-1">🔵 Unknown Unknown #1</p>
                  <p className="text-sm text-indigo-200">{c.unknown1}</p>
                </div>
                <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg">
                  <p className="text-xs text-indigo-400 font-bold mb-1">🔵 Unknown Unknown #2</p>
                  <p className="text-sm text-indigo-200">{c.unknown2}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 font-bold mb-1">FONTES PRIMÁRIAS</p>
                <ul className="flex flex-wrap gap-2">
                  {c.fontes.map((f, i) => (
                    <li key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Recomendação final */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-950/50 to-blue-950/50 border border-green-500/40 rounded-xl">
          <h3 className="font-black text-2xl mb-3 text-green-300">RECOMENDAÇÃO FINAL – VEREDITO FORENSE</h3>
          <p className="text-gray-200 text-lg leading-relaxed">{auditoria.recomendacaoFinal}</p>
        </div>
      </div>
    </main>
  );
}
