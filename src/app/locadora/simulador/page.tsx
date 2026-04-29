"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart,
} from "recharts";
import {
  DEFAULT_PARAMS, runMonteCarlo, formatCurrency, formatPct,
  type SimParams,
} from "@/lib/monte-carlo";

function StatCard({ label, value, sub, color = "text-white" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-neutral-800/80 rounded-lg p-4 border border-neutral-700/50">
      <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
    </div>
  );
}

function ParamInput({ label, value, onChange, min, max, step = 1, suffix = "" }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; suffix?: string;
}) {
  return (
    <div>
      <label className="text-xs text-neutral-400 block mb-1">
        {label}: <span className="text-white font-medium">{value}{suffix}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
    </div>
  );
}

const fmt = (v: number) => formatCurrency(v);
const pct = (v: number) => formatPct(v);

export default function SimuladorPage() {
  const [params, setParams] = useState<SimParams>(DEFAULT_PARAMS);
  const [numRuns, setNumRuns] = useState(10000);
  const [showParams, setShowParams] = useState(false);

  const updateParam = useCallback(<K extends keyof SimParams>(key: K, value: SimParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const result = useMemo(() => runMonteCarlo(params, numRuns), [params, numRuns]);
  const { mean, percentiles, monthlyAverages, probabilityProfitableBy } = result;

  const chartData = monthlyAverages.map((m, i) => ({
    name: `M${m.month}`,
    receita: Math.round(m.revenue),
    custos: Math.round(m.totalCosts),
    lucro: Math.round(m.profit),
    frota: m.fleet,
    util: Math.round(m.utilization * 100),
    margem: Math.round(m.margin * 100),
    acumulado: Math.round(m.cumulativeProfit),
    equity: Math.round(m.equityValue),
    probLucro: Math.round(probabilityProfitableBy[i] * 100),
    insurance: Math.round(m.insuranceCost),
    admin: Math.round(m.adminCost),
    manut: Math.round(m.maintenanceCost),
    claims: Math.round(m.claimsCost),
    mkt: Math.round(m.marketingCost),
  }));

  const distributionData = useMemo(() => {
    const profits = result.runs.map(r => r.totalProfit);
    const min = Math.min(...profits);
    const max = Math.max(...profits);
    const buckets = 40;
    const step = (max - min) / buckets;
    const bins: { range: string; count: number; value: number }[] = [];
    for (let i = 0; i < buckets; i++) {
      const lo = min + i * step;
      const hi = lo + step;
      const count = profits.filter(p => p >= lo && p < hi).length;
      bins.push({
        range: `${fmt(lo)}`,
        count,
        value: lo + step / 2,
      });
    }
    return bins;
  }, [result]);

  const paybackData = useMemo(() => {
    const paybacks = result.runs.map(r => r.paybackMonth).filter(p => p <= params.months);
    const counts: Record<number, number> = {};
    paybacks.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
    return Array.from({ length: params.months }, (_, i) => ({
      month: `M${i + 1}`,
      count: counts[i + 1] || 0,
      pct: Math.round(((counts[i + 1] || 0) / numRuns) * 100),
    }));
  }, [result, params.months, numRuns]);

  const tooltipStyle = {
    contentStyle: { backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: "12px" },
    labelStyle: { color: "#999" },
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/locadora" className="text-neutral-500 hover:text-white text-sm transition-colors">
              &larr; Locadora
            </Link>
            <h1 className="text-3xl font-bold mt-2">Simulador Monte Carlo</h1>
            <p className="text-neutral-400 text-sm mt-1">
              {numRuns.toLocaleString()} simulações &middot; Distribuição probabilística &middot; Dados FL 2026
            </p>
          </div>
          <button
            onClick={() => setShowParams(!showParams)}
            className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-sm transition-colors border border-neutral-700"
          >
            {showParams ? "Ocultar" : "Parâmetros"} ⚙️
          </button>
        </div>

        {showParams && (
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-8">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Ajustar Parâmetros</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ParamInput label="Carros iniciais" value={params.initialCars} onChange={v => updateParam("initialCars", v)} min={1} max={10} />
              <ParamInput label="Meses" value={params.months} onChange={v => updateParam("months", v)} min={6} max={36} />
              <ParamInput label="Target frota" value={params.targetCars} onChange={v => updateParam("targetCars", v)} min={10} max={500} step={10} />
              <ParamInput label="Custo/carro ($K)" value={params.cashPerCar / 1000} onChange={v => updateParam("cashPerCar", v * 1000)} min={15} max={80} suffix="K" />
              <ParamInput label="Rate diária ($)" value={params.avgDailyRate} onChange={v => updateParam("avgDailyRate", v)} min={35} max={150} suffix="" />
              <ParamInput label="Rate growth/mês ($)" value={params.rateGrowthPerMonth} onChange={v => updateParam("rateGrowthPerMonth", v)} min={0} max={5} step={0.5} />
              <ParamInput label="Util base (%)" value={Math.round(params.baseUtilization * 100)} onChange={v => updateParam("baseUtilization", v / 100)} min={50} max={95} suffix="%" />
              <ParamInput label="Util cap (%)" value={Math.round(params.utilizationCap * 100)} onChange={v => updateParam("utilizationCap", v / 100)} min={70} max={98} suffix="%" />
              <ParamInput label="Seguro/carro/mês ($)" value={params.insurancePerCarPerMonth} onChange={v => updateParam("insurancePerCarPerMonth", v)} min={200} max={800} step={10} />
              <ParamInput label="Manutenção/carro ($)" value={params.maintenancePerCarPerMonth} onChange={v => updateParam("maintenancePerCarPerMonth", v)} min={50} max={400} step={10} />
              <ParamInput label="Admin comissão (%)" value={Math.round(params.adminCommissionPct * 100)} onChange={v => updateParam("adminCommissionPct", v / 100)} min={10} max={35} suffix="%" />
              <ParamInput label="Marketing/mês ($)" value={params.marketingPerMonth} onChange={v => updateParam("marketingPerMonth", v)} min={0} max={5000} step={100} />
              <ParamInput label="Claims rate/carro (%)" value={Math.round(params.claimsRatePerCarPerMonth * 100)} onChange={v => updateParam("claimsRatePerCarPerMonth", v / 100)} min={1} max={10} suffix="%" />
              <ParamInput label="Deductible/claim ($)" value={params.deductiblePerClaim} onChange={v => updateParam("deductiblePerClaim", v)} min={500} max={5000} step={250} />
              <ParamInput label="Reinvest (%)" value={Math.round(params.reinvestPct * 100)} onChange={v => updateParam("reinvestPct", v / 100)} min={0} max={100} suffix="%" />
              <ParamInput label="Sazonalidade (%)" value={Math.round(params.seasonalityAmplitude * 100)} onChange={v => updateParam("seasonalityAmplitude", v / 100)} min={0} max={30} suffix="%" />
              <div>
                <label className="text-xs text-neutral-400 block mb-1">
                  Simulações: <span className="text-white font-medium">{numRuns.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={100} max={10000} step={100} value={numRuns}
                  onChange={e => setNumRuns(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard label="Lucro Total (Média)" value={fmt(mean.totalProfit)} sub={`P5: ${fmt(percentiles.p5.totalProfit)}`} color="text-emerald-400" />
          <StatCard label="Receita Total" value={fmt(mean.totalRevenue)} sub={`${params.months} meses`} color="text-blue-400" />
          <StatCard label="Margem Média" value={pct(mean.avgMargin)} sub={`P5: ${pct(percentiles.p5.avgMargin)}`} color={mean.avgMargin > 0.2 ? "text-emerald-400" : "text-amber-400"} />
          <StatCard label="Payback (meses)" value={mean.paybackMonth.toFixed(1)} sub={`P95: ${percentiles.p95.paybackMonth.toFixed(0)}mo`} color="text-cyan-400" />
          <StatCard label="Frota Final" value={Math.round(mean.finalFleet).toString()} sub={`P5: ${percentiles.p5.finalFleet} carros`} color="text-purple-400" />
          <StatCard label="Equity Final" value={fmt(mean.finalEquity)} sub={`P5: ${fmt(percentiles.p5.finalEquity)}`} color="text-amber-400" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* P&L Mensal */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">P&L Mensal (Média)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} tickFormatter={v => fmt(v)} />
                <Tooltip {...tooltipStyle} formatter={(v) => fmt(Number(v))} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="receita" name="Receita" fill="#3b82f6" opacity={0.7} />
                <Bar dataKey="custos" name="Custos" fill="#ef4444" opacity={0.6} />
                <Line dataKey="lucro" name="Lucro" stroke="#10b981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Frota + Utilização */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Frota &amp; Utilização</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis yAxisId="left" stroke="#666" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={11} domain={[0, 100]} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar yAxisId="left" dataKey="frota" name="Carros" fill="#8b5cf6" opacity={0.7} />
                <Line yAxisId="right" dataKey="util" name="Util %" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Acumulado + Equity */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Lucro Acumulado &amp; Equity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} tickFormatter={v => fmt(v)} />
                <Tooltip {...tooltipStyle} formatter={(v) => fmt(Number(v))} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area dataKey="acumulado" name="Lucro Acumulado" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Area dataKey="equity" name="Equity Frota" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown de Custos */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Breakdown de Custos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} tickFormatter={v => fmt(v)} />
                <Tooltip {...tooltipStyle} formatter={(v) => fmt(Number(v))} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area dataKey="insurance" name="Seguro" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Area dataKey="admin" name="Admin" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Area dataKey="manut" name="Manutenção" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area dataKey="claims" name="Claims" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                <Area dataKey="mkt" name="Marketing" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição de Lucro Total */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">
              Distribuição Lucro Total ({numRuns.toLocaleString()} runs)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="range" stroke="#666" fontSize={9} angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" name="Simulações" fill="#10b981" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Probabilidade de Lucro por Mês */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">
              Prob. Acumulado Positivo por Mês
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} domain={[0, 100]} />
                <Tooltip {...tooltipStyle} />
                <Line dataKey="probLucro" name="Prob. Lucro %" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Percentile Table */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5 mb-8">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">
            Tabela de Percentis ({numRuns.toLocaleString()} simulações)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 px-3 text-neutral-400">Métrica</th>
                  <th className="text-right py-2 px-3 text-red-400">P5 (pessimista)</th>
                  <th className="text-right py-2 px-3 text-amber-400">P25</th>
                  <th className="text-right py-2 px-3 text-emerald-400">P50 (mediana)</th>
                  <th className="text-right py-2 px-3 text-blue-400">P75</th>
                  <th className="text-right py-2 px-3 text-purple-400">P95 (otimista)</th>
                  <th className="text-right py-2 px-3 text-white">Média</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 px-3 text-neutral-300">Lucro Total</td>
                  <td className="py-2 px-3 text-right text-red-400">{fmt(percentiles.p5.totalProfit)}</td>
                  <td className="py-2 px-3 text-right text-amber-400">{fmt(percentiles.p25.totalProfit)}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">{fmt(percentiles.p50.totalProfit)}</td>
                  <td className="py-2 px-3 text-right text-blue-400">{fmt(percentiles.p75.totalProfit)}</td>
                  <td className="py-2 px-3 text-right text-purple-400">{fmt(percentiles.p95.totalProfit)}</td>
                  <td className="py-2 px-3 text-right font-semibold">{fmt(mean.totalProfit)}</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 px-3 text-neutral-300">Receita Total</td>
                  <td className="py-2 px-3 text-right text-red-400">{fmt(percentiles.p5.totalRevenue)}</td>
                  <td className="py-2 px-3 text-right text-amber-400">{fmt(percentiles.p25.totalRevenue)}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">{fmt(percentiles.p50.totalRevenue)}</td>
                  <td className="py-2 px-3 text-right text-blue-400">{fmt(percentiles.p75.totalRevenue)}</td>
                  <td className="py-2 px-3 text-right text-purple-400">{fmt(percentiles.p95.totalRevenue)}</td>
                  <td className="py-2 px-3 text-right font-semibold">{fmt(mean.totalRevenue)}</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 px-3 text-neutral-300">Margem Média</td>
                  <td className="py-2 px-3 text-right text-red-400">{pct(percentiles.p5.avgMargin)}</td>
                  <td className="py-2 px-3 text-right text-amber-400">{pct(percentiles.p25.avgMargin)}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">{pct(percentiles.p50.avgMargin)}</td>
                  <td className="py-2 px-3 text-right text-blue-400">{pct(percentiles.p75.avgMargin)}</td>
                  <td className="py-2 px-3 text-right text-purple-400">{pct(percentiles.p95.avgMargin)}</td>
                  <td className="py-2 px-3 text-right font-semibold">{pct(mean.avgMargin)}</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 px-3 text-neutral-300">Payback (meses)</td>
                  <td className="py-2 px-3 text-right text-red-400">{percentiles.p95.paybackMonth}</td>
                  <td className="py-2 px-3 text-right text-amber-400">{percentiles.p75.paybackMonth}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">{percentiles.p50.paybackMonth}</td>
                  <td className="py-2 px-3 text-right text-blue-400">{percentiles.p25.paybackMonth}</td>
                  <td className="py-2 px-3 text-right text-purple-400">{percentiles.p5.paybackMonth}</td>
                  <td className="py-2 px-3 text-right font-semibold">{mean.paybackMonth.toFixed(1)}</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 px-3 text-neutral-300">Frota Final</td>
                  <td className="py-2 px-3 text-right text-red-400">{percentiles.p5.finalFleet}</td>
                  <td className="py-2 px-3 text-right text-amber-400">{percentiles.p25.finalFleet}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">{percentiles.p50.finalFleet}</td>
                  <td className="py-2 px-3 text-right text-blue-400">{percentiles.p75.finalFleet}</td>
                  <td className="py-2 px-3 text-right text-purple-400">{percentiles.p95.finalFleet}</td>
                  <td className="py-2 px-3 text-right font-semibold">{Math.round(mean.finalFleet)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-300">Equity Final</td>
                  <td className="py-2 px-3 text-right text-red-400">{fmt(percentiles.p5.finalEquity)}</td>
                  <td className="py-2 px-3 text-right text-amber-400">{fmt(percentiles.p25.finalEquity)}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">{fmt(percentiles.p50.finalEquity)}</td>
                  <td className="py-2 px-3 text-right text-blue-400">{fmt(percentiles.p75.finalEquity)}</td>
                  <td className="py-2 px-3 text-right text-purple-400">{fmt(percentiles.p95.finalEquity)}</td>
                  <td className="py-2 px-3 text-right font-semibold">{fmt(mean.finalEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly P&L Table */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">P&L Mensal Detalhado (Média)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-700 text-neutral-400">
                  <th className="py-2 px-2 text-left">Mês</th>
                  <th className="py-2 px-2 text-right">Frota</th>
                  <th className="py-2 px-2 text-right">Util</th>
                  <th className="py-2 px-2 text-right">Rate</th>
                  <th className="py-2 px-2 text-right">Receita</th>
                  <th className="py-2 px-2 text-right">Seguro</th>
                  <th className="py-2 px-2 text-right">Admin</th>
                  <th className="py-2 px-2 text-right">Manut</th>
                  <th className="py-2 px-2 text-right">Claims</th>
                  <th className="py-2 px-2 text-right">Mkt</th>
                  <th className="py-2 px-2 text-right">Total Custo</th>
                  <th className="py-2 px-2 text-right">Lucro</th>
                  <th className="py-2 px-2 text-right">Margem</th>
                  <th className="py-2 px-2 text-right">Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {monthlyAverages.map(m => (
                  <tr key={m.month} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                    <td className="py-1.5 px-2 text-neutral-300">M{m.month}</td>
                    <td className="py-1.5 px-2 text-right">{m.fleet}</td>
                    <td className="py-1.5 px-2 text-right">{pct(m.utilization)}</td>
                    <td className="py-1.5 px-2 text-right">${m.avgRate.toFixed(0)}</td>
                    <td className="py-1.5 px-2 text-right text-blue-400">{fmt(m.revenue)}</td>
                    <td className="py-1.5 px-2 text-right text-red-300">{fmt(m.insuranceCost)}</td>
                    <td className="py-1.5 px-2 text-right text-amber-300">{fmt(m.adminCost)}</td>
                    <td className="py-1.5 px-2 text-right text-orange-300">{fmt(m.maintenanceCost)}</td>
                    <td className="py-1.5 px-2 text-right text-pink-300">{fmt(m.claimsCost)}</td>
                    <td className="py-1.5 px-2 text-right text-purple-300">{fmt(m.marketingCost)}</td>
                    <td className="py-1.5 px-2 text-right text-red-400">{fmt(m.totalCosts)}</td>
                    <td className={`py-1.5 px-2 text-right font-medium ${m.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {fmt(m.profit)}
                    </td>
                    <td className="py-1.5 px-2 text-right">{pct(m.margin)}</td>
                    <td className={`py-1.5 px-2 text-right ${m.cumulativeProfit >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                      {fmt(m.cumulativeProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
