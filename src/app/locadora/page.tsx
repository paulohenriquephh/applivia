"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Stats {
  mean: number;
  median: number;
  p5: number;
  p25: number;
  p75: number;
  p95: number;
  min: number;
  max: number;
  stdev: number;
}

interface SensitivityItem {
  parameter: string;
  base_value: number;
  test_value: number;
  delta: number;
  delta_pct: number;
}

interface MonthlyStats {
  month: number;
  revenue: Stats;
  net_profit: Stats;
  fleet_size: Stats;
  margin_pct: Stats;
  utilization: Stats;
}

interface ScenarioData {
  n_simulations: number;
  months: number;
  final_month_profit: Stats;
  final_month_margin: Stats;
  final_fleet_size: Stats;
  final_equity: Stats;
  cumulative_profit_18mo: Stats;
  payback_months: Stats;
  payback_achieved_pct: number;
  ruin_probability_pct: number;
  monthly_stats: MonthlyStats[];
}

interface ContraThesis {
  thesis: string;
  counter: string;
  severity: string;
}

interface Criterion {
  id: number;
  name: string;
  weight: number;
  description: string;
  why_matters: string;
  conservative_score: number;
  aggressive_score: number;
  conservative_analysis: string;
  aggressive_analysis: string;
  where_deceives: string;
  unknown_unknowns: string[];
}

interface AuditData {
  criteria: Criterion[];
  scores: {
    conservative_weighted: number;
    aggressive_weighted: number;
    winner: string;
  };
  contra_thesis_attacks: ContraThesis[];
  final_verdict: {
    recommendation: string;
    confidence: string;
    critical_corrections: string[];
    realistic_projections: Record<string, string>;
  };
}

interface ReportData {
  meta: {
    simulator_version: string;
    date: string;
    monte_carlo_runs: number;
    months_simulated: number;
    data_sources: string[];
  };
  scenarios: {
    conservative: ScenarioData;
    aggressive: ScenarioData;
  };
  audit: AuditData;
  sensitivity: {
    sensitivities: SensitivityItem[];
  };
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function SeverityBadge({ severity }: { severity: string }) {
  const color = severity.includes("CRÍTICA")
    ? "bg-red-600"
    : severity.includes("ALTA")
      ? "bg-orange-600"
      : severity.includes("MÉDIA")
        ? "bg-yellow-600"
        : "bg-blue-600";
  return (
    <span className={`${color} text-xs font-bold px-2 py-0.5 rounded`}>
      {severity}
    </span>
  );
}

function ScoreBar({
  score,
  max = 10,
  label,
}: {
  score: number;
  max?: number;
  label?: string;
}) {
  const pctWidth = (score / max) * 100;
  const color =
    score >= 7
      ? "bg-emerald-500"
      : score >= 5
        ? "bg-yellow-500"
        : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-neutral-700 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${pctWidth}%` }}
        />
      </div>
      <span className="text-sm font-mono">
        {score}/{max}
      </span>
      {label && <span className="text-xs text-neutral-400">{label}</span>}
    </div>
  );
}

function MiniChart({
  data,
  height = 80,
  color = "#10b981",
}: {
  data: number[];
  height?: number;
  color?: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data.map((d) => (d < 0 ? d : 0)), 0);
  const range = max - min || 1;
  const w = 100 / data.length;

  const points = data
    .map((d, i) => {
      const x = i * w + w / 2;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const zeroY = height - ((0 - min) / range) * height;

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      {min < 0 && (
        <line
          x1="0"
          y1={zeroY}
          x2="100"
          y2={zeroY}
          stroke="#666"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />
      )}
      <polyline fill="none" stroke={color} strokeWidth="1.2" points={points} />
    </svg>
  );
}

function MonthlyTable({ stats, label }: { stats: MonthlyStats[]; label: string }) {
  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-bold mb-3 text-emerald-400">{label}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-neutral-400 border-b border-neutral-700">
            <th className="py-2 text-left">Mês</th>
            <th className="py-2 text-right">Frota</th>
            <th className="py-2 text-right">Receita (med)</th>
            <th className="py-2 text-right">Lucro Líq (med)</th>
            <th className="py-2 text-right">Margem</th>
            <th className="py-2 text-right">P5 Lucro</th>
            <th className="py-2 text-right">P95 Lucro</th>
            <th className="py-2 text-right">Util</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((m) => (
            <tr
              key={m.month}
              className="border-b border-neutral-800 hover:bg-neutral-800/50"
            >
              <td className="py-1.5 font-mono">{m.month}</td>
              <td className="py-1.5 text-right font-mono">
                {m.fleet_size.median.toFixed(0)}
              </td>
              <td className="py-1.5 text-right font-mono text-blue-400">
                {fmt(m.revenue.median)}
              </td>
              <td
                className={`py-1.5 text-right font-mono ${m.net_profit.median >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {fmt(m.net_profit.median)}
              </td>
              <td className="py-1.5 text-right font-mono">
                {pct(m.margin_pct.median)}
              </td>
              <td className="py-1.5 text-right font-mono text-red-400/70">
                {fmt(m.net_profit.p5)}
              </td>
              <td className="py-1.5 text-right font-mono text-emerald-400/70">
                {fmt(m.net_profit.p95)}
              </td>
              <td className="py-1.5 text-right font-mono">
                {pct(m.utilization.median)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LocadoraPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "montecarlo" | "audit" | "contra" | "sensitivity" | "sources"
  >("overview");
  const [activeScenario, setActiveScenario] = useState<
    "aggressive" | "conservative"
  >("aggressive");

  const loadData = useCallback(async (regen = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = regen
        ? await fetch("/api/locadora", { method: "POST" })
        : await fetch("/api/locadora");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
          <p className="text-xl text-neutral-400">
            Rodando Monte Carlo 10.000 iterações...
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            Simulando 18 meses × 2 cenários
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg">
          <p className="text-red-400 text-xl mb-4">Erro ao carregar simulação</p>
          <p className="text-neutral-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => loadData(true)}
            className="px-6 py-2 bg-emerald-600 rounded hover:bg-emerald-500 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  const audit = data.audit;
  const scenario = data.scenarios[activeScenario];
  const tabs = [
    { id: "overview" as const, label: "Visão Geral" },
    { id: "montecarlo" as const, label: "Monte Carlo" },
    { id: "audit" as const, label: "Auditoria Forense" },
    { id: "contra" as const, label: "Contra-Teses" },
    { id: "sensitivity" as const, label: "Sensibilidade" },
    { id: "sources" as const, label: "Fontes" },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="text-neutral-500 hover:text-white transition-colors text-sm"
            >
              Fundação
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-emerald-400 text-sm">Locadora Miami</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Simulador Forense — Locadora Miami 2026
          </h1>
          <p className="text-neutral-400">
            Monte Carlo {data.meta.monte_carlo_runs.toLocaleString()} iterações |{" "}
            {data.meta.months_simulated} meses | Auditoria nível forense |{" "}
            {data.meta.data_sources.length} fontes primárias
          </p>
        </div>

        {/* Verdict Banner */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-700/30 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                Veredito Forense
              </p>
              <p className="text-xl font-bold">
                {audit.final_verdict.recommendation}
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                {audit.final_verdict.confidence}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">
                  {audit.scores.conservative_weighted}
                </p>
                <p className="text-xs text-neutral-500">Conservador</p>
              </div>
              <div className="text-neutral-600 text-2xl self-center">vs</div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">
                  {audit.scores.aggressive_weighted}
                </p>
                <p className="text-xs text-neutral-500">Agressivo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Corrections */}
        <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-5 mb-8">
          <h2 className="text-red-400 font-bold mb-3 text-sm uppercase tracking-wider">
            Correções Críticas (Anti-Alucinação)
          </h2>
          <ul className="space-y-2">
            {audit.final_verdict.critical_corrections.map((c, i) => (
              <li key={i} className="text-sm text-neutral-300 flex gap-2">
                <span className="text-red-500 shrink-0">!!</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto border-b border-neutral-800 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-neutral-800 text-white border-b-2 border-emerald-500"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Lucro Cumulativo 18mo (B)",
                  value: fmt(
                    data.scenarios.aggressive.cumulative_profit_18mo.median
                  ),
                  sub: `P5: ${fmt(data.scenarios.aggressive.cumulative_profit_18mo.p5)} | P95: ${fmt(data.scenarios.aggressive.cumulative_profit_18mo.p95)}`,
                  color: "text-emerald-400",
                },
                {
                  label: "Payback (B)",
                  value: `${data.scenarios.aggressive.payback_months.median.toFixed(0)} meses`,
                  sub: `${data.scenarios.aggressive.payback_achieved_pct}% alcançaram`,
                  color: "text-blue-400",
                },
                {
                  label: "Equity Frota (B)",
                  value: fmt(data.scenarios.aggressive.final_equity.median),
                  sub: `Min: ${fmt(data.scenarios.aggressive.final_equity.min)} | Max: ${fmt(data.scenarios.aggressive.final_equity.max)}`,
                  color: "text-purple-400",
                },
                {
                  label: "P(Ruína) (B)",
                  value: pct(data.scenarios.aggressive.ruin_probability_pct),
                  sub: "3+ meses negativos consecutivos",
                  color:
                    data.scenarios.aggressive.ruin_probability_pct > 10
                      ? "text-red-400"
                      : "text-emerald-400",
                },
              ].map((kpi, i) => (
                <div key={i} className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                  <p className="text-xs text-neutral-500 mb-1">{kpi.label}</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>
                    {kpi.value}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Side by Side Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
                <h3 className="font-bold text-blue-400 mb-4">
                  A: Conservador
                </h3>
                <dl className="space-y-3 text-sm">
                  {[
                    [
                      "Lucro cumulativo",
                      fmt(
                        data.scenarios.conservative.cumulative_profit_18mo
                          .median
                      ),
                    ],
                    [
                      "Frota final",
                      `${data.scenarios.conservative.final_fleet_size.median.toFixed(0)} carros`,
                    ],
                    [
                      "Payback",
                      `${data.scenarios.conservative.payback_months.median.toFixed(0)} meses`,
                    ],
                    [
                      "Equity",
                      fmt(data.scenarios.conservative.final_equity.median),
                    ],
                    [
                      "P(Ruína)",
                      pct(data.scenarios.conservative.ruin_probability_pct),
                    ],
                    [
                      "Margem final",
                      pct(
                        data.scenarios.conservative.final_month_margin.median
                      ),
                    ],
                  ].map(([k, v], i) => (
                    <div key={i} className="flex justify-between">
                      <dt className="text-neutral-400">{k}</dt>
                      <dd className="font-mono">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="bg-neutral-900 rounded-lg p-5 border border-emerald-800/30">
                <h3 className="font-bold text-emerald-400 mb-4">
                  B: Agressivo
                </h3>
                <dl className="space-y-3 text-sm">
                  {[
                    [
                      "Lucro cumulativo",
                      fmt(
                        data.scenarios.aggressive.cumulative_profit_18mo.median
                      ),
                    ],
                    [
                      "Frota final",
                      `${data.scenarios.aggressive.final_fleet_size.median.toFixed(0)} carros`,
                    ],
                    [
                      "Payback",
                      `${data.scenarios.aggressive.payback_months.median.toFixed(0)} meses`,
                    ],
                    [
                      "Equity",
                      fmt(data.scenarios.aggressive.final_equity.median),
                    ],
                    [
                      "P(Ruína)",
                      pct(data.scenarios.aggressive.ruin_probability_pct),
                    ],
                    [
                      "Margem final",
                      pct(data.scenarios.aggressive.final_month_margin.median),
                    ],
                  ].map(([k, v], i) => (
                    <div key={i} className="flex justify-between">
                      <dt className="text-neutral-400">{k}</dt>
                      <dd className="font-mono">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Realistic Projections */}
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="font-bold text-yellow-400 mb-4">
                Projeções Realistas (Calibradas com Dados Reais)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(
                  audit.final_verdict.realistic_projections
                ).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-neutral-800"
                  >
                    <span className="text-neutral-400 text-sm">
                      {k.replace(/_/g, " ")}
                    </span>
                    <span className="font-mono text-sm">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profit Trajectory Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
                <h3 className="text-sm text-neutral-400 mb-2">
                  Lucro Mensal — Conservador (mediana)
                </h3>
                <MiniChart
                  data={data.scenarios.conservative.monthly_stats.map(
                    (m) => m.net_profit.median
                  )}
                  color="#60a5fa"
                  height={60}
                />
              </div>
              <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
                <h3 className="text-sm text-neutral-400 mb-2">
                  Lucro Mensal — Agressivo (mediana)
                </h3>
                <MiniChart
                  data={data.scenarios.aggressive.monthly_stats.map(
                    (m) => m.net_profit.median
                  )}
                  color="#10b981"
                  height={60}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "montecarlo" && (
          <div className="space-y-6">
            {/* Scenario Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveScenario("aggressive")}
                className={`px-4 py-2 rounded text-sm ${activeScenario === "aggressive" ? "bg-emerald-700" : "bg-neutral-800"}`}
              >
                B: Agressivo
              </button>
              <button
                onClick={() => setActiveScenario("conservative")}
                className={`px-4 py-2 rounded text-sm ${activeScenario === "conservative" ? "bg-blue-700" : "bg-neutral-800"}`}
              >
                A: Conservador
              </button>
            </div>

            {/* Distribution Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Lucro Final (mês 18)",
                  stats: scenario.final_month_profit,
                },
                { label: "Cumulativo 18mo", stats: scenario.cumulative_profit_18mo },
                { label: "Equity Final", stats: scenario.final_equity },
                { label: "Margem Final (%)", stats: scenario.final_month_margin },
                { label: "Frota Final", stats: scenario.final_fleet_size },
                { label: "Payback (meses)", stats: scenario.payback_months },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 rounded-lg p-4 border border-neutral-800"
                >
                  <p className="text-xs text-neutral-500 mb-2">{item.label}</p>
                  <p className="text-lg font-bold text-white mb-2">
                    {item.label.includes("%") || item.label.includes("meses") || item.label.includes("Frota")
                      ? item.stats.median.toFixed(1)
                      : fmt(item.stats.median)}
                  </p>
                  <div className="text-xs text-neutral-500 space-y-1">
                    <div className="flex justify-between">
                      <span>P5</span>
                      <span className="font-mono text-red-400/70">
                        {item.label.includes("%") || item.label.includes("meses") || item.label.includes("Frota")
                          ? item.stats.p5.toFixed(1)
                          : fmt(item.stats.p5)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>P25</span>
                      <span className="font-mono">
                        {item.label.includes("%") || item.label.includes("meses") || item.label.includes("Frota")
                          ? item.stats.p25.toFixed(1)
                          : fmt(item.stats.p25)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>P75</span>
                      <span className="font-mono">
                        {item.label.includes("%") || item.label.includes("meses") || item.label.includes("Frota")
                          ? item.stats.p75.toFixed(1)
                          : fmt(item.stats.p75)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>P95</span>
                      <span className="font-mono text-emerald-400/70">
                        {item.label.includes("%") || item.label.includes("meses") || item.label.includes("Frota")
                          ? item.stats.p95.toFixed(1)
                          : fmt(item.stats.p95)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Table */}
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <MonthlyTable
                stats={scenario.monthly_stats}
                label={
                  activeScenario === "aggressive"
                    ? "Projeção Mensal — B: Agressivo (10K runs)"
                    : "Projeção Mensal — A: Conservador (10K runs)"
                }
              />
            </div>

            {/* Fleet Growth Chart */}
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="text-sm text-neutral-400 mb-2">
                Crescimento da Frota (mediana)
              </h3>
              <MiniChart
                data={scenario.monthly_stats.map(
                  (m) => m.fleet_size.median
                )}
                color="#a78bfa"
                height={60}
              />
            </div>

            {/* Revenue Chart */}
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="text-sm text-neutral-400 mb-2">
                Receita Mensal (mediana)
              </h3>
              <MiniChart
                data={scenario.monthly_stats.map(
                  (m) => m.revenue.median
                )}
                color="#38bdf8"
                height={60}
              />
            </div>

            <button
              onClick={() => loadData(true)}
              className="px-6 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors text-sm"
            >
              Re-rodar Monte Carlo (10K iterações)
            </button>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="font-bold mb-4">
                10 Critérios Ponderados — Auditoria Forense
              </h3>
              <div className="space-y-6">
                {audit.criteria.map((c) => (
                  <div
                    key={c.id}
                    className="border-b border-neutral-800 pb-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {c.id}. {c.name}
                          <span className="text-neutral-500 text-xs ml-2">
                            peso {c.weight}
                          </span>
                        </h4>
                        <p className="text-sm text-neutral-400 mt-1">
                          {c.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-blue-400 mb-1">
                          Conservador
                        </p>
                        <ScoreBar score={c.conservative_score} />
                        <p className="text-xs text-neutral-500 mt-1">
                          {c.conservative_analysis}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-400 mb-1">
                          Agressivo
                        </p>
                        <ScoreBar score={c.aggressive_score} />
                        <p className="text-xs text-neutral-500 mt-1">
                          {c.aggressive_analysis}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-neutral-500">
                        <span className="text-yellow-500 font-semibold">
                          Por que importa:
                        </span>{" "}
                        {c.why_matters}
                      </p>
                      <p className="text-xs text-neutral-500">
                        <span className="text-red-500 font-semibold">
                          Onde engana:
                        </span>{" "}
                        {c.where_deceives}
                      </p>
                      <div className="text-xs text-neutral-500">
                        <span className="text-purple-400 font-semibold">
                          Unknown Unknowns:
                        </span>
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                          {c.unknown_unknowns.map((u, i) => (
                            <li key={i}>{u}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contra" && (
          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="font-bold mb-4">
                Ataque à Própria Tese — Contra-Argumentos
              </h3>
              <div className="space-y-5">
                {audit.contra_thesis_attacks.map((ct, i) => (
                  <div
                    key={i}
                    className="border-b border-neutral-800 pb-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityBadge severity={ct.severity} />
                      <p className="font-semibold text-sm">{ct.thesis}</p>
                    </div>
                    <p className="text-sm text-neutral-400">{ct.counter}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sensitivity" && data.sensitivity && (
          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="font-bold mb-4">
                Análise de Sensibilidade — O Que Mais Impacta o Resultado
              </h3>
              <p className="text-sm text-neutral-400 mb-4">
                Impacto de cada variável no lucro cumulativo de 18 meses (cenário base)
              </p>
              <div className="space-y-3">
                {data.sensitivity.sensitivities.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-2 border-b border-neutral-800"
                  >
                    <span className="text-sm text-neutral-300 w-56 shrink-0">
                      {s.parameter}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-full bg-neutral-700 rounded-full h-3 relative">
                        <div
                          className={`h-3 rounded-full ${s.delta >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                          style={{
                            width: `${Math.min(100, Math.abs(s.delta_pct))}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-sm font-mono shrink-0 w-24 text-right ${s.delta >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {s.delta >= 0 ? "+" : ""}
                        {fmt(s.delta)}
                      </span>
                      <span
                        className={`text-xs font-mono shrink-0 w-16 text-right ${s.delta >= 0 ? "text-emerald-400/70" : "text-red-400/70"}`}
                      >
                        {s.delta >= 0 ? "+" : ""}
                        {s.delta_pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sources" && (
          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="font-bold mb-4">Fontes Primárias Calibradas</h3>
              <ul className="space-y-2">
                {data.meta.data_sources.map((src, i) => (
                  <li
                    key={i}
                    className="text-sm text-neutral-400 flex gap-2"
                  >
                    <span className="text-emerald-500">{i + 1}.</span>
                    {src}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="font-bold mb-4">Parâmetros do Modelo</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {[
                  ["RAV4 Hybrid LE MSRP", "$34,750 (KBB 2026)"],
                  ["Seguro comercial/mês", "$200-450 (Logrock 2026)"],
                  ["Utilização benchmark", "65-80% (GetHapn 2026)"],
                  ["Tarifa diária off-airport", "$55-120 (RealTravelCost)"],
                  ["Depreciação RAV4 Hybrid", "~5%/ano (iSeeCars)"],
                  ["LLC FL formação", "$125 (Sunbiz)"],
                  ["FL state income tax", "0%"],
                  ["Federal tax rate", "22% + SE 15.3%"],
                  ["Admin comissão", "20-30%"],
                  ["Parcerias booking %", "5-25%"],
                ].map(([k, v], i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-neutral-800">
                    <span className="text-neutral-400">{k}</span>
                    <span className="font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-lg p-5 border border-neutral-800">
              <h3 className="font-bold mb-3">Metodologia</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>1. Monte Carlo com 10.000 iterações por cenário</li>
                <li>2. Distribuições normais para utilização e tarifa com sazonalidade Miami</li>
                <li>3. Impostos federais reais (22% income + 15.3% SE tax)</li>
                <li>4. Depreciação baseada em dados reais iSeeCars/KBB</li>
                <li>5. Seguro baseado em quotes reais FL 2026</li>
                <li>6. Scaling com reinvestimento + financing após mês 5</li>
                <li>7. Mix de frota dinâmico (economy → luxury após mês 4)</li>
                <li>8. Sazonalidade Miami (picos jan-mar, jun-jul, nov-dez)</li>
                <li>9. Contra-tese atacando cada premissa antes de concluir</li>
                <li>10. Unknown unknowns identificados por critério</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-600">
          Simulador Forense v{data.meta.simulator_version} | {data.meta.date} |{" "}
          {data.meta.monte_carlo_runs.toLocaleString()} iterações Monte Carlo |
          Zero alucinação — dados calibrados com fontes primárias 2026
        </div>
      </div>
    </main>
  );
}
