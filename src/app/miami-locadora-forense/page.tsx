"use client";

import { useMemo, useState } from "react";
import {
  analogies,
  claimAudits,
  criteria,
  getScenarioRanking,
  getScoreColor,
  getScoreLabel,
  recommendation,
  sources,
  contradictions,
} from "@/lib/miami-rental-audit";

type PaybackMode = "asset" | "equity";

const sourceMap = new Map(sources.map((source) => [source.label, source]));

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

function calcMonthlyContribution({
  adr,
  occupancy,
  taxesAndFeesPct,
  airportSharePct,
  variableOpsPct,
  insurancePerMonth,
  depreciationPerMonth,
  fixedOpsPerMonth,
}: {
  adr: number;
  occupancy: number;
  taxesAndFeesPct: number;
  airportSharePct: number;
  variableOpsPct: number;
  insurancePerMonth: number;
  depreciationPerMonth: number;
  fixedOpsPerMonth: number;
}) {
  const grossRevenue = adr * 30 * (occupancy / 100);
  const revenueHaircut =
    grossRevenue *
    ((taxesAndFeesPct + airportSharePct + variableOpsPct) / 100);
  const monthlyContribution =
    grossRevenue -
    revenueHaircut -
    insurancePerMonth -
    depreciationPerMonth -
    fixedOpsPerMonth;

  return {
    grossRevenue,
    revenueHaircut,
    monthlyContribution,
  };
}

export default function MiamiLocadoraForensePage() {
  const ranking = useMemo(() => getScenarioRanking(), []);
  const winner = ranking[0];

  const [adr, setAdr] = useState(79);
  const [occupancy, setOccupancy] = useState(78);
  const [taxesAndFeesPct, setTaxesAndFeesPct] = useState(9);
  const [airportSharePct, setAirportSharePct] = useState(0);
  const [variableOpsPct, setVariableOpsPct] = useState(16);
  const [insurancePerMonth, setInsurancePerMonth] = useState(350);
  const [depreciationPerMonth, setDepreciationPerMonth] = useState(300);
  const [fixedOpsPerMonth, setFixedOpsPerMonth] = useState(550);
  const [capitalAtRisk, setCapitalAtRisk] = useState(34850);
  const [paybackMode, setPaybackMode] = useState<PaybackMode>("asset");

  const contribution = useMemo(
    () =>
      calcMonthlyContribution({
        adr,
        occupancy,
        taxesAndFeesPct,
        airportSharePct,
        variableOpsPct,
        insurancePerMonth,
        depreciationPerMonth,
        fixedOpsPerMonth,
      }),
    [
      adr,
      occupancy,
      taxesAndFeesPct,
      airportSharePct,
      variableOpsPct,
      insurancePerMonth,
      depreciationPerMonth,
      fixedOpsPerMonth,
    ],
  );

  const paybackMonths =
    contribution.monthlyContribution > 0
      ? capitalAtRisk / contribution.monthlyContribution
      : Number.POSITIVE_INFINITY;

  const needsForTwoPointFiveAsset =
    (capitalAtRisk / 2.5 +
      insurancePerMonth +
      depreciationPerMonth +
      fixedOpsPerMonth) /
    (30 * (occupancy / 100) * (1 - (taxesAndFeesPct + airportSharePct + variableOpsPct) / 100));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
        <header className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/60 via-neutral-900 to-neutral-950 p-8 shadow-2xl shadow-red-950/20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-300">
            Auditoria forense · Miami car rental · 29/04/2026
          </p>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl">
                A tese nuclear vende velocidade. Os dados pedem gates.
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-300">
                Veredito brutalmente honesto: a demanda existe, mas o plano B
                mistura turismo forte com matemática de capital fraca. O
                desenho vencedor não é A nem B puros; é um blitz disciplinado
                que só libera escala quando o dado real protege a expansão.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                Veredito objetivo
              </p>
              <p className="mt-3 text-2xl font-bold text-white">
                {recommendation.verdict}
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {recommendation.why}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-neutral-900 p-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Cenário líder
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-300">
                    {winner.name.split("—")[0].trim()}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-900 p-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Nota ponderada
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {winner.weightedScore}/10
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-900 p-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Payback 2,5m
                  </p>
                  <p className="mt-1 text-lg font-semibold text-red-300">
                    {paybackMode === "asset" ? "Não fecha" : "Só equity"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {contradictions.map((item, index) => (
            <article
              key={item}
              className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                Contradição {index + 1}
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-200">{item}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Passada 1 · Mapear
              </p>
              <h2 className="text-2xl font-bold text-white">
                Auditoria das alegações centrais
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {claimAudits.map((item) => (
                <article
                  key={item.claim}
                  className="rounded-2xl border border-white/8 bg-neutral-950/70 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <h3 className="max-w-3xl text-lg font-semibold text-white">
                      {item.claim}
                    </h3>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getScoreColor(
                        {
                          Suportado: 9,
                          Parcial: 6,
                          Fraco: 4,
                          Contradito: 2,
                        }[item.status],
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">
                    {item.verdict}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-neutral-400">
                    <span className="font-semibold text-neutral-200">
                      Por que importa:
                    </span>{" "}
                    {item.whyItMatters}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.sources.map((sourceLabel) => {
                      const source = sourceMap.get(sourceLabel);
                      if (!source) return null;

                      return (
                        <a
                          key={source.label}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 transition hover:border-white/25 hover:text-white"
                        >
                          {source.kind} · {source.label}
                        </a>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Passada 2 · Comparar
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Ranking ponderado
              </h2>

              <div className="mt-5 space-y-4">
                {ranking.map((scenario, index) => (
                  <article
                    key={scenario.id}
                    className="rounded-2xl border border-white/8 bg-neutral-950/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                          #{index + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-white">
                          {scenario.name}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-400">
                          {scenario.strapline}
                        </p>
                      </div>
                      <div className="rounded-xl bg-neutral-900 px-3 py-2 text-right">
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                          nota
                        </p>
                        <p className="text-xl font-bold text-white">
                          {scenario.weightedScore}/10
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-neutral-300">
                      {scenario.thesis}
                    </p>
                    <div className="mt-4 grid gap-2 text-sm text-neutral-300">
                      <p>
                        <span className="font-semibold text-emerald-300">
                          Força:
                        </span>{" "}
                        {scenario.force}
                      </p>
                      <p>
                        <span className="font-semibold text-rose-300">
                          Fraqueza:
                        </span>{" "}
                        {scenario.weakness}
                      </p>
                      <p>
                        <span className="font-semibold text-amber-300">
                          Onde engana:
                        </span>{" "}
                        {scenario.whereItMisleads}
                      </p>
                      <p>
                        <span className="font-semibold text-sky-300">
                          Parece bom para:
                        </span>{" "}
                        {scenario.looksGoodFor}
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-300">
                          Vira arma letal:
                        </span>{" "}
                        {scenario.lethalWhen}
                      </p>
                      <p>
                        <span className="font-semibold text-red-300">
                          Vira armadilha:
                        </span>{" "}
                        {scenario.trapWhen}
                      </p>
                      <p>
                        <span className="font-semibold text-violet-300">
                          Unknown unknowns:
                        </span>{" "}
                        {scenario.unknownUnknowns[0]} /{" "}
                        {scenario.unknownUnknowns[1]}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Passada 3 · Revisar
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Analogias incisivas
              </h2>
              <div className="mt-5 space-y-3">
                {analogies.map((analogy) => (
                  <p
                    key={analogy}
                    className="rounded-2xl border border-white/8 bg-neutral-950/70 p-4 text-sm leading-7 text-neutral-300"
                  >
                    {analogy}
                  </p>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
              10 critérios decisivos
            </p>
            <h2 className="text-2xl font-bold text-white">
              Pesos reais, sem média burra
            </h2>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  <th className="pb-2 pr-4">Critério</th>
                  <th className="pb-2 pr-4">Peso</th>
                  <th className="pb-2 pr-4">Por que importa</th>
                  {ranking.map((scenario) => (
                    <th key={scenario.id} className="pb-2 pr-4">
                      {scenario.name.split("—")[0].trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map((criterion) => (
                  <tr key={criterion.id} className="align-top">
                    <td className="rounded-l-2xl border border-white/8 bg-neutral-950/70 px-4 py-4 font-semibold text-white">
                      {criterion.name}
                    </td>
                    <td className="border-y border-white/8 bg-neutral-950/70 px-4 py-4 text-neutral-200">
                      {criterion.weight}
                    </td>
                    <td className="border-y border-white/8 bg-neutral-950/70 px-4 py-4 text-sm leading-7 text-neutral-300">
                      {criterion.why}
                    </td>
                    {ranking.map((scenario, index) => {
                      const value = scenario.scores[criterion.id] ?? 0;
                      return (
                        <td
                          key={`${scenario.id}-${criterion.id}`}
                          className={`border-y border-white/8 bg-neutral-950/70 px-4 py-4 ${
                            index === ranking.length - 1 ? "rounded-r-2xl" : ""
                          }`}
                        >
                          <div
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getScoreColor(
                              value,
                            )}`}
                          >
                            {value}/10 · {getScoreLabel(value)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Laboratório brutal de payback
              </p>
              <h2 className="text-2xl font-bold text-white">
                O número de 2,5 meses só vale se você definir certo o capital em risco
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">ADR diário (USD)</span>
                <input
                  type="range"
                  min={45}
                  max={160}
                  value={adr}
                  onChange={(event) => setAdr(Number(event.target.value))}
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {currency(adr)}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Ocupação</span>
                <input
                  type="range"
                  min={40}
                  max={95}
                  value={occupancy}
                  onChange={(event) => setOccupancy(Number(event.target.value))}
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {percent(occupancy)}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">
                  Taxes + fees sobre receita
                </span>
                <input
                  type="range"
                  min={5}
                  max={18}
                  value={taxesAndFeesPct}
                  onChange={(event) =>
                    setTaxesAndFeesPct(Number(event.target.value))
                  }
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {percent(taxesAndFeesPct)}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">
                  Hub share (MIA/Port) sobre receita
                </span>
                <input
                  type="range"
                  min={0}
                  max={9}
                  value={airportSharePct}
                  onChange={(event) =>
                    setAirportSharePct(Number(event.target.value))
                  }
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {percent(airportSharePct)}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">
                  Operação variável sobre receita
                </span>
                <input
                  type="range"
                  min={8}
                  max={28}
                  value={variableOpsPct}
                  onChange={(event) =>
                    setVariableOpsPct(Number(event.target.value))
                  }
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {percent(variableOpsPct)}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">
                  Seguro por mês (USD)
                </span>
                <input
                  type="range"
                  min={150}
                  max={900}
                  step={10}
                  value={insurancePerMonth}
                  onChange={(event) =>
                    setInsurancePerMonth(Number(event.target.value))
                  }
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {currency(insurancePerMonth)}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">
                  Depreciação/mês (USD)
                </span>
                <input
                  type="range"
                  min={180}
                  max={700}
                  step={10}
                  value={depreciationPerMonth}
                  onChange={(event) =>
                    setDepreciationPerMonth(Number(event.target.value))
                  }
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {currency(depreciationPerMonth)}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">
                  Fixed ops/mês (USD)
                </span>
                <input
                  type="range"
                  min={150}
                  max={1600}
                  step={25}
                  value={fixedOpsPerMonth}
                  onChange={(event) =>
                    setFixedOpsPerMonth(Number(event.target.value))
                  }
                  className="w-full accent-red-400"
                />
                <div className="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-white">
                  {currency(fixedOpsPerMonth)}
                </div>
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-white/8 bg-neutral-950/70 p-5">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaybackMode("asset");
                    setCapitalAtRisk(34850);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    paybackMode === "asset"
                      ? "bg-red-400 text-black"
                      : "bg-white/5 text-neutral-300 hover:bg-white/10"
                  }`}
                >
                  Payback do ativo inteiro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaybackMode("equity");
                    setCapitalAtRisk(9000);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    paybackMode === "equity"
                      ? "bg-emerald-400 text-black"
                      : "bg-white/5 text-neutral-300 hover:bg-white/10"
                  }`}
                >
                  Payback de uma tranche de equity
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-neutral-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Receita bruta/mês
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {currency(contribution.grossRevenue)}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Haircut de receita
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {currency(contribution.revenueHaircut)}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Contribuição/mês
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {Number.isFinite(contribution.monthlyContribution)
                      ? currency(contribution.monthlyContribution)
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Payback
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {Number.isFinite(paybackMonths)
                      ? `${paybackMonths.toFixed(1)} meses`
                      : "Nunca"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/8 bg-black/30 p-4 text-sm leading-7 text-neutral-300">
                Para bater{" "}
                <span className="font-semibold text-white">2,5 meses</span> com
                as demais premissas atuais, o ADR precisaria ir para cerca de{" "}
                <span className="font-semibold text-red-300">
                  {currency(needsForTwoPointFiveAsset)}
                </span>{" "}
                por dia no mesmo nível de ocupação. Isso é o teste anti-ilusão:
                se esse ADR não for defensável no seu canal, o payback prometido
                não existe para o ativo inteiro.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Solução objetiva
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Guardrails nucleares que não alucinam
              </h2>
              <div className="mt-5 space-y-3">
                {recommendation.gates.map((gate) => (
                  <div
                    key={gate}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm leading-7 text-neutral-200"
                  >
                    {gate}
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-sm leading-7 text-red-100">
                {recommendation.verdictOnPayback}
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Fontes e benchmarks
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Base usada na auditoria
              </h2>
              <div className="mt-5 space-y-3">
                {sources.map((source) => (
                  <a
                    key={source.label}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-white/8 bg-neutral-950/70 p-4 transition hover:border-white/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {source.label}
                        </p>
                        <p className="mt-1 text-sm leading-7 text-neutral-400">
                          {source.note}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-300">
                        {source.kind}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
