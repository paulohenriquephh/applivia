'use client';

import { useState, useMemo } from 'react';
import { executarMonteCarlo, DEFAULT_PARAMS, SimParams } from '@/lib/monte-carlo';

const fmt = (n: number) => n >= 1000000
  ? `$${(n / 1000000).toFixed(2)}M`
  : n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(0)}`;

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function SimuladorPage() {
  const [params, setParams] = useState<SimParams>({ ...DEFAULT_PARAMS, nRuns: 500 }); // 500 no browser
  const [rodando, setRodando] = useState(false);
  const [resultado, setResultado] = useState<ReturnType<typeof executarMonteCarlo> | null>(null);

  const executar = () => {
    setRodando(true);
    setTimeout(() => {
      const r = executarMonteCarlo(params);
      setResultado(r);
      setRodando(false);
    }, 50);
  };

  const maxReceita = useMemo(() => {
    if (!resultado) return 1;
    return Math.max(...resultado.p90.map(m => m.receita));
  }, [resultado]);

  const maxLucro = useMemo(() => {
    if (!resultado) return 1;
    return Math.max(...resultado.p90.map(m => m.lucro), 1);
  }, [resultado]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/locadora" className="text-gray-500 hover:text-gray-300 text-sm">← Voltar</a>
          <h1 className="text-3xl font-black mt-2">📊 Simulador Monte Carlo</h1>
          <p className="text-gray-400 mt-1">Locadora Miami · {params.nRuns} runs no browser (servidor: 10.000)</p>
        </div>

        {/* Controles */}
        <div className="grid md:grid-cols-4 gap-4 mb-6 p-5 bg-gray-900 border border-gray-700 rounded-xl">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Carros Iniciais</label>
            <input type="number" min={1} max={10} value={params.carrosIniciais}
              onChange={e => setParams(p => ({...p, carrosIniciais: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Frota Alvo (carros)</label>
            <input type="number" min={10} max={200} value={params.carrosAlvo}
              onChange={e => setParams(p => ({...p, carrosAlvo: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Custo/Carro ($)</label>
            <input type="number" min={20000} max={80000} step={1000} value={params.custoCarro}
              onChange={e => setParams(p => ({...p, custoCarro: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Diária Base ($)</label>
            <input type="number" min={45} max={150} value={params.diariaBase}
              onChange={e => setParams(p => ({...p, diariaBase: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Util. Mínima</label>
            <input type="number" min={0.4} max={0.95} step={0.01} value={params.utilMin}
              onChange={e => setParams(p => ({...p, utilMin: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Seguro/Carro/Mês ($)</label>
            <input type="number" min={200} max={800} step={25} value={params.seguroPorCarro}
              onChange={e => setParams(p => ({...p, seguroPorCarro: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Admin %</label>
            <input type="number" min={0.10} max={0.35} step={0.01} value={params.adminPercent}
              onChange={e => setParams(p => ({...p, adminPercent: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Luxury Mix (% frota, mo3+)</label>
            <input type="number" min={0} max={0.5} step={0.05} value={params.luxuryMix}
              onChange={e => setParams(p => ({...p, luxuryMix: +e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <button
          onClick={executar}
          disabled={rodando}
          className="mb-8 px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors"
        >
          {rodando ? '⏳ Rodando simulação...' : '▶ Executar Monte Carlo'}
        </button>

        {resultado && (
          <>
            {/* KPIs Principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Lucro P50 (18 meses)', value: fmt(resultado.p50.reduce((s,m) => s+m.lucro, 0)), sub: `P10: ${fmt(resultado.p10Lucro18m)}`, color: 'green' },
                { label: 'Lucro P90 (18 meses)', value: fmt(resultado.p90Lucro18m), sub: 'Cenário excelente', color: 'blue' },
                { label: 'Payback Médio', value: `${resultado.paybackMediaMeses.toFixed(1)} meses`, sub: `P90: ${resultado.paybackP90Meses.toFixed(1)} meses`, color: 'yellow' },
                { label: 'Equity Frota P50', value: fmt(resultado.equityP50_18m), sub: 'Valor residual 18m', color: 'purple' },
                { label: 'ROI P50 (18 meses)', value: `${resultado.roiP50.toFixed(0)}%`, sub: `Investimento: ${fmt(resultado.investimentoInicial)}`, color: 'orange' },
                { label: 'Prob. Payback 3m', value: pct(resultado.probPayback3m), sub: 'Cenário otimista', color: 'green' },
                { label: 'Prob. Payback 6m', value: pct(resultado.probPayback6m), sub: 'Meta principal', color: 'blue' },
                { label: 'Max Drawdown P90', value: fmt(resultado.varMaxDrawdown), sub: 'Pior sequência negativa', color: 'red' },
              ].map(k => (
                <div key={k.label} className={`p-4 bg-gray-900 border rounded-xl border-${k.color}-500/30`}>
                  <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                  <p className={`text-2xl font-black text-${k.color}-400`}>{k.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Gráfico de barras – Lucro por mês P10/P50/P90 */}
            <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl mb-6">
              <h3 className="font-bold text-lg mb-4">Lucro Mensal – P10 / P50 / P90</h3>
              <div className="overflow-x-auto">
                <div className="flex gap-1 items-end" style={{minWidth: `${resultado.p50.length * 52}px`, height: '200px'}}>
                  {resultado.p50.map((m, i) => {
                    const p10l = resultado.p10[i]?.lucro ?? 0;
                    const p50l = m.lucro;
                    const p90l = resultado.p90[i]?.lucro ?? 0;
                    const h10 = Math.max(0, (p10l / maxLucro) * 100);
                    const h50 = Math.max(0, (p50l / maxLucro) * 100);
                    const h90 = Math.max(0, (p90l / maxLucro) * 100);
                    return (
                      <div key={m.mes} className="flex gap-0.5 items-end flex-1 group relative" title={`Mo${m.mes}: P10=${fmt(p10l)} P50=${fmt(p50l)} P90=${fmt(p90l)}`}>
                        <div className="flex-1 bg-red-800/60 rounded-t-sm transition-all" style={{height: `${h10}%`}} />
                        <div className="flex-1 bg-orange-500/80 rounded-t-sm transition-all" style={{height: `${h50}%`}} />
                        <div className="flex-1 bg-green-500/70 rounded-t-sm transition-all" style={{height: `${h90}%`}} />
                        <div className="absolute -bottom-5 left-0 right-0 text-center text-xs text-gray-600">
                          {m.mes}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-8 text-xs text-gray-400">
                  <span><span className="inline-block w-3 h-3 bg-red-800 rounded mr-1" />P10 (pessimista)</span>
                  <span><span className="inline-block w-3 h-3 bg-orange-500 rounded mr-1" />P50 (base)</span>
                  <span><span className="inline-block w-3 h-3 bg-green-500 rounded mr-1" />P90 (otimista)</span>
                </div>
              </div>
            </div>

            {/* Gráfico de frota */}
            <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl mb-6">
              <h3 className="font-bold text-lg mb-4">Crescimento de Frota (P50)</h3>
              <div className="overflow-x-auto">
                <div className="flex gap-2 items-end" style={{minWidth: `${resultado.p50.length * 52}px`, height: '120px'}}>
                  {resultado.p50.map(m => (
                    <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">{m.frota}</span>
                      <div
                        className="w-full bg-blue-600/70 rounded-t"
                        style={{height: `${(m.frota / params.carrosAlvo) * 80}px`}}
                      />
                      <span className="text-xs text-gray-600">{m.mes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabela detalhada */}
            <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl overflow-x-auto">
              <h3 className="font-bold text-lg mb-4">Detalhamento Mensal – Cenário P50 (Base)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-2 text-left">Mês</th>
                    <th className="py-2 text-right">Frota</th>
                    <th className="py-2 text-right">Util%</th>
                    <th className="py-2 text-right">Diária</th>
                    <th className="py-2 text-right">Receita</th>
                    <th className="py-2 text-right">Custos</th>
                    <th className="py-2 text-right">Lucro</th>
                    <th className="py-2 text-right">Acumulado</th>
                    <th className="py-2 text-right">Equity</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.p50.map(m => (
                    <tr key={m.mes} className={`border-b border-gray-800/50 hover:bg-gray-800/30 ${m.paybackAtingido ? 'bg-green-950/20' : ''}`}>
                      <td className="py-1.5 text-gray-300">
                        Mês {m.mes}
                        {m.paybackAtingido && m.mes === resultado.p50.findIndex(x => x.paybackAtingido) + 1 && (
                          <span className="ml-1 text-xs text-green-400">✓ payback</span>
                        )}
                      </td>
                      <td className="py-1.5 text-right text-blue-300">{m.frota}</td>
                      <td className="py-1.5 text-right text-yellow-300">{(m.util * 100).toFixed(1)}%</td>
                      <td className="py-1.5 text-right text-gray-300">${m.diaria}</td>
                      <td className="py-1.5 text-right">{fmt(m.receita)}</td>
                      <td className="py-1.5 text-right text-red-400">{fmt(m.custoTotal)}</td>
                      <td className={`py-1.5 text-right font-semibold ${m.lucro > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {fmt(m.lucro)}
                      </td>
                      <td className={`py-1.5 text-right ${m.lucroAcum > 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {fmt(m.lucroAcum)}
                      </td>
                      <td className="py-1.5 text-right text-purple-300">{fmt(m.equityFrota)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-yellow-950/30 border border-yellow-700/40 rounded-lg text-sm text-yellow-200">
              <strong>Nota forense:</strong> Simulação usa {params.nRuns} runs no browser. Servidor roda 10.000 runs para distribuições mais precisas. Parâmetros baseados em benchmarks reais Miami 2026: Rentscout (70-85% util), GetHapn ($65-120/dia), specialty brokers FL ($300-500/mês/carro). Payback 2.5 meses só em cenário P90 otimista. Projeção P50 (base): {resultado.paybackMediaMeses.toFixed(1)} meses.
            </div>
          </>
        )}
      </div>
    </main>
  );
}
