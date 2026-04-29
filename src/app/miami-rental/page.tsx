"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell, PieChart, Pie,
} from "recharts";

import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
const fmtTooltip = (v: ValueType | undefined) => fmt(Number(v ?? 0));
import {
  runDeterministicSimulation,
  runMonteCarlo,
  SCENARIO_A,
  SCENARIO_B,
  type SimulationParams,
  type MonthlyResult,
} from "@/lib/simulation";
import { runForensicAudit } from "@/lib/forensic-audit";

const fmt = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const pct = (n: number) => `${n.toFixed(1)}%`;

function KPI({ label, value, sub, color = "text-emerald-400" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-xl p-4">
      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-2xl font-bold mt-12 mb-4 flex items-center gap-3 border-b border-neutral-700/50 pb-3">
      {children}
    </h2>
  );
}

const COLORS_PIE = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function MiamiRentalPage() {
  const [mcRuns, setMcRuns] = useState(5000);
  const [activeTab, setActiveTab] = useState<"simulator" | "audit" | "contracts" | "cronograma">("simulator");

  const simA = useMemo(() => runDeterministicSimulation(SCENARIO_A), []);
  const simB = useMemo(() => runDeterministicSimulation(SCENARIO_B), []);
  const mcA = useMemo(() => runMonteCarlo(SCENARIO_A, mcRuns), [mcRuns]);
  const mcB = useMemo(() => runMonteCarlo(SCENARIO_B, mcRuns), [mcRuns]);
  const audit = useMemo(() => runForensicAudit(), []);

  const comparisonData = simB.map((b, i) => ({
    month: `M${b.month}`,
    "B Lucro": b.netProfit,
    "A Lucro": simA[i]?.netProfit ?? 0,
    "B Frota": b.fleet,
    "A Frota": simA[i]?.fleet ?? simA[simA.length - 1].fleet,
    "B Acumulado": b.cumulativeProfit,
    "A Acumulado": simA[i]?.cumulativeProfit ?? simA[simA.length - 1].cumulativeProfit,
    "B Receita": b.grossRevenue,
    "A Receita": simA[i]?.grossRevenue ?? 0,
    "B Util%": b.utilization,
    "A Util%": simA[i]?.utilization ?? 0,
    "B Margem%": b.marginPct,
    "A Margem%": simA[i]?.marginPct ?? 0,
  }));

  const mcComparison = mcB.percentile50.map((b, i) => ({
    month: `M${b.month}`,
    "B P5": mcB.percentile5[i].cumulativeProfit,
    "B P50": b.cumulativeProfit,
    "B P95": mcB.percentile95[i].cumulativeProfit,
    "A P5": mcA.percentile5[i]?.cumulativeProfit ?? 0,
    "A P50": mcA.percentile50[i]?.cumulativeProfit ?? 0,
    "A P95": mcA.percentile95[i]?.cumulativeProfit ?? 0,
  }));

  const radarData = audit.criteria.map(c => ({
    criterion: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name,
    "Cenário A": c.scoreA,
    "Cenário B": c.scoreB,
  }));

  const lastB = simB[simB.length - 1];
  const lastA = simA[simA.length - 1];

  const costBreakdown = [
    { name: "Seguro", value: lastB.insuranceCost },
    { name: "Manutenção", value: lastB.maintenanceCost },
    { name: "Admin", value: lastB.adminCost },
    { name: "Marketing", value: lastB.marketingCost },
    { name: "Combustível/Misc", value: lastB.fuelMiscCost },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Miami Rental <span className="text-emerald-400">Nuclear Simulator</span>
            </h1>
            <p className="text-neutral-400 mt-1 text-sm">
              Simulação Monte Carlo {mcRuns.toLocaleString()} runs + Auditoria Forense 10 Critérios | Data: 29/04/2026
            </p>
          </div>
          <Link href="/" className="text-neutral-500 hover:text-white transition text-sm">← Voltar</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-neutral-900 p-1 rounded-xl mb-8 overflow-x-auto">
          {(["simulator", "audit", "contracts", "cronograma"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab ? "bg-emerald-600 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              {tab === "simulator" ? "Simulador" : tab === "audit" ? "Auditoria Forense" : tab === "contracts" ? "Contratos & Scripts" : "Cronograma 7 Dias"}
            </button>
          ))}
        </div>

        {/* MC Runs Control */}
        {activeTab === "simulator" && (
          <div className="flex items-center gap-4 mb-6 bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3">
            <label className="text-sm text-neutral-400">Monte Carlo Runs:</label>
            <select
              value={mcRuns}
              onChange={e => setMcRuns(Number(e.target.value))}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1 text-sm"
            >
              <option value={1000}>1.000</option>
              <option value={5000}>5.000</option>
              <option value={10000}>10.000</option>
            </select>
          </div>
        )}

        {/* SIMULATOR TAB */}
        {activeTab === "simulator" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              <KPI label="Lucro Acum. B (18m)" value={fmt(lastB.cumulativeProfit)} sub={`vs A: ${fmt(lastA.cumulativeProfit)}`} />
              <KPI label="Frota Final B" value={`${lastB.fleet} carros`} sub={`vs A: ${lastA.fleet}`} />
              <KPI label="Equity B" value={fmt(lastB.equity)} sub={`Resale ${(SCENARIO_B.resaleValuePct * 100).toFixed(0)}%`} />
              <KPI label="Margem B Mês 18" value={pct(lastB.marginPct)} sub={`vs A: ${pct(lastA.marginPct)}`} color="text-blue-400" />
              <KPI label="Payback MC (B)" value={`${mcB.avgPaybackMonth} meses`} sub={`A: ${mcA.avgPaybackMonth} meses`} color="text-amber-400" />
              <KPI label="Failure Rate B" value={pct(mcB.failureRate)} sub={`A: ${pct(mcA.failureRate)}`} color={mcB.failureRate > 10 ? "text-red-400" : "text-emerald-400"} />
            </div>

            {/* Lucro Mensal Comparativo */}
            <SectionTitle>Lucro Líquido Mensal — A vs B</SectionTitle>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: "#888", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                    formatter={fmtTooltip}
                  />
                  <Legend />
                  <Bar dataKey="B Lucro" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="A Lucro" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Lucro Acumulado */}
            <SectionTitle>Lucro Acumulado — A vs B</SectionTitle>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: "#888", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                    formatter={fmtTooltip}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="B Acumulado" stroke="#10b981" fill="#10b98133" strokeWidth={2} />
                  <Area type="monotone" dataKey="A Acumulado" stroke="#3b82f6" fill="#3b82f633" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Fleet Growth */}
            <SectionTitle>Crescimento da Frota</SectionTitle>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="B Frota" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="A Frota" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Utilization & Margin */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div>
                <SectionTitle>Utilização %</SectionTitle>
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} />
                      <YAxis domain={[50, 100]} tick={{ fill: "#888", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
                      <Legend />
                      <Line type="monotone" dataKey="B Util%" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="A Util%" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <SectionTitle>Margem Líquida %</SectionTitle>
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#888", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
                      <Legend />
                      <Line type="monotone" dataKey="B Margem%" stroke="#ec4899" strokeWidth={2} />
                      <Line type="monotone" dataKey="A Margem%" stroke="#06b6d4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Monte Carlo Bands */}
            <SectionTitle>Monte Carlo — Bandas de Confiança (P5 / P50 / P95)</SectionTitle>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={mcComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: "#888", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
                    formatter={fmtTooltip}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="B P95" stroke="#10b981" fill="#10b98122" strokeWidth={1} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="B P50" stroke="#10b981" fill="#10b98144" strokeWidth={2} />
                  <Area type="monotone" dataKey="B P5" stroke="#10b981" fill="#10b98111" strokeWidth={1} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="A P95" stroke="#3b82f6" fill="#3b82f622" strokeWidth={1} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="A P50" stroke="#3b82f6" fill="#3b82f644" strokeWidth={2} />
                  <Area type="monotone" dataKey="A P5" stroke="#3b82f6" fill="#3b82f611" strokeWidth={1} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* MC Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <KPI label="MC Lucro Médio B (18m)" value={fmt(mcB.avgTotalProfit18)} color="text-emerald-400" />
              <KPI label="MC Lucro Médio A (18m)" value={fmt(mcA.avgTotalProfit18)} color="text-blue-400" />
              <KPI label="MC Frota Final B" value={`${mcB.avgFinalFleet} carros`} color="text-emerald-400" />
              <KPI label="MC Equity B" value={fmt(mcB.avgFinalEquity)} color="text-amber-400" />
            </div>

            {/* Cost Breakdown */}
            <SectionTitle>Estrutura de Custos — Mês 18 Cenário B</SectionTitle>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={costBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {costBreakdown.map((_, idx) => (
                        <Cell key={idx} fill={COLORS_PIE[idx % COLORS_PIE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={fmtTooltip} contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-neutral-500 border-b border-neutral-700">
                      <th className="text-left py-2">Custo</th>
                      <th className="text-right py-2">Valor/Mês</th>
                      <th className="text-right py-2">% Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costBreakdown.map(c => (
                      <tr key={c.name} className="border-b border-neutral-800">
                        <td className="py-2">{c.name}</td>
                        <td className="text-right font-mono">{fmt(c.value)}</td>
                        <td className="text-right font-mono">{pct(lastB.grossRevenue > 0 ? (c.value / lastB.grossRevenue) * 100 : 0)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold text-emerald-400">
                      <td className="py-2">Total Custos</td>
                      <td className="text-right font-mono">{fmt(lastB.totalCosts)}</td>
                      <td className="text-right font-mono">{pct(lastB.grossRevenue > 0 ? (lastB.totalCosts / lastB.grossRevenue) * 100 : 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Detail Table */}
            <SectionTitle>Tabela Mensal Detalhada — Cenário B</SectionTitle>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-6 overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="text-neutral-500 border-b border-neutral-700">
                    <th className="text-left py-2 px-1">Mês</th>
                    <th className="text-right py-2 px-1">Frota</th>
                    <th className="text-right py-2 px-1">Util%</th>
                    <th className="text-right py-2 px-1">Rate/Dia</th>
                    <th className="text-right py-2 px-1">Receita</th>
                    <th className="text-right py-2 px-1">Custos</th>
                    <th className="text-right py-2 px-1">Lucro</th>
                    <th className="text-right py-2 px-1">Margem%</th>
                    <th className="text-right py-2 px-1">Acumulado</th>
                    <th className="text-right py-2 px-1">Equity</th>
                  </tr>
                </thead>
                <tbody>
                  {simB.map(r => (
                    <tr key={r.month} className={`border-b border-neutral-800/50 ${r.paybackReached ? "" : "text-neutral-400"}`}>
                      <td className="py-1.5 px-1 font-medium">M{r.month}</td>
                      <td className="text-right px-1">{r.fleet}</td>
                      <td className="text-right px-1">{pct(r.utilization)}</td>
                      <td className="text-right px-1 font-mono">${r.avgDailyRate.toFixed(0)}</td>
                      <td className="text-right px-1 font-mono">{fmt(r.grossRevenue)}</td>
                      <td className="text-right px-1 font-mono text-red-400">{fmt(r.totalCosts)}</td>
                      <td className={`text-right px-1 font-mono ${r.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(r.netProfit)}</td>
                      <td className="text-right px-1">{pct(r.marginPct)}</td>
                      <td className="text-right px-1 font-mono">{fmt(r.cumulativeProfit)}</td>
                      <td className="text-right px-1 font-mono text-amber-400">{fmt(r.equity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* AUDIT TAB */}
        {activeTab === "audit" && (
          <>
            {/* Radar Chart */}
            <SectionTitle>Radar Comparativo — 10 Critérios Ponderados</SectionTitle>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="criterion" tick={{ fill: "#aaa", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#666", fontSize: 10 }} />
                  <Radar name="Cenário A" dataKey="Cenário A" stroke="#3b82f6" fill="#3b82f644" fillOpacity={0.4} />
                  <Radar name="Cenário B" dataKey="Cenário B" stroke="#10b981" fill="#10b98144" fillOpacity={0.4} />
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <KPI label="Score Total A" value={`${audit.totalWeightedA}/${audit.maxPossible}`} color="text-blue-400" />
              <KPI label="Score Total B" value={`${audit.totalWeightedB}/${audit.maxPossible}`} color="text-emerald-400" />
              <KPI label="Diferença B-A" value={`+${audit.totalWeightedB - audit.totalWeightedA} pts`} sub={`B vence por ${(((audit.totalWeightedB - audit.totalWeightedA) / audit.totalWeightedA) * 100).toFixed(0)}%`} />
            </div>

            {/* Criteria Detail Cards */}
            <SectionTitle>Análise Forense — 10 Critérios Detalhados</SectionTitle>
            <div className="space-y-4 mb-8">
              {audit.criteria.map(c => (
                <div key={c.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-neutral-500">Peso: {c.weight}</span>
                      <span className="text-blue-400">A: {c.scoreA}/10</span>
                      <span className="text-emerald-400">B: {c.scoreB}/10</span>
                      <span className="text-neutral-400">({c.weightedA} vs {c.weightedB} ponderado)</span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <p><span className="text-emerald-400 font-medium">Força:</span> <span className="text-neutral-300">{c.strength}</span></p>
                      <p><span className="text-red-400 font-medium">Fraqueza:</span> <span className="text-neutral-300">{c.weakness}</span></p>
                      <p><span className="text-amber-400 font-medium">Onde Engana:</span> <span className="text-neutral-300">{c.deception}</span></p>
                      <p><span className="text-pink-400 font-medium">Parece Bom Mas Não É:</span> <span className="text-neutral-300">{c.looksGoodButIsnt}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="text-emerald-500 font-medium">Arma Letal:</span> <span className="text-neutral-300">{c.lethalWeapon}</span></p>
                      <p><span className="text-red-500 font-medium">Armadilha:</span> <span className="text-neutral-300">{c.trap}</span></p>
                      <p><span className="text-purple-400 font-medium">Trade-off:</span> <span className="text-neutral-300">{c.tradeoff}</span></p>
                      <p><span className="text-cyan-400 font-medium">Unknown Unknowns:</span></p>
                      <ul className="list-disc list-inside text-neutral-400 text-xs space-y-1">
                        {c.unknownUnknowns.map((uu, i) => <li key={i}>{uu}</li>)}
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">Fonte: {c.source}</p>
                </div>
              ))}
            </div>

            {/* Contradictions */}
            <SectionTitle>Contradições Identificadas</SectionTitle>
            <div className="space-y-3 mb-8">
              {audit.contradictions.map((c, i) => (
                <div key={i} className="bg-red-950/30 border border-red-900/40 rounded-xl p-4 text-sm text-red-200">
                  {c}
                </div>
              ))}
            </div>

            {/* Breakpoints */}
            <SectionTitle>Pontos de Quebra</SectionTitle>
            <div className="space-y-3 mb-8">
              {audit.breakpoints.map((b, i) => (
                <div key={i} className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-4 text-sm text-amber-200">
                  {b}
                </div>
              ))}
            </div>

            {/* Risk Matrix */}
            <SectionTitle>Matriz de Riscos</SectionTitle>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-neutral-500 border-b border-neutral-700">
                    <th className="text-left py-2 px-2">Risco</th>
                    <th className="text-center py-2 px-2">Probabilidade</th>
                    <th className="text-center py-2 px-2">Impacto</th>
                    <th className="text-left py-2 px-2">Mitigação</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.riskMatrix.map((r, i) => (
                    <tr key={i} className="border-b border-neutral-800/50">
                      <td className="py-2 px-2 font-medium">{r.risk}</td>
                      <td className="text-center py-2 px-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          r.probability.includes("Alta") ? "bg-red-900/40 text-red-300" :
                          r.probability.includes("Média") ? "bg-amber-900/40 text-amber-300" :
                          "bg-green-900/40 text-green-300"
                        }`}>{r.probability}</span>
                      </td>
                      <td className="text-center py-2 px-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          r.impact.includes("Catastrófico") || r.impact.includes("Crítico") ? "bg-red-900/40 text-red-300" :
                          r.impact.includes("Alto") ? "bg-amber-900/40 text-amber-300" :
                          "bg-green-900/40 text-green-300"
                        }`}>{r.impact}</span>
                      </td>
                      <td className="py-2 px-2 text-neutral-400">{r.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Verdict */}
            <SectionTitle>Veredito Forense Final</SectionTitle>
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-6 mb-8">
              <pre className="whitespace-pre-wrap text-sm text-emerald-100 font-mono leading-relaxed">{audit.verdict}</pre>
            </div>
          </>
        )}

        {/* CONTRACTS TAB */}
        {activeTab === "contracts" && (
          <>
            <SectionTitle>Gerador de Contratos e Scripts</SectionTitle>

            {/* Admin Contract */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold mb-3 text-emerald-400">Contrato Admin — Template</h3>
              <pre className="whitespace-pre-wrap text-xs text-neutral-300 font-mono bg-neutral-950 rounded-lg p-4 overflow-x-auto">{`CONTRATO DE PRESTAÇÃO DE SERVIÇOS — ADMINISTRADOR DE FROTA

CONTRATANTE: [NOME LLC], registered in Florida
CONTRATADO: [NOME ADMIN]
DATA: ___/___/2026

1. ESCOPO: Gerenciamento operacional da frota de veículos incluindo:
   - Check-in / check-out de veículos
   - Inspeção pré e pós locação (fotos 360°, odômetro, danos)
   - Coordenação de limpeza e manutenção preventiva
   - Atendimento ao cliente (telefone, WhatsApp, e-mail)
   - Gestão de reservas e calendar management
   - Delivery e pickup de veículos em hotéis/Airbnbs/aeroporto

2. REMUNERAÇÃO:
   - 20% da receita bruta mensal
   - Bônus: +2% se occupancy rate ≥ 90% no mês
   - Bônus: +1% se NPS ≥ 4.8 no mês
   - Pagamento: até dia 5 do mês subsequente

3. KPIs OBRIGATÓRIOS (revisão mensal):
   - Occupancy rate ≥ 80%
   - NPS ≥ 4.5
   - Tempo resposta cliente < 15 minutos (horário comercial)
   - Zero danos não reportados
   - Compliance 100% com checklist de inspeção

4. TRIGGER CLAUSE — REVISÃO 21 DIAS:
   - Se occupancy < 65% nos primeiros 21 dias → reunião imediata
   - Se occupancy < 50% em 30 dias → rescisão sem multa
   - Se 2+ claims por negligência → rescisão imediata

5. CONFIDENCIALIDADE: Total sobre dados financeiros, clientes, e operações
6. NON-COMPETE: 12 meses pós-contrato em raio de 50mi de Miami
7. VIGÊNCIA: 6 meses, renovação automática com review trimestral
8. FORO: Miami-Dade County, FL

CONTRATANTE: _________________________  DATA: ___/___/2026
CONTRATADO: _________________________  DATA: ___/___/2026`}</pre>
            </div>

            {/* Insurance Quote Script */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold mb-3 text-blue-400">Script para Brokers de Seguro</h3>
              <pre className="whitespace-pre-wrap text-xs text-neutral-300 font-mono bg-neutral-950 rounded-lg p-4 overflow-x-auto">{`SCRIPT — COTAÇÃO SEGURO FROTA RENTAL

Ligar para: GMI Insurance, Mesa Underwriters, Blake Insurance, Univista Insurance

"Hi, my name is [NAME], I'm starting a car rental company in Miami-Dade.
I need commercial auto insurance for a rental fleet.

Details:
- LLC registered in Florida, new business
- Starting with 2 vehicles: Toyota RAV4 Hybrid 2024/2025
- Off-airport rental, delivery model
- All drivers minimum 25 years old, clean record required
- Telematics installed (Spireon/Zubie)
- Looking for:
  * Liability $1M combined single limit
  * Comprehensive + Collision
  * Uninsured/Underinsured motorist
  * Medical payments
  * Rental reimbursement gap
  * What deductible options are available?

Questions:
1. What's the monthly premium per vehicle?
2. Volume discounts at 5, 10, 25, 50 vehicles?
3. Telematics discount available?
4. Claims process timeline?
5. Policy cancellation terms?
6. Multi-policy discount (umbrella)?
7. Do you cover international tourist drivers (valid foreign license)?

Target: < $450/month per vehicle all-in
If above $500: 'What changes would reduce the premium?'
If above $600: 'Thank you, I'll compare with other quotes.'

ANOTAR: Broker, quote, deductible, coberturas, termos, contato follow-up."
`}</pre>
            </div>

            {/* Partnership Outreach Script */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold mb-3 text-amber-400">Script Parcerias Airbnb/Hotels</h3>
              <pre className="whitespace-pre-wrap text-xs text-neutral-300 font-mono bg-neutral-950 rounded-lg p-4 overflow-x-auto">{`SCRIPT — OUTREACH PARCERIAS (Airbnb Hosts / Hotel Concierges)

SUBJECT: Parceria Rent-a-Car — Comissão 8% por Reserva

ENGLISH VERSION:
"Hi [NAME],

I'm [YOUR NAME] from [COMPANY], a local car rental service in Miami.

We deliver vehicles directly to your guests — no airport lines, no counters.

Partnership offer:
- 8% commission on every booking from your referral
- Guest gets 10% discount vs airport prices
- SUVs & hybrids (Toyota RAV4, etc.)
- Free delivery & pickup at your property
- 24/7 WhatsApp support
- Bilingual service (English/Portuguese)

How it works:
1. Share our booking link or give guests our WhatsApp
2. Guest books using your referral code
3. You receive 8% commission monthly via Zelle/check

No cost to you, no commitment. Just happy guests who need cars.

Interested? Reply or WhatsApp: [NUMBER]"

VERSÃO PORTUGUÊS (para hosts brasileiros):
"Oi [NOME],

Sou [SEU NOME] da [EMPRESA], serviço de aluguel de carros em Miami.

Entregamos o carro na porta do seu hóspede — sem fila, sem aeroporto.

Proposta de parceria:
- 8% de comissão por cada reserva indicada
- Hóspede ganha 10% desconto vs aeroporto
- SUVs e híbridos (RAV4, etc.)
- Entrega e retirada grátis no seu imóvel
- Suporte 24/7 WhatsApp em português
- Aceitamos PIX para brasileiros

Como funciona:
1. Compartilhe nosso link ou WhatsApp com hóspedes
2. Hóspede reserva com seu código
3. Você recebe 8% mensal via Zelle

Zero custo, zero compromisso. Só hóspedes felizes.

Interesse? Responda ou WhatsApp: [NÚMERO]"`}</pre>
            </div>

            {/* LLC Formation Checklist */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold mb-3 text-purple-400">Checklist LLC Formation — Florida</h3>
              <div className="space-y-2 text-sm">
                {[
                  { step: "Sunbiz.org — Articles of Organization LLC ($125)", done: false },
                  { step: "EIN — IRS.gov (grátis, imediato online)", done: false },
                  { step: "Local Business Tax Receipt — Miami-Dade ($50-100)", done: false },
                  { step: "Business bank account (Chase/Bank of America/Mercury)", done: false },
                  { step: "Commercial auto insurance — 3 quotes minimum", done: false },
                  { step: "Operating Agreement (single-member LLC template)", done: false },
                  { step: "Rental agreement template (cliente ← → empresa)", done: false },
                  { step: "Website básico + booking system", done: false },
                  { step: "Google Business Profile setup", done: false },
                  { step: "WhatsApp Business + auto-responses", done: false },
                  { step: "Telematics setup (Spireon/Zubie) nos veículos", done: false },
                  { step: "Conta PriceLabs ou RateGain para dynamic pricing", done: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 text-neutral-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-600 bg-neutral-800" defaultChecked={item.done} />
                    <span>{item.step}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CRONOGRAMA TAB */}
        {activeTab === "cronograma" && (
          <>
            <SectionTitle>Cronograma Realista — 14 Dias para Primeira Receita</SectionTitle>
            <p className="text-sm text-neutral-400 mb-6">
              Cronograma corrigido vs original (7 dias é otimista demais — 14 dias é agressivo mas realista baseado em processing times reais FL).
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  day: "Dia 1",
                  title: "Fundação Legal + Seguro",
                  tasks: [
                    "06:00 — Sunbiz.org: filing LLC online ($125) — processamento 24-48h",
                    "07:00 — IRS.gov: aplicar EIN (imediato se SSN disponível)",
                    "08:00 — Ligar GMI Insurance: quote fleet rental (script acima)",
                    "09:00 — Ligar Mesa Underwriters: quote #2",
                    "10:00 — Ligar Blake Insurance: quote #3",
                    "11:00 — Ligar Univista: quote #4 (fala PT)",
                    "12:00 — Comparar quotes. Se < $450/mês: prosseguir. Se > $600: reavaliar",
                    "14:00 — Pesquisar RAV4 Hybrid dealers Miami (AutoTrader, Cars.com, dealers diretos)",
                    "16:00 — Agendar test drives / inspeções para dia 2-3",
                    "18:00 — Setup Operating Agreement LLC (template + attorney review $200-500)",
                    "20:00 — Registrar domínio + hosting (Vercel/Netlify free tier)",
                  ],
                  status: "critical",
                },
                {
                  day: "Dia 2-3",
                  title: "Aquisição de Veículos + Seguro Ativo",
                  tasks: [
                    "Visitar 3-5 dealers: negociar RAV4 Hybrid (target: $30-33K cash each)",
                    "Inspeção mecânica independente ($100-150 por carro)",
                    "Fechar compra 2 RAV4 Hybrid cash — title transfer inicia (5-10 dias DHSMV)",
                    "Temp tag permite operar imediatamente",
                    "Ativar insurance policy (broker selecionado dia 1)",
                    "Instalar telematics (Spireon: $15-25/mês por veículo)",
                    "Limpeza profissional detailing ($150-200 por carro)",
                    "Fotografar veículos (360° interior/exterior para listings)",
                  ],
                  status: "critical",
                },
                {
                  day: "Dia 4-5",
                  title: "Setup Digital + Primeiras Parcerias",
                  tasks: [
                    "Website live: landing page + booking form + WhatsApp link",
                    "Google Business Profile: setup + verificação (pode levar 5-7 dias)",
                    "WhatsApp Business: setup + auto-responses + catálogo",
                    "Grupos Facebook brasileiros Miami: postar em 20-30 grupos",
                    "Outreach parcerias: 30-50 Airbnb hosts via mensagem direta",
                    "Outreach parcerias: 10-20 concierges de hotéis (email + visita)",
                    "Setup PriceLabs: conectar calendário, configurar regras de pricing",
                    "Criar rental agreement template (attorney review)",
                  ],
                  status: "important",
                },
                {
                  day: "Dia 6-7",
                  title: "Soft Launch",
                  tasks: [
                    "LLC deve estar aprovada (check Sunbiz status)",
                    "Abrir conta bancária business (Chase: EIN + Articles of Org necessários)",
                    "Primeiro listing ativo: website + WhatsApp + grupos FB",
                    "Buscar primeiros 3-5 bookings: pricing agressivo $49-55/dia para reviews",
                    "Meta: 2-3 reservas confirmadas para semana seguinte",
                    "Setup contabilidade (Wave/QuickBooks free tier)",
                    "Documentar SOPs: check-in, check-out, inspeção, limpeza",
                  ],
                  status: "important",
                },
                {
                  day: "Dia 8-10",
                  title: "Primeiras Entregas + Validação",
                  tasks: [
                    "Entregar carros aos primeiros clientes (delivery model)",
                    "Processo completo: contrato, inspeção, fotos, pagamento, entrega",
                    "Coletar feedback imediato (WhatsApp follow-up 24h)",
                    "Ajustar pricing baseado em demand response",
                    "Continuar outreach: +30 parcerias Airbnb",
                    "Google Ads: primeira campanha $20/dia ('car rental Miami delivery')",
                  ],
                  status: "normal",
                },
                {
                  day: "Dia 11-14",
                  title: "Otimização + Métricas",
                  tasks: [
                    "Review métricas: occupancy, revenue, customer satisfaction",
                    "DECISÃO GATE: Se occupancy > 60% → validado, planejar carro #3",
                    "Se occupancy < 40% → diagnosticar (pricing? canais? posicionamento?)",
                    "Admin: se volume justifica, iniciar busca/contrato admin",
                    "Primeira contabilidade completa: receita, custos, margem real",
                    "Ajustar Monte Carlo simulation com dados REAIS (não projeções)",
                    "Setup review collection system (Google Reviews, post-rental email)",
                  ],
                  status: "normal",
                },
              ].map((day) => (
                <div key={day.day} className={`bg-neutral-900/50 border rounded-xl p-5 ${
                  day.status === "critical" ? "border-red-800/40" : day.status === "important" ? "border-amber-800/40" : "border-neutral-800"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      day.status === "critical" ? "bg-red-900/40 text-red-300" : day.status === "important" ? "bg-amber-900/40 text-amber-300" : "bg-neutral-800 text-neutral-300"
                    }`}>{day.day}</span>
                    <h3 className="font-bold">{day.title}</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-neutral-300">
                    {day.tasks.map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-neutral-600 mt-0.5">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Decision Gates */}
            <SectionTitle>Gates de Decisão — Triggers Automáticos</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { gate: "Dia 14", metric: "Occupancy > 60%", action: "VERDE: Prosseguir B nuclear. Planejar carro #3 para dia 30.", color: "emerald" },
                { gate: "Dia 14", metric: "Occupancy 40-60%", action: "AMARELO: Diagnosticar. Ajustar pricing -15%. Dobrar outreach parcerias.", color: "amber" },
                { gate: "Dia 14", metric: "Occupancy < 40%", action: "VERMELHO: Pivotar para Turo. Listar ambos carros. Reavaliar em 30 dias.", color: "red" },
                { gate: "Dia 21", metric: "Insurance claim", action: "Review causa. Se negligência admin: warning formal. Se 2º claim: trigger contratual.", color: "red" },
                { gate: "Dia 30", metric: "Margem > 20%", action: "VERDE: Carro #3 aprovado. Iniciar processo de compra.", color: "emerald" },
                { gate: "Dia 30", metric: "Margem < 10%", action: "VERMELHO: Cortar custos. Renegociar admin. Considerar vender 1 carro.", color: "red" },
              ].map((g, i) => (
                <div key={i} className={`bg-${g.color}-950/20 border border-${g.color}-800/30 rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded bg-${g.color}-900/40 text-${g.color}-300`}>{g.gate}</span>
                    <span className="text-sm font-medium">{g.metric}</span>
                  </div>
                  <p className="text-sm text-neutral-300">{g.action}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="border-t border-neutral-800 pt-6 pb-10 mt-10 text-center text-xs text-neutral-600">
          <p>Miami Rental Nuclear Simulator — Auditoria Forense Completa</p>
          <p className="mt-1">Dados baseados em fontes públicas 2025-2026. Simulação Monte Carlo com {mcRuns.toLocaleString()} iterações.</p>
          <p className="mt-1">Não constitui aconselhamento financeiro, legal ou fiscal. Consulte profissionais licenciados.</p>
        </footer>
      </div>
    </main>
  );
}
