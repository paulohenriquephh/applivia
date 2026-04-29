"use client";

import Link from "next/link";
import { runAudit, type CriterionScore } from "@/lib/forensic-audit";

function ScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  const pct = (score / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono w-6 text-right">{score}</span>
    </div>
  );
}

function CriterionCard({ criterion, index }: { criterion: CriterionScore; index: number }) {
  const weightLabel = "●".repeat(criterion.weight) + "○".repeat(3 - criterion.weight);

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs text-neutral-500 font-mono">#{index + 1}</span>
            <h3 className="text-lg font-bold">{criterion.name}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400">Peso: </span>
            <span className="text-sm text-amber-400 font-mono">{weightLabel} ({criterion.weight})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-400 mb-1">A (Conservador)</p>
            <ScoreBar score={criterion.scoreA} max={criterion.maxScore} color="bg-blue-500" />
            <p className="text-xs text-neutral-500 mt-1">Ponderado: {criterion.scoreA * criterion.weight}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1">B (Agressivo)</p>
            <ScoreBar score={criterion.scoreB} max={criterion.maxScore} color="bg-emerald-500" />
            <p className="text-xs text-neutral-500 mt-1">Ponderado: {criterion.scoreB * criterion.weight}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 text-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-1">Força A</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">{criterion.strengthA}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-1">Força B</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">{criterion.strengthB}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-red-400 uppercase mb-1">Fraqueza A</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">{criterion.weaknessA}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-red-400 uppercase mb-1">Fraqueza B</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">{criterion.weaknessB}</p>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-amber-400 uppercase mb-1">Onde Engana</h4>
          <p className="text-neutral-300 text-xs leading-relaxed">{criterion.whereItDeceives}</p>
        </div>

        <div className="bg-red-950/30 rounded-lg p-3 border border-red-900/30">
          <h4 className="text-xs font-semibold text-red-400 uppercase mb-1">Parece Bom Mas Não É</h4>
          <p className="text-neutral-300 text-xs leading-relaxed">{criterion.looksGoodButIsnt}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-900/30">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-1">Arma Letal</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">{criterion.lethalWeapon}</p>
          </div>
          <div className="bg-amber-950/30 rounded-lg p-3 border border-amber-900/30">
            <h4 className="text-xs font-semibold text-amber-400 uppercase mb-1">Armadilha</h4>
            <p className="text-neutral-300 text-xs leading-relaxed">{criterion.trap}</p>
          </div>
        </div>

        <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-900/30">
          <h4 className="text-xs font-semibold text-purple-400 uppercase mb-1">Unknown Unknowns</h4>
          <ol className="text-neutral-300 text-xs leading-relaxed list-decimal ml-4">
            {criterion.unknownUnknowns.map((uu, i) => (
              <li key={i} className="mb-1">{uu}</li>
            ))}
          </ol>
        </div>

        <div className="border-t border-neutral-800 pt-3">
          <h4 className="text-xs font-semibold text-cyan-400 uppercase mb-1">Evidência</h4>
          <p className="text-neutral-400 text-xs leading-relaxed">{criterion.evidence}</p>
          <p className="text-neutral-500 text-xs mt-1 italic">Fonte: {criterion.source}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuditoriaPage() {
  const audit = runAudit();

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link href="/locadora" className="text-neutral-500 hover:text-white text-sm transition-colors">
            &larr; Locadora
          </Link>
          <h1 className="text-3xl font-bold mt-2">Auditoria Forense</h1>
          <p className="text-neutral-400 text-sm mt-1">
            10 critérios ponderados &middot; Notas 1-10 &middot; Análise sem viés &middot; Fontes primárias 2026
          </p>
        </div>

        {/* Verdict */}
        <div className="bg-gradient-to-r from-emerald-950/50 to-neutral-900 rounded-xl border border-emerald-800/40 p-6 mb-8">
          <h2 className="text-lg font-bold text-emerald-400 mb-3">VEREDITO</h2>
          <p className="text-neutral-200 leading-relaxed">{audit.verdict}</p>
          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-xs text-neutral-400">Score A (Conservador)</p>
              <p className="text-2xl font-bold text-blue-400">{audit.totalWeightedA}<span className="text-sm text-neutral-500">/{audit.maxWeightedScore}</span></p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Score B (Agressivo)</p>
              <p className="text-2xl font-bold text-emerald-400">{audit.totalWeightedB}<span className="text-sm text-neutral-500">/{audit.maxWeightedScore}</span></p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Delta</p>
              <p className="text-2xl font-bold text-amber-400">+{audit.totalWeightedB - audit.totalWeightedA}</p>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5 mb-8">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Resumo de Scores (Ponderados)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700 text-neutral-400 text-xs">
                  <th className="text-left py-2 px-3">Critério</th>
                  <th className="text-center py-2 px-3">Peso</th>
                  <th className="text-center py-2 px-3">Score A</th>
                  <th className="text-center py-2 px-3">Score B</th>
                  <th className="text-center py-2 px-3">Pond. A</th>
                  <th className="text-center py-2 px-3">Pond. B</th>
                  <th className="text-center py-2 px-3">Vencedor</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {audit.criteria.map(c => (
                  <tr key={c.id} className="border-b border-neutral-800/50">
                    <td className="py-2 px-3 text-neutral-300 font-sans">{c.name}</td>
                    <td className="py-2 px-3 text-center text-amber-400">{c.weight}</td>
                    <td className="py-2 px-3 text-center text-blue-400">{c.scoreA}/10</td>
                    <td className="py-2 px-3 text-center text-emerald-400">{c.scoreB}/10</td>
                    <td className="py-2 px-3 text-center text-blue-300">{c.scoreA * c.weight}</td>
                    <td className="py-2 px-3 text-center text-emerald-300">{c.scoreB * c.weight}</td>
                    <td className="py-2 px-3 text-center">
                      {c.scoreA > c.scoreB ? (
                        <span className="text-blue-400">A</span>
                      ) : c.scoreB > c.scoreA ? (
                        <span className="text-emerald-400">B</span>
                      ) : (
                        <span className="text-neutral-400">=</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-neutral-600 font-bold">
                  <td className="py-2 px-3">TOTAL</td>
                  <td className="py-2 px-3 text-center text-amber-400">{audit.criteria.reduce((s, c) => s + c.weight, 0)}</td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3 text-center text-blue-400">{audit.totalWeightedA}</td>
                  <td className="py-2 px-3 text-center text-emerald-400">{audit.totalWeightedB}</td>
                  <td className="py-2 px-3 text-center text-emerald-400">B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Contradictions */}
        <div className="bg-red-950/20 rounded-xl border border-red-900/30 p-5 mb-8">
          <h3 className="text-sm font-semibold text-red-400 uppercase mb-4">
            Contradições Identificadas ({audit.contradictions.length})
          </h3>
          <ol className="space-y-3">
            {audit.contradictions.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-red-500 font-mono text-xs mt-0.5 shrink-0">#{i + 1}</span>
                <p className="text-neutral-300 text-sm leading-relaxed">{c}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Breakpoints */}
        <div className="bg-amber-950/20 rounded-xl border border-amber-900/30 p-5 mb-8">
          <h3 className="text-sm font-semibold text-amber-400 uppercase mb-4">
            Pontos de Quebra (Circuit Breakers)
          </h3>
          <div className="space-y-2">
            {audit.breakpoints.map((bp, i) => (
              <div key={i} className="flex items-start gap-3 bg-neutral-800/30 rounded-lg p-3">
                <span className="text-amber-500 text-lg">⚠</span>
                <p className="text-neutral-300 text-sm">{bp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analogies */}
        <div className="bg-purple-950/20 rounded-xl border border-purple-900/30 p-5 mb-8">
          <h3 className="text-sm font-semibold text-purple-400 uppercase mb-4">
            Analogias Incisivas
          </h3>
          <div className="space-y-3">
            {audit.analogies.map((a, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-purple-400 text-lg shrink-0">&ldquo;</span>
                <p className="text-neutral-300 text-sm leading-relaxed italic">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Criteria Detail */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Análise Detalhada por Critério</h2>
          <div className="space-y-6">
            {audit.criteria.map((c, i) => (
              <CriterionCard key={c.id} criterion={c} index={i} />
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Metodologia</h3>
          <div className="text-xs text-neutral-400 space-y-2">
            <p><strong className="text-neutral-300">Scores:</strong> 1-10 por critério, onde 1 = péssimo e 10 = excelente para o objetivo de maximizar lucro líquido ajustado ao risco.</p>
            <p><strong className="text-neutral-300">Pesos:</strong> 1-3, derivados de impact analysis — lucro líquido e payback recebem peso 3 por serem determinantes primários de viabilidade.</p>
            <p><strong className="text-neutral-300">Fontes:</strong> Mordor Intelligence 2026, Tax Foundation 2026, KBB 2026, GMI/Mesa Insurance FL quotes, FL Statutes, Visit Florida, ACRA, Natalya Zorina public data, Rentscout.io, GetHapn.com.</p>
            <p><strong className="text-neutral-300">Viés:</strong> Anti-viés aplicado — cada claim do user original foi testado contra evidência real. Contradições explicitadas. Nenhum número inventado.</p>
            <p><strong className="text-neutral-300">3 Passadas:</strong> (1) Mapeamento de claims vs evidência. (2) Comparação A vs B por critério com dados. (3) Revisão final de contradições e unknown unknowns.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
