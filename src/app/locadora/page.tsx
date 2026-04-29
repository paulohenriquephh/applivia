"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic imports para evitar SSR issues com recharts
const MonteCarloSimulator = dynamic(
  () => import("@/components/locadora/MonteCarloSimulator"),
  { ssr: false, loading: () => <LoadingBlock label="Simulador Monte Carlo" /> }
);
const AuditoriaForense = dynamic(
  () => import("@/components/locadora/AuditoriaForense"),
  { ssr: false, loading: () => <LoadingBlock label="Auditoria Forense" /> }
);
const ContratoGenerator = dynamic(
  () => import("@/components/locadora/ContratoGenerator"),
  { ssr: false, loading: () => <LoadingBlock label="Gerador de Contratos" /> }
);
const MarketingScripts = dynamic(
  () => import("@/components/locadora/MarketingScripts"),
  { ssr: false, loading: () => <LoadingBlock label="Scripts de Marketing" /> }
);
const KPIDashboard = dynamic(
  () => import("@/components/locadora/KPIDashboard"),
  { ssr: false, loading: () => <LoadingBlock label="Dashboard KPI" /> }
);

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="bg-neutral-800 rounded-xl p-10 border border-neutral-700 text-center">
      <p className="text-neutral-400 text-sm">⚙️ Carregando {label}...</p>
    </div>
  );
}

const TABS = [
  { id: "kpi", label: "📊 Dashboard", icon: "📊" },
  { id: "monte-carlo", label: "🎲 Monte Carlo", icon: "🎲" },
  { id: "auditoria", label: "🔬 Auditoria Forense", icon: "🔬" },
  { id: "contrato", label: "📄 Contrato", icon: "📄" },
  { id: "marketing", label: "📣 Marketing", icon: "📣" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function LocadoraPage() {
  const [activeTab, setActiveTab] = useState<TabId>("kpi");

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-2xl">🚗</span>
                <h1 className="text-xl font-bold text-white">Miami Car Rental</h1>
                <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded font-bold">
                  FSM NUCLEAR
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Locadora Tradicional Miami 2026 · 2 RAV4 Hybrid → 200 carros · Natalya 2.0
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Live</p>
              <p className="text-xs font-mono text-orange-400">29/04/2026</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs px-3 py-2 rounded-t-lg whitespace-nowrap transition-colors font-medium ${
                  activeTab === tab.id
                    ? "bg-neutral-950 text-white border-t border-l border-r border-neutral-700"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Banner de alerta principal */}
        <div className="bg-orange-950/40 border border-orange-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚡</span>
            <div>
              <p className="text-sm font-bold text-orange-300">
                MISSÃO ATIVA: 7 dias para primeira receita · Cenário B Nuclear
              </p>
              <p className="text-xs text-orange-400 mt-1">
                2 RAV4 Hybrid cash ($64K) → 50 carros em 6 meses → 200 em 18 meses ·
                Payback real: 8-14 meses (não 2,5 meses — ver Auditoria Forense) ·
                ROI 6-10x em 18 meses · Exit: acquisition ou PE em 36 meses
              </p>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "kpi" && <KPIDashboard />}
        {activeTab === "monte-carlo" && <MonteCarloSimulator />}
        {activeTab === "auditoria" && <AuditoriaForense />}
        {activeTab === "contrato" && <ContratoGenerator />}
        {activeTab === "marketing" && <MarketingScripts />}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800 mt-8">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-neutral-600">
            Miami Car Rental · Dados 2026 · Fontes: Mordor Intelligence, Rentscout, Tax Foundation, HSMV FL, Miami-Dade County Tax Collector
          </p>
        </div>
      </div>
    </main>
  );
}
