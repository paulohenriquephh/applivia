"use client";

import { useState, useEffect } from "react";

interface AuditData {
  dataReferencia: string;
  criterios: Criterio[];
  veredictoFinal: VeredictFinal;
}

interface Criterio {
  id: number;
  nome: string;
  peso: number;
  nota_A: number;
  nota_B: number;
  evidencia: string;
  forca: string;
  fraqueza: string;
  armadilha: string;
  unknown1: string;
  unknown2: string;
}

interface VeredictFinal {
  opcaoRecomendada: string;
  condicoes: string[];
  correcoesForenicas: string[];
  scoresFinal: {
    cenarioA: { lucro12meses: string; payback: string; equity18meses: string; risco: string; scoreTotal: number };
    cenarioB: { lucro12meses: string; payback: string; equity18meses: string; risco: string; scoreTotal: number };
  };
  planoExecucao7dias: {
    dia1_manha: string[];
    dia1_tarde: string[];
    dia2_3: string[];
    dia4_5: string[];
    dia6_7: string[];
  };
}

export default function AuditoriaForense() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"criterios" | "veredito" | "plano" | "correcoes">(
    "criterios"
  );

  useEffect(() => {
    fetch("/api/auditoria", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-neutral-400 text-sm">🔬 Carregando auditoria forense...</p>
      </div>
    );
  }

  if (!data) return null;

  const weightedA = data.criterios.reduce((s, c) => s + c.nota_A * c.peso, 0);
  const weightedB = data.criterios.reduce((s, c) => s + c.nota_B * c.peso, 0);
  const maxScore = data.criterios.reduce((s, c) => s + 10 * c.peso, 0);

  const tabs = [
    { id: "criterios", label: "📊 10 Critérios" },
    { id: "veredito", label: "⚖️ Veredito Final" },
    { id: "plano", label: "📅 Plano 7 Dias" },
    { id: "correcoes", label: "🚨 Correções Forenses" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🔬</span> Auditoria Forense — 3 Passadas
        </h2>
        <p className="text-xs text-neutral-400">
          Data: {data.dataReferencia} | Metodologia: Mapeamento → Comparação → Revisão Adversarial
        </p>

        {/* Score summary */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <ScoreBar
            label="Cenário A — Conservador"
            score={weightedA}
            max={maxScore}
            color="blue"
          />
          <ScoreBar
            label="Cenário B — Nuclear Natalya 2.0"
            score={weightedB}
            max={maxScore}
            color="orange"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`text-xs px-3 py-2 rounded-lg transition-colors font-medium ${
              activeTab === t.id
                ? "bg-orange-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "criterios" && (
        <div className="space-y-4">
          {data.criterios.map((c) => (
            <div key={c.id} className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs text-neutral-500">#{c.id} — Peso {c.peso}x</span>
                  <h3 className="text-sm font-bold text-white">{c.nome}</h3>
                </div>
                <div className="flex gap-3 text-right">
                  <div>
                    <p className="text-xs text-blue-400">A</p>
                    <p className={`text-xl font-bold ${c.nota_A >= 7 ? "text-green-400" : c.nota_A >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                      {c.nota_A}/10
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-400">B</p>
                    <p className={`text-xl font-bold ${c.nota_B >= 7 ? "text-green-400" : c.nota_B >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                      {c.nota_B}/10
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <Detail icon="📌" label="Evidência" text={c.evidencia} color="neutral" />
                <Detail icon="💪" label="Força" text={c.forca} color="green" />
                <Detail icon="⚠️" label="Fraqueza" text={c.fraqueza} color="yellow" />
                <Detail icon="🪤" label="Armadilha" text={c.armadilha} color="red" />
                <Detail icon="❓" label="Unknown 1" text={c.unknown1} color="purple" />
                <Detail icon="❓" label="Unknown 2" text={c.unknown2} color="purple" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "veredito" && (
        <div className="space-y-4">
          <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700">
            <p className="text-xs text-orange-400 mb-1">VEREDITO</p>
            <p className="text-2xl font-bold text-white">{data.veredictoFinal.opcaoRecomendada}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <VeredictCard
              title="Cenário A"
              color="blue"
              data={data.veredictoFinal.scoresFinal.cenarioA}
            />
            <VeredictCard
              title="Cenário B"
              color="orange"
              data={data.veredictoFinal.scoresFinal.cenarioB}
            />
          </div>

          <div className="bg-neutral-800 rounded-xl p-5 border border-green-800">
            <h3 className="text-sm font-bold text-green-400 mb-3">✅ Condições para executar B</h3>
            <ul className="space-y-2">
              {data.veredictoFinal.condicoes.map((c, i) => (
                <li key={i} className="text-xs text-neutral-300 flex gap-2">
                  <span className="text-green-400 shrink-0">→</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "plano" && (
        <div className="space-y-4">
          {Object.entries(data.veredictoFinal.planoExecucao7dias).map(([key, items]) => {
            const label = {
              dia1_manha: "Dia 1 — Manhã (06:00–12:00)",
              dia1_tarde: "Dia 1 — Tarde (12:00–24:00)",
              dia2_3: "Dias 2–3",
              dia4_5: "Dias 4–5",
              dia6_7: "Dias 6–7",
            }[key];
            return (
              <div key={key} className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
                <h3 className="text-sm font-bold text-orange-400 mb-3">{label}</h3>
                <ul className="space-y-2">
                  {(items as string[]).map((item, i) => (
                    <li key={i} className="text-xs text-neutral-300 flex gap-2">
                      <span className="text-orange-500 shrink-0">▶</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "correcoes" && (
        <div className="space-y-3">
          <div className="bg-red-950/40 rounded-xl p-4 border border-red-800 mb-4">
            <p className="text-xs text-red-400 font-bold mb-2">
              🚨 CORREÇÕES FORENSES — ERROS NO BRIEFING ORIGINAL
            </p>
            <p className="text-xs text-neutral-400">
              Estas correções protegem o executor de decisões baseadas em dados incorretos.
              Sem elas, o risco de falência é 3x maior.
            </p>
          </div>
          {data.veredictoFinal.correcoesForenicas.map((c, i) => (
            <div key={i} className="bg-neutral-800 rounded-xl p-4 border border-red-800">
              <p className="text-xs text-red-300 flex gap-2">
                <span className="text-red-500 shrink-0 font-bold">✗ {i + 1}.</span>
                {c}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreBar({
  label,
  score,
  max,
  color,
}: {
  label: string;
  score: number;
  max: number;
  color: "blue" | "orange";
}) {
  const pct = (score / max) * 100;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-neutral-400">{label}</span>
        <span className={`text-xs font-bold ${color === "orange" ? "text-orange-400" : "text-blue-400"}`}>
          {score}/{max}
        </span>
      </div>
      <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color === "orange" ? "bg-orange-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  text,
  color,
}: {
  icon: string;
  label: string;
  text: string;
  color: "neutral" | "green" | "yellow" | "red" | "purple";
}) {
  const colors = {
    neutral: "text-neutral-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
    purple: "text-purple-400",
  };
  return (
    <div className={`${colors[color]}`}>
      <span className="font-semibold">
        {icon} {label}:{" "}
      </span>
      <span className="text-neutral-300">{text}</span>
    </div>
  );
}

function VeredictCard({
  title,
  color,
  data,
}: {
  title: string;
  color: "blue" | "orange";
  data: { lucro12meses: string; payback: string; equity18meses: string; risco: string; scoreTotal: number };
}) {
  return (
    <div
      className={`bg-neutral-800 rounded-xl p-4 border ${
        color === "orange" ? "border-orange-700" : "border-blue-700"
      }`}
    >
      <p
        className={`text-xs font-bold mb-3 ${
          color === "orange" ? "text-orange-400" : "text-blue-400"
        }`}
      >
        {title}
      </p>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-neutral-400">Lucro 12m</span>
          <span className="text-white font-medium">{data.lucro12meses}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Payback</span>
          <span className="text-white font-medium">{data.payback}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Equity 18m</span>
          <span className="text-white font-medium">{data.equity18meses}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Risco</span>
          <span className={`font-medium ${data.risco === "BAIXO" ? "text-green-400" : "text-yellow-400"}`}>
            {data.risco}
          </span>
        </div>
        <div className="flex justify-between border-t border-neutral-700 pt-2 mt-2">
          <span className="text-neutral-400">Score ponderado</span>
          <span
            className={`font-bold text-sm ${
              color === "orange" ? "text-orange-400" : "text-blue-400"
            }`}
          >
            {data.scoreTotal}/100
          </span>
        </div>
      </div>
    </div>
  );
}
