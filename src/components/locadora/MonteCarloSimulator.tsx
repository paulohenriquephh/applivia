"use client";

import { useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";

interface MonthResult {
  month: number;
  fleet: number;
  revenue: number;
  profit: number;
  utilization: number;
  cumulativeProfit: number;
}

interface ScenarioResult {
  runs: number;
  p10: number;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  mean: number;
  stdDev: number;
  paybackP50: number;
  paybackP90: number;
  bankruptcyRate: number;
  successRate: number;
  avgMonths: MonthResult[];
  sampleRuns: { months: MonthResult[]; totalProfit: number; paybackMonth: number | null }[];
}

interface MCResult {
  scenarioA: ScenarioResult;
  scenarioB: ScenarioResult;
  forensicAudit: Record<string, { rating: string; detail: string; mitigation: string; breakpoint: string }>;
  comparison: {
    profitDelta: number;
    profitMultiple: number | null;
    paybackDelta: number;
    recommendation: string;
    guardrails: string[];
  };
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function riskColor(rating: string) {
  if (rating === "BAIXO") return "text-green-400";
  if (rating === "MÉDIO" || rating === "MÉDIO-BAIXO") return "text-yellow-400";
  return "text-red-400";
}

export default function MonteCarloSimulator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MCResult | null>(null);
  const [runs, setRuns] = useState(3000);
  const [months, setMonths] = useState(18);
  const [targetCars, setTargetCars] = useState(200);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/monte-carlo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runs, months, targetCars }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [runs, months, targetCars]);

  const chartData = result
    ? result.scenarioB.avgMonths.map((m, i) => ({
        month: `M${m.month}`,
        B_profit: m.profit,
        A_profit: result.scenarioA.avgMonths[i]?.profit || 0,
        B_cumulative: m.cumulativeProfit,
        A_cumulative: result.scenarioA.avgMonths[i]?.cumulativeProfit || 0,
        fleet: m.fleet,
      }))
    : [];

  const distributionData = result
    ? [
        { label: "P10", A: result.scenarioA.p10, B: result.scenarioB.p10 },
        { label: "P25", A: result.scenarioA.p25, B: result.scenarioB.p25 },
        { label: "Mediana", A: result.scenarioA.median, B: result.scenarioB.median },
        { label: "P75", A: result.scenarioA.p75, B: result.scenarioB.p75 },
        { label: "P90", A: result.scenarioA.p90, B: result.scenarioB.p90 },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🎲</span> Simulador Monte Carlo
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Runs (precisão)</label>
            <select
              value={runs}
              onChange={(e) => setRuns(Number(e.target.value))}
              className="w-full bg-neutral-700 text-white rounded px-3 py-2 text-sm border border-neutral-600"
            >
              <option value={1000}>1.000 (rápido)</option>
              <option value={3000}>3.000 (padrão)</option>
              <option value={5000}>5.000 (preciso)</option>
              <option value={10000}>10.000 (nuclear)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Horizonte (meses)</label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full bg-neutral-700 text-white rounded px-3 py-2 text-sm border border-neutral-600"
            >
              <option value={12}>12 meses</option>
              <option value={18}>18 meses</option>
              <option value={24}>24 meses</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Frota alvo máxima</label>
            <select
              value={targetCars}
              onChange={(e) => setTargetCars(Number(e.target.value))}
              className="w-full bg-neutral-700 text-white rounded px-3 py-2 text-sm border border-neutral-600"
            >
              <option value={50}>50 carros</option>
              <option value={100}>100 carros</option>
              <option value={200}>200 carros</option>
              <option value={500}>500 carros</option>
            </select>
          </div>
        </div>
        <button
          onClick={runSimulation}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-600 text-white font-bold py-3 rounded-lg transition-colors text-sm"
        >
          {loading ? "⚙️ Rodando simulação..." : "🚀 EXECUTAR MONTE CARLO"}
        </button>
      </div>

      {result && (
        <>
          {/* Recomendação */}
          <div
            className={`rounded-xl p-5 border-2 ${
              result.comparison.recommendation.includes("B")
                ? "border-orange-500 bg-orange-950/40"
                : "border-blue-500 bg-blue-950/40"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">
                {result.comparison.recommendation.includes("B") ? "🔥" : "🛡️"}
              </span>
              <div>
                <p className="text-xs text-neutral-400">VEREDITO DO SIMULADOR</p>
                <p className="text-xl font-bold text-white">
                  {result.comparison.recommendation === "EXECUTE_B"
                    ? "EXECUTE CENÁRIO B — NUCLEAR"
                    : result.comparison.recommendation === "EXECUTE_B_WITH_GUARDRAILS"
                    ? "EXECUTE B COM GUARDRAILS"
                    : "EXECUTE CENÁRIO A — CONSERVADOR"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {result.comparison.guardrails.map((g, i) => (
                <div key={i} className="text-xs text-orange-200 bg-orange-900/30 rounded px-2 py-1">
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* KPIs Comparativos */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cenário A */}
            <div className="bg-neutral-800 rounded-xl p-5 border border-blue-800">
              <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                <span>🛡️</span> CENÁRIO A — CONSERVADOR
              </h3>
              <div className="space-y-2">
                <Metric label="Lucro Mediana" value={fmt(result.scenarioA.median)} sub={`±${fmt(result.scenarioA.stdDev)}`} />
                <Metric label="P10 (pior 10%)" value={fmt(result.scenarioA.p10)} danger={result.scenarioA.p10 < 0} />
                <Metric label="P90 (melhor 10%)" value={fmt(result.scenarioA.p90)} />
                <Metric label="Payback P50" value={`${result.scenarioA.paybackP50} meses`} />
                <Metric label="Taxa falência" value={`${result.scenarioA.bankruptcyRate}%`} danger={result.scenarioA.bankruptcyRate > 10} />
                <Metric label="Payback <8m (prob)" value={`${result.scenarioA.successRate}%`} />
              </div>
            </div>

            {/* Cenário B */}
            <div className="bg-neutral-800 rounded-xl p-5 border border-orange-700">
              <h3 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2">
                <span>🔥</span> CENÁRIO B — NUCLEAR NATALYA 2.0
              </h3>
              <div className="space-y-2">
                <Metric label="Lucro Mediana" value={fmt(result.scenarioB.median)} highlight />
                <Metric label="P10 (pior 10%)" value={fmt(result.scenarioB.p10)} danger={result.scenarioB.p10 < 0} />
                <Metric label="P90 (melhor 10%)" value={fmt(result.scenarioB.p90)} highlight />
                <Metric label="Payback P50" value={`${result.scenarioB.paybackP50} meses`} highlight />
                <Metric label="Taxa falência" value={`${result.scenarioB.bankruptcyRate}%`} danger={result.scenarioB.bankruptcyRate > 10} />
                <Metric label="Payback <8m (prob)" value={`${result.scenarioB.successRate}%`} highlight />
              </div>
            </div>
          </div>

          {/* Delta */}
          <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-neutral-400">Vantagem lucro B vs A</p>
              <p className="text-2xl font-bold text-orange-400">{fmt(result.comparison.profitDelta)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Múltiplo B/A</p>
              <p className="text-2xl font-bold text-orange-400">
                {result.comparison.profitMultiple ? `${result.comparison.profitMultiple}x` : "∞"}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Payback mais rápido em B</p>
              <p className="text-2xl font-bold text-orange-400">{result.comparison.paybackDelta} meses</p>
            </div>
          </div>

          {/* Gráfico Lucro Mensal */}
          <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
            <h3 className="text-sm font-bold text-white mb-4">Lucro Mensal Médio — A vs B ({runs.toLocaleString()} runs)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => fmt(Number(v))}
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#6b7280" />
                <Bar dataKey="A_profit" name="Cenário A" fill="#3b82f6" opacity={0.8} />
                <Bar dataKey="B_profit" name="Cenário B" fill="#f97316" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Lucro Acumulado */}
          <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
            <h3 className="text-sm font-bold text-white mb-4">Lucro Acumulado — Trajetória Média</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tickFormatter={(v) => fmt(v)} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => fmt(Number(v))}
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Legend />
                <ReferenceLine y={64000} stroke="#6b7280" strokeDasharray="4 4" label={{ value: "Payback ($64K)", fill: "#9ca3af", fontSize: 10 }} />
                <Area type="monotone" dataKey="A_cumulative" name="Cenário A Acum." stroke="#3b82f6" fill="url(#colorA)" strokeWidth={2} />
                <Area type="monotone" dataKey="B_cumulative" name="Cenário B Acum." stroke="#f97316" fill="url(#colorB)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição de probabilidade */}
          <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
            <h3 className="text-sm font-bold text-white mb-4">Distribuição de Probabilidade — Lucro Total</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={distributionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tickFormatter={(v) => fmt(v)} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => fmt(Number(v))}
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Legend />
                <Bar dataKey="A" name="Cenário A" fill="#3b82f6" />
                <Bar dataKey="B" name="Cenário B" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Auditoria de Riscos */}
          <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
            <h3 className="text-sm font-bold text-white mb-4">⚠️ Mapa de Risco — Auditoria Forense</h3>
            <div className="space-y-3">
              {Object.entries(result.forensicAudit).map(([key, risk]) => (
                <div key={key} className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-white capitalize">
                      {key.replace(/([A-Z])/g, " $1").replace("Risk", "").trim()}
                    </p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${riskColor(risk.rating)} bg-neutral-800`}>
                      {risk.rating}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-1">{risk.detail}</p>
                  <p className="text-xs text-green-400 mb-1">✓ {risk.mitigation}</p>
                  <p className="text-xs text-red-400">⚡ Breakpoint: {risk.breakpoint}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  danger,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-neutral-400">{label}</span>
      <div className="text-right">
        <span
          className={`text-sm font-semibold ${
            danger ? "text-red-400" : highlight ? "text-orange-300" : "text-white"
          }`}
        >
          {value}
        </span>
        {sub && <span className="text-xs text-neutral-500 ml-1">{sub}</span>}
      </div>
    </div>
  );
}
