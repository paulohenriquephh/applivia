"use client";

import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart,
} from "recharts";
import type { MonthResult } from "@/lib/simulation-engine";
import type { CriterionScore } from "@/lib/forensic-audit";

const fmt = (v: number) => {
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
};

const fmtTooltip = (v: unknown) => fmt(Number(v ?? 0));
const pctTooltip = (v: unknown) => `${Number(v ?? 0)}%`;

export function ProfitChart({ dataA, dataB, dataStress }: { dataA: MonthResult[]; dataB: MonthResult[]; dataStress: MonthResult[] }) {
  const merged = dataB.map((b, i) => ({
    month: `M${b.month}`,
    "B — Nuclear": b.cumulativeProfit,
    "A — Conservador": dataA[i]?.cumulativeProfit ?? 0,
    "Stress Test": dataStress[i]?.cumulativeProfit ?? 0,
  }));

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-emerald-400">Lucro Acumulado — 18 Meses</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={merged}>
          <defs>
            <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorS" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#888" fontSize={12} />
          <YAxis tickFormatter={fmt} stroke="#888" fontSize={12} />
          <Tooltip formatter={fmtTooltip} contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
          <Legend />
          <Area type="monotone" dataKey="B — Nuclear" stroke="#10b981" fill="url(#colorB)" strokeWidth={2} />
          <Area type="monotone" dataKey="A — Conservador" stroke="#6366f1" fill="url(#colorA)" strokeWidth={2} />
          <Area type="monotone" dataKey="Stress Test" stroke="#f59e0b" fill="url(#colorS)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FleetGrowthChart({ dataA, dataB, dataStress }: { dataA: MonthResult[]; dataB: MonthResult[]; dataStress: MonthResult[] }) {
  const merged = dataB.map((b, i) => ({
    month: `M${b.month}`,
    "B — Frota Total": b.totalFleet,
    "B — Luxury": b.luxuryFleet,
    "A — Frota": dataA[i]?.totalFleet ?? 0,
    "Stress — Frota": dataStress[i]?.totalFleet ?? 0,
  }));

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-blue-400">Crescimento da Frota</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={merged}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
          <Legend />
          <Bar dataKey="B — Luxury" fill="#a855f7" stackId="b" />
          <Line type="monotone" dataKey="B — Frota Total" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="A — Frota" stroke="#6366f1" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          <Line type="monotone" dataKey="Stress — Frota" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="3 3" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MarginUtilChart({ data }: { data: MonthResult[] }) {
  const chartData = data.map(d => ({
    month: `M${d.month}`,
    "Margem %": +(d.margin * 100).toFixed(1),
    "Utilização %": +(d.utilization * 100).toFixed(1),
    "ROI %": +(d.roi * 100).toFixed(1),
  }));

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-amber-400">Margem / Utilização / ROI — Cenário B</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#888" fontSize={12} />
          <YAxis tickFormatter={(v: unknown) => `${v}%`} stroke="#888" fontSize={12} />
          <Tooltip formatter={pctTooltip} contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="Margem %" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="Utilização %" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="ROI %" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CostBreakdownChart({ data }: { data: MonthResult[] }) {
  const chartData = data.map(d => ({
    month: `M${d.month}`,
    Insurance: d.insuranceCost,
    Admin: d.adminCost,
    Manutenção: d.maintenanceCost,
    Marketing: d.marketingCost,
    Claims: d.claimsCost,
  }));

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-red-400">Breakdown de Custos — Cenário B</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#888" fontSize={12} />
          <YAxis tickFormatter={fmt} stroke="#888" fontSize={12} />
          <Tooltip formatter={fmtTooltip} contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
          <Legend />
          <Bar dataKey="Insurance" fill="#ef4444" stackId="costs" />
          <Bar dataKey="Admin" fill="#f59e0b" stackId="costs" />
          <Bar dataKey="Manutenção" fill="#6366f1" stackId="costs" />
          <Bar dataKey="Marketing" fill="#8b5cf6" stackId="costs" />
          <Bar dataKey="Claims" fill="#dc2626" stackId="costs" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueSourceChart({ data }: { data: MonthResult[] }) {
  const chartData = data.map(d => ({
    month: `M${d.month}`,
    "Standard": d.standardRevenue,
    "Luxury": d.luxuryRevenue,
    "Parcerias": d.partnershipRevenue,
  }));

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-purple-400">Fontes de Receita — Cenário B</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#888" fontSize={12} />
          <YAxis tickFormatter={fmt} stroke="#888" fontSize={12} />
          <Tooltip formatter={fmtTooltip} contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
          <Legend />
          <Area type="monotone" dataKey="Standard" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.3} stackId="rev" />
          <Area type="monotone" dataKey="Luxury" fill="#a855f7" stroke="#a855f7" fillOpacity={0.3} stackId="rev" />
          <Area type="monotone" dataKey="Parcerias" fill="#10b981" stroke="#10b981" fillOpacity={0.3} stackId="rev" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RadarCompareChart({ criteria }: { criteria: CriterionScore[] }) {
  const chartData = criteria.map(c => ({
    criterion: c.name.length > 20 ? c.name.slice(0, 18) + "…" : c.name,
    "B — Nuclear": c.scoreB,
    "A — Conservador": c.scoreA,
    "Stress": c.scoreStress,
  }));

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-cyan-400">Radar — 10 Critérios Forenses</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="criterion" stroke="#888" fontSize={10} />
          <PolarRadiusAxis domain={[0, 10]} stroke="#555" fontSize={10} />
          <Radar name="B — Nuclear" dataKey="B — Nuclear" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          <Radar name="A — Conservador" dataKey="A — Conservador" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
          <Radar name="Stress" dataKey="Stress" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EquityChart({ dataA, dataB, dataStress }: { dataA: MonthResult[]; dataB: MonthResult[]; dataStress: MonthResult[] }) {
  const merged = dataB.map((b, i) => ({
    month: `M${b.month}`,
    "B — Equity": b.equity,
    "A — Equity": dataA[i]?.equity ?? 0,
    "Stress — Equity": dataStress[i]?.equity ?? 0,
  }));

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-yellow-400">Equity da Frota (Valor de Revenda)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={merged}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#888" fontSize={12} />
          <YAxis tickFormatter={fmt} stroke="#888" fontSize={12} />
          <Tooltip formatter={fmtTooltip} contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
          <Legend />
          <Area type="monotone" dataKey="B — Equity" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
          <Area type="monotone" dataKey="A — Equity" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
          <Area type="monotone" dataKey="Stress — Equity" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonteCarloDistribution({ profits }: { profits: number[] }) {
  const sorted = [...profits].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const binCount = 30;
  const binWidth = (max - min) / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => {
    const lo = min + i * binWidth;
    const hi = lo + binWidth;
    const count = sorted.filter(p => p >= lo && (i === binCount - 1 ? p <= hi : p < hi)).length;
    return {
      range: fmt(lo + binWidth / 2),
      count,
      label: `${fmt(lo)} — ${fmt(hi)}`,
    };
  });

  return (
    <div className="bg-neutral-800/50 backdrop-blur rounded-xl p-6 border border-neutral-700/50">
      <h3 className="text-lg font-semibold mb-4 text-teal-400">Distribuição Monte Carlo — {profits.length} Runs</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={bins}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="range" stroke="#888" fontSize={9} interval={4} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip
            contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
            labelFormatter={(_: unknown, payload: ReadonlyArray<{ payload?: { label?: string } }>) => payload?.[0]?.payload?.label ?? ""}
          />
          <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
