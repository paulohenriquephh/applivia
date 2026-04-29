"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  runMonteCarlo,
  SCENARIO_A,
  SCENARIO_B,
  SCENARIO_STRESS,
} from "@/lib/simulation-engine";
import { runForensicAudit } from "@/lib/forensic-audit";
import {
  generateLaunchChecklist,
  generatePartnershipScripts,
  generateContractClauses,
  generateGuardrails,
} from "@/lib/generators";
import {
  ProfitChart,
  FleetGrowthChart,
  MarginUtilChart,
  CostBreakdownChart,
  RevenueSourceChart,
  RadarCompareChart,
  EquityChart,
  MonteCarloDistribution,
} from "./components/Charts";

const fmt = (v: number) => {
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
};

type Tab = "overview" | "simulation" | "audit" | "checklist" | "contracts" | "partnerships" | "guardrails";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "simulation", label: "Monte Carlo" },
  { id: "audit", label: "Auditoria Forense" },
  { id: "checklist", label: "Checklist 7 Dias" },
  { id: "contracts", label: "Contratos" },
  { id: "partnerships", label: "Parcerias" },
  { id: "guardrails", label: "Guardrails" },
];

export default function LocadoraPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [mcRuns, setMcRuns] = useState(1000);

  const resultsA = useMemo(() => runMonteCarlo(SCENARIO_A, mcRuns), [mcRuns]);
  const resultsB = useMemo(() => runMonteCarlo(SCENARIO_B, mcRuns), [mcRuns]);
  const resultsStress = useMemo(() => runMonteCarlo(SCENARIO_STRESS, mcRuns), [mcRuns]);
  const audit = useMemo(() => runForensicAudit(), []);
  const checklist = useMemo(() => generateLaunchChecklist(), []);
  const scripts = useMemo(() => generatePartnershipScripts(), []);
  const clauses = useMemo(() => generateContractClauses(), []);
  const guardrails = useMemo(() => generateGuardrails(), []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Locadora Miami 2026
            </h1>
            <p className="text-neutral-400 mt-1 text-sm sm:text-base">
              Simulador Nuclear &bull; Monte Carlo {mcRuns} runs &bull; Auditoria Forense 10 Critérios
            </p>
          </div>
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors text-sm shrink-0">
            ← Voltar
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-neutral-800/50 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-700/50 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            resultsA={resultsA}
            resultsB={resultsB}
            resultsStress={resultsStress}
            audit={audit}
          />
        )}
        {activeTab === "simulation" && (
          <SimulationTab
            resultsA={resultsA}
            resultsB={resultsB}
            resultsStress={resultsStress}
            mcRuns={mcRuns}
            setMcRuns={setMcRuns}
          />
        )}
        {activeTab === "audit" && <AuditTab audit={audit} />}
        {activeTab === "checklist" && <ChecklistTab items={checklist} />}
        {activeTab === "contracts" && <ContractsTab clauses={clauses} />}
        {activeTab === "partnerships" && <PartnershipsTab scripts={scripts} />}
        {activeTab === "guardrails" && <GuardrailsTab guardrails={guardrails} />}
      </div>
    </main>
  );
}

function StatCard({ label, value, sub, color = "emerald" }: { label: string; value: string; sub?: string; color?: string }) {
  const colors: Record<string, string> = {
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400",
    red: "from-red-500/10 to-red-500/5 border-red-500/20 text-red-400",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400",
    teal: "from-teal-500/10 to-teal-500/5 border-teal-500/20 text-teal-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <p className="text-xs text-neutral-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colors[color].split(" ").pop()}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
    </div>
  );
}

function OverviewTab({ resultsA, resultsB, resultsStress, audit }: {
  resultsA: ReturnType<typeof runMonteCarlo>;
  resultsB: ReturnType<typeof runMonteCarlo>;
  resultsStress: ReturnType<typeof runMonteCarlo>;
  audit: ReturnType<typeof runForensicAudit>;
}) {
  const b = resultsB.stats;
  const a = resultsA.stats;
  const s = resultsStress.stats;

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Lucro B 18m (média)" value={fmt(b.meanProfit)} sub={`σ ${fmt(b.stdProfit)}`} color="emerald" />
        <StatCard label="Payback Médio" value={`${b.meanPayback.toFixed(1)} meses`} sub="Cenário B" color="blue" />
        <StatCard label="Equity Frota" value={fmt(b.meanEquity)} sub="Valor revenda M18" color="purple" />
        <StatCard label="Margem Final" value={`${(b.meanMargin * 100).toFixed(1)}%`} sub="Cenário B M18" color="teal" />
        <StatCard label="ROI Médio" value={`${(b.meanROI * 100).toFixed(0)}%`} sub="Sobre investimento total" color="amber" />
        <StatCard label="Runs Lucrativas" value={`${b.profitableRunsPct.toFixed(0)}%`} sub={`de ${resultsB.runs.length} runs`} color="emerald" />
      </div>

      {/* Comparison Table */}
      <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Comparativo A vs B vs Stress (Monte Carlo)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-700">
              <th className="text-left py-2 pr-4">Métrica</th>
              <th className="text-right py-2 px-3">A — Conservador</th>
              <th className="text-right py-2 px-3">B — Nuclear</th>
              <th className="text-right py-2 px-3">Stress</th>
              <th className="text-right py-2 pl-3">B vs A</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            <tr className="border-b border-neutral-700/50">
              <td className="py-2 pr-4">Lucro 18m (média)</td>
              <td className="text-right px-3">{fmt(a.meanProfit)}</td>
              <td className="text-right px-3 text-emerald-400 font-semibold">{fmt(b.meanProfit)}</td>
              <td className="text-right px-3 text-amber-400">{fmt(s.meanProfit)}</td>
              <td className="text-right pl-3 text-emerald-400">+{((b.meanProfit / Math.max(a.meanProfit, 1) - 1) * 100).toFixed(0)}%</td>
            </tr>
            <tr className="border-b border-neutral-700/50">
              <td className="py-2 pr-4">Payback (meses)</td>
              <td className="text-right px-3">{a.meanPayback.toFixed(1)}</td>
              <td className="text-right px-3 text-emerald-400 font-semibold">{b.meanPayback.toFixed(1)}</td>
              <td className="text-right px-3 text-amber-400">{s.meanPayback.toFixed(1)}</td>
              <td className="text-right pl-3 text-emerald-400">{(a.meanPayback - b.meanPayback).toFixed(1)}m mais rápido</td>
            </tr>
            <tr className="border-b border-neutral-700/50">
              <td className="py-2 pr-4">Equity M18</td>
              <td className="text-right px-3">{fmt(a.meanEquity)}</td>
              <td className="text-right px-3 text-emerald-400 font-semibold">{fmt(b.meanEquity)}</td>
              <td className="text-right px-3 text-amber-400">{fmt(s.meanEquity)}</td>
              <td className="text-right pl-3 text-emerald-400">+{((b.meanEquity / Math.max(a.meanEquity, 1) - 1) * 100).toFixed(0)}%</td>
            </tr>
            <tr className="border-b border-neutral-700/50">
              <td className="py-2 pr-4">Margem Final</td>
              <td className="text-right px-3">{(a.meanMargin * 100).toFixed(1)}%</td>
              <td className="text-right px-3 text-emerald-400 font-semibold">{(b.meanMargin * 100).toFixed(1)}%</td>
              <td className="text-right px-3 text-amber-400">{(s.meanMargin * 100).toFixed(1)}%</td>
              <td className="text-right pl-3">—</td>
            </tr>
            <tr className="border-b border-neutral-700/50">
              <td className="py-2 pr-4">ROI Total</td>
              <td className="text-right px-3">{(a.meanROI * 100).toFixed(0)}%</td>
              <td className="text-right px-3 text-emerald-400 font-semibold">{(b.meanROI * 100).toFixed(0)}%</td>
              <td className="text-right px-3 text-amber-400">{(s.meanROI * 100).toFixed(0)}%</td>
              <td className="text-right pl-3">—</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Runs Lucrativas</td>
              <td className="text-right px-3">{a.profitableRunsPct.toFixed(0)}%</td>
              <td className="text-right px-3 text-emerald-400 font-semibold">{b.profitableRunsPct.toFixed(0)}%</td>
              <td className="text-right px-3 text-amber-400">{s.profitableRunsPct.toFixed(0)}%</td>
              <td className="text-right pl-3">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ProfitChart
          dataA={resultsA.monthlyAverages}
          dataB={resultsB.monthlyAverages}
          dataStress={resultsStress.monthlyAverages}
        />
        <FleetGrowthChart
          dataA={resultsA.monthlyAverages}
          dataB={resultsB.monthlyAverages}
          dataStress={resultsStress.monthlyAverages}
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <RadarCompareChart criteria={audit.criteria} />
        <EquityChart
          dataA={resultsA.monthlyAverages}
          dataB={resultsB.monthlyAverages}
          dataStress={resultsStress.monthlyAverages}
        />
      </div>

      {/* Verdict */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-emerald-400 mb-3">Veredito Forense</h3>
        <p className="text-neutral-300 text-sm leading-relaxed">{audit.recommendation}</p>
        <p className="text-emerald-400 font-mono text-xs mt-4">{audit.verdict}</p>
      </div>
    </div>
  );
}

function SimulationTab({ resultsA, resultsB, resultsStress, mcRuns, setMcRuns }: {
  resultsA: ReturnType<typeof runMonteCarlo>;
  resultsB: ReturnType<typeof runMonteCarlo>;
  resultsStress: ReturnType<typeof runMonteCarlo>;
  mcRuns: number;
  setMcRuns: (v: number) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
        <h3 className="text-lg font-semibold mb-4">Controles Monte Carlo</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm text-neutral-400">Número de Runs:</label>
          <select
            value={mcRuns}
            onChange={(e) => setMcRuns(Number(e.target.value))}
            className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1,000</option>
            <option value={2000}>2,000</option>
            <option value={5000}>5,000</option>
          </select>
        </div>
      </div>

      {/* Percentiles */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Percentis — Cenário B ({mcRuns} runs)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-700">
              <th className="text-left py-2 pr-4">Percentil</th>
              <th className="text-right py-2 px-3">Lucro 18m</th>
              <th className="text-right py-2 px-3">Payback</th>
              <th className="text-right py-2 px-3">Equity</th>
              <th className="text-right py-2 px-3">Margem</th>
              <th className="text-right py-2 pl-3">Max Drawdown</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            {([
              ["P5 (pessimista)", resultsB.percentiles.p5],
              ["P25", resultsB.percentiles.p25],
              ["P50 (mediana)", resultsB.percentiles.p50],
              ["P75", resultsB.percentiles.p75],
              ["P95 (otimista)", resultsB.percentiles.p95],
            ] as const).map(([label, run]) => (
              <tr key={label} className="border-b border-neutral-700/50">
                <td className="py-2 pr-4">{label}</td>
                <td className="text-right px-3">{fmt(run.totalProfit)}</td>
                <td className="text-right px-3">{run.paybackMonth ?? "N/A"}m</td>
                <td className="text-right px-3">{fmt(run.totalEquity)}</td>
                <td className="text-right px-3">{(run.finalMargin * 100).toFixed(1)}%</td>
                <td className="text-right pl-3">{(run.maxDrawdown * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribution */}
      <MonteCarloDistribution profits={resultsB.runs.map(r => r.totalProfit)} />

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ProfitChart
          dataA={resultsA.monthlyAverages}
          dataB={resultsB.monthlyAverages}
          dataStress={resultsStress.monthlyAverages}
        />
        <MarginUtilChart data={resultsB.monthlyAverages} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <CostBreakdownChart data={resultsB.monthlyAverages} />
        <RevenueSourceChart data={resultsB.monthlyAverages} />
      </div>

      {/* Monthly Table */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Projeção Mensal — Cenário B (Média)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-700">
              <th className="text-left py-2">Mês</th>
              <th className="text-right py-2">Frota</th>
              <th className="text-right py-2">Util%</th>
              <th className="text-right py-2">Rate/dia</th>
              <th className="text-right py-2">Receita</th>
              <th className="text-right py-2">Custos</th>
              <th className="text-right py-2">Lucro</th>
              <th className="text-right py-2">Acumulado</th>
              <th className="text-right py-2">Margem</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            {resultsB.monthlyAverages.map(m => (
              <tr key={m.month} className="border-b border-neutral-700/30">
                <td className="py-1.5">M{m.month}</td>
                <td className="text-right">{m.totalFleet}</td>
                <td className="text-right">{(m.utilization * 100).toFixed(1)}%</td>
                <td className="text-right">${m.dailyRate.toFixed(0)}</td>
                <td className="text-right">{fmt(m.revenue)}</td>
                <td className="text-right text-red-400">{fmt(m.costs)}</td>
                <td className={`text-right ${m.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(m.profit)}</td>
                <td className={`text-right ${m.cumulativeProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(m.cumulativeProfit)}</td>
                <td className="text-right">{(m.margin * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditTab({ audit }: { audit: ReturnType<typeof runForensicAudit> }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* Score Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Score A — Conservador" value={`${audit.totalWeightedA}/${audit.maxPossible}`} sub={`${(audit.totalWeightedA / audit.maxPossible * 100).toFixed(1)}%`} color="blue" />
        <StatCard label="Score B — Nuclear" value={`${audit.totalWeightedB}/${audit.maxPossible}`} sub={`${(audit.totalWeightedB / audit.maxPossible * 100).toFixed(1)}%`} color="emerald" />
        <StatCard label="Score Stress" value={`${audit.totalWeightedStress}/${audit.maxPossible}`} sub={`${(audit.totalWeightedStress / audit.maxPossible * 100).toFixed(1)}%`} color="amber" />
      </div>

      <RadarCompareChart criteria={audit.criteria} />

      {/* Criteria Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">10 Critérios Forenses — Análise Detalhada</h3>
        {audit.criteria.map(c => (
          <div key={c.id} className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-neutral-700 px-2 py-0.5 rounded">peso {c.weight}</span>
                <span className="font-medium">{c.id}. {c.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm shrink-0">
                <span className="text-blue-400">A:{c.scoreA}</span>
                <span className="text-emerald-400">B:{c.scoreB}</span>
                <span className="text-amber-400">S:{c.scoreStress}</span>
                <span className="text-neutral-500">{expandedId === c.id ? "▲" : "▼"}</span>
              </div>
            </button>
            {expandedId === c.id && (
              <div className="px-4 pb-4 space-y-3 text-sm text-neutral-300 border-t border-neutral-700/50 pt-4">
                <div><span className="text-emerald-400 font-medium">Força:</span> {c.strength}</div>
                <div><span className="text-red-400 font-medium">Fraqueza:</span> {c.weakness}</div>
                <div><span className="text-amber-400 font-medium">Onde engana:</span> {c.deception}</div>
                <div><span className="text-orange-400 font-medium">Parece bom mas não é:</span> {c.looksGoodButIsnt}</div>
                <div><span className="text-emerald-400 font-medium">Arma letal quando:</span> {c.lethalWeapon}</div>
                <div><span className="text-red-400 font-medium">Armadilha quando:</span> {c.trap}</div>
                <div>
                  <span className="text-purple-400 font-medium">Unknown unknowns:</span>
                  <ul className="list-disc list-inside ml-2 mt-1 text-neutral-400">
                    {c.unknownUnknowns.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
                <div><span className="text-cyan-400 font-medium">Trade-off:</span> {c.tradeoff}</div>
                <div><span className="text-neutral-500 font-medium">Evidência:</span> {c.evidence}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contradictions */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Contradições Identificadas</h3>
        <ul className="space-y-3 text-sm text-neutral-300">
          {audit.contradictions.map((c, i) => (
            <li key={i} className="flex gap-2"><span className="text-red-400 shrink-0">⚡</span>{c}</li>
          ))}
        </ul>
      </div>

      {/* Analogies */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Analogias Incisivas</h3>
        <ul className="space-y-3 text-sm text-neutral-300">
          {audit.analogies.map((a, i) => (
            <li key={i} className="flex gap-2"><span className="text-purple-400 shrink-0">🎯</span>{a}</li>
          ))}
        </ul>
      </div>

      {/* Breakpoints */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-400 mb-4">Pontos de Quebra (Breakpoints)</h3>
        <ul className="space-y-3 text-sm text-neutral-300">
          {audit.breakpoints.map((b, i) => (
            <li key={i} className="flex gap-2"><span className="text-amber-400 shrink-0">🚨</span>{b}</li>
          ))}
        </ul>
      </div>

      {/* Final Verdict */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-emerald-400 mb-3">Veredito Final</h3>
        <p className="text-neutral-300 text-sm leading-relaxed">{audit.recommendation}</p>
        <p className="text-emerald-400 font-mono text-xs mt-4">{audit.verdict}</p>
      </div>
    </div>
  );
}

function ChecklistTab({ items }: { items: ReturnType<typeof generateLaunchChecklist> }) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(checkedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedItems(next);
  };

  const categoryColors: Record<string, string> = {
    legal: "bg-blue-500/20 text-blue-400",
    insurance: "bg-red-500/20 text-red-400",
    fleet: "bg-emerald-500/20 text-emerald-400",
    marketing: "bg-purple-500/20 text-purple-400",
    ops: "bg-amber-500/20 text-amber-400",
    tech: "bg-cyan-500/20 text-cyan-400",
    finance: "bg-yellow-500/20 text-yellow-400",
  };

  const progress = items.length > 0 ? (checkedItems.size / items.length * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Progresso</h3>
          <span className="text-sm text-neutral-400">{checkedItems.size}/{items.length} ({progress.toFixed(0)}%)</span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items by Day */}
      {[1, 2, 3, 4, 7].map(day => {
        const dayItems = items.filter(i => i.day === day);
        if (dayItems.length === 0) return null;
        return (
          <div key={day} className="space-y-3">
            <h3 className="text-lg font-semibold text-neutral-300">Dia {day}</h3>
            {dayItems.map(item => (
              <div
                key={item.id}
                className={`bg-neutral-800/50 rounded-xl p-4 border transition-all ${
                  checkedItems.has(item.id) ? "border-emerald-500/40 opacity-70" : "border-neutral-700/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      checkedItems.has(item.id)
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    {checkedItems.has(item.id) && <span className="text-white text-xs">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[item.category]}`}>{item.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.priority === "critical" ? "bg-red-500/20 text-red-400" :
                        item.priority === "high" ? "bg-amber-500/20 text-amber-400" :
                        "bg-neutral-700 text-neutral-400"
                      }`}>{item.priority}</span>
                      <span className="text-xs text-neutral-500">{item.hour}</span>
                    </div>
                    <p className={`font-medium text-sm ${checkedItems.has(item.id) ? "line-through text-neutral-500" : ""}`}>
                      {item.task}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">{item.details}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-500">
                      <span>Custo: {item.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ContractsTab({ clauses }: { clauses: ReturnType<typeof generateContractClauses> }) {
  return (
    <div className="space-y-6">
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
        <h3 className="text-lg font-semibold mb-2">Gerador de Contrato — Locação de Veículo FL</h3>
        <p className="text-sm text-neutral-400">Template baseado em FL Statute 559 (Motor Vehicle Rentals) + best practices RAC.</p>
      </div>

      {clauses.map((clause, i) => (
        <div key={i} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700/50">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded ${
              clause.importance === "critical" ? "bg-red-500/20 text-red-400" :
              clause.importance === "high" ? "bg-amber-500/20 text-amber-400" :
              "bg-neutral-700 text-neutral-400"
            }`}>{clause.importance}</span>
            <span className="font-semibold text-sm">{clause.section}</span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">{clause.clause}</p>
          <p className="text-xs text-neutral-500 mt-2 italic">{clause.legalNote}</p>
        </div>
      ))}
    </div>
  );
}

function PartnershipsTab({ scripts }: { scripts: ReturnType<typeof generatePartnershipScripts> }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
        <h3 className="text-lg font-semibold mb-2">Scripts de Parceria — Prontos para Enviar</h3>
        <p className="text-sm text-neutral-400">5 templates otimizados para diferentes canais. Substitua [placeholders] e envie.</p>
      </div>

      {scripts.map((script, i) => (
        <div key={i} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{script.type}</span>
              <span className="text-xs text-neutral-500 ml-2">Comissão: {script.commission}</span>
            </div>
            <button
              onClick={() => copyToClipboard(script.body, i)}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors"
            >
              {copiedIdx === i ? "✓ Copiado!" : "Copiar"}
            </button>
          </div>
          <p className="text-xs text-neutral-400 mb-1"><strong>Target:</strong> {script.target}</p>
          <p className="text-xs text-neutral-400 mb-3"><strong>Subject:</strong> {script.subject}</p>
          <pre className="text-sm text-neutral-300 whitespace-pre-wrap bg-neutral-900/50 rounded-lg p-4 border border-neutral-700/50">
            {script.body}
          </pre>
          <p className="text-xs text-neutral-500 mt-2">Resposta esperada: {script.expectedResponse}</p>
        </div>
      ))}
    </div>
  );
}

function GuardrailsTab({ guardrails }: { guardrails: ReturnType<typeof generateGuardrails> }) {
  return (
    <div className="space-y-6">
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
        <h3 className="text-lg font-semibold mb-2">5 Guardrails Nucleares</h3>
        <p className="text-sm text-neutral-400">Circuit breakers automáticos para proteção da operação. Cada um com trigger mensurável e ação imediata.</p>
      </div>

      {guardrails.map(g => (
        <div key={g.id} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700/50">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 text-red-400 font-bold text-sm">{g.id}</span>
            <h4 className="font-semibold">{g.name}</h4>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-red-400 font-medium">TRIGGER: </span>
              <span className="text-neutral-300">{g.trigger}</span>
            </div>
            <div>
              <span className="text-amber-400 font-medium">AÇÃO: </span>
              <span className="text-neutral-300">{g.action}</span>
            </div>
            <div>
              <span className="text-neutral-500 font-medium">EVIDÊNCIA: </span>
              <span className="text-neutral-400">{g.evidence}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
