import Link from "next/link";
import {
  actionChecklist,
  contradictions,
  criteria,
  mapTruths,
  options,
  sources,
  verdict,
  weightedScore,
} from "@/lib/miamiAudit";

const ranking = [...options]
  .map((option) => ({
    ...option,
    score: weightedScore(option.key),
  }))
  .sort((left, right) => right.score - left.score);

const analogies = [
  "Escalar para 50 carros sem provar economics de 2 é como abrir mais caixas de um restaurante antes de saber se o prato dá lucro.",
  "Confundir surcharge e imposto repassado ao cliente com margem é como contar troco do caixa como faturamento do dono.",
  "Blitzscale antes de underwriting validado é pilotar mais rápido justamente quando o para-brisa ainda está embaçado.",
];

export default function MiamiLocadoraForensePage() {
  const leader = ranking[0];
  const rival = ranking[1];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-12 px-6 py-10">
        <header className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/60 via-neutral-900 to-neutral-950 p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-4xl">
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-red-300">
                Auditoria Forense · 29/04/2026
              </p>
              <h1 className="text-4xl font-semibold sm:text-5xl">
                Locadora tradicional em Miami: veredito brutalmente honesto
              </h1>
              <p className="mt-4 text-lg text-neutral-300">{verdict.short}</p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-neutral-200 transition hover:border-white/40 hover:text-white"
            >
              Voltar
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Opção líder" value={leader.name} />
            <MetricCard label="Rival imediata" value={rival.name} />
            <MetricCard label="Payback alegado" value="2,5 meses" />
            <MetricCard label="Kill shot" value={verdict.killerSentence} highlight />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8">
            <h2 className="mb-4 text-2xl font-semibold">Veredito executivo</h2>
            <div className="space-y-4 text-neutral-200">
              <p>{verdict.recommendation}</p>
              <p>
                Mercado, turismo e vantagem fiscal parcial existem. O que nao existe, com a base
                encontrada, e prova honesta de payback total em 2,5 meses para 2 RAV4 comprados a
                vista.
              </p>
              <p>
                A pergunta certa nao e “Miami e grande?”. A pergunta certa e “depois de seguro,
                delivery, dano, depreciação, impostos indiretos e o trabalho do operador, sobra
                caixa suficiente para justificar escala imediata?”.
              </p>
            </div>
          </article>

          <aside className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-8">
            <h2 className="mb-4 text-2xl font-semibold text-amber-100">
              O que esta tese tende a esconder
            </h2>
            <ul className="space-y-3 text-sm text-amber-50/90">
              {mapTruths.map((item) => (
                <li key={item} className="rounded-2xl border border-amber-400/15 bg-black/20 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                Passada 1 · mapear
              </p>
              <h2 className="text-2xl font-semibold">10 critérios decisivos</h2>
            </div>
            <p className="max-w-2xl text-sm text-neutral-400">
              Os pesos concentram erro decisório em economia unitária, seguro/claims e capacidade
              de capturar demanda sem fantasia.
            </p>
          </div>

          <div className="space-y-4">
            {criteria.map((criterion) => (
              <article
                key={criterion.key}
                className="rounded-2xl border border-white/8 bg-neutral-950/60 p-6"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                      Peso {criterion.weight}/100
                    </p>
                    <h3 className="text-xl font-semibold">{criterion.label}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-neutral-300">
                    {criterion.whyItMatters}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <ScoreCard
                    label="A"
                    score={criterion.scores.A}
                    text="Conservador, reduz complexidade mas aprende devagar."
                  />
                  <ScoreCard
                    label="B"
                    score={criterion.scores.B}
                    text="Captura upside, mas acelera risco antes de medir direito."
                  />
                  <ScoreCard
                    label="C"
                    score={criterion.scores.C}
                    text="Preserva agressividade enquanto exige prova curta e dura."
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
              Passada 2 · comparar
            </p>
            <h2 className="text-2xl font-semibold">Ranking ponderado e teses</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {ranking.map((option, index) => (
              <article
                key={option.name}
                className={`rounded-3xl border p-6 ${
                  index === 0
                    ? "border-emerald-500/35 bg-emerald-500/10"
                    : "border-white/10 bg-neutral-950/60"
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                      #{index + 1}
                    </p>
                    <h3 className="text-2xl font-semibold">{option.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Nota ponderada</p>
                    <p className="text-3xl font-semibold">{option.score.toFixed(1)}/100</p>
                  </div>
                </div>

                <div className="mb-5 space-y-3 text-sm text-neutral-200">
                  <p>{option.thesis}</p>
                  <p>
                    <span className="font-medium text-white">Força:</span> {option.force}
                  </p>
                  <p>
                    <span className="font-medium text-white">Fraqueza:</span> {option.weakness}
                  </p>
                  <p>
                    <span className="font-medium text-white">Onde engana:</span>{" "}
                    {option.whereItMisleads}
                  </p>
                  <p>
                    <span className="font-medium text-white">Para quem parece bom mas nao e:</span>{" "}
                    {option.whoItLooksGoodForButIsNot}
                  </p>
                  <p>
                    <span className="font-medium text-white">Quando vira arma letal:</span>{" "}
                    {option.lethalWhen}
                  </p>
                  <p>
                    <span className="font-medium text-white">Quando vira armadilha:</span>{" "}
                    {option.trapWhen}
                  </p>
                </div>

                <MiniList title="2 unknown unknowns" items={option.unknownUnknowns} />
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-400">
              Passada 3 · revisar
            </p>
            <h2 className="mb-6 text-2xl font-semibold">Contradições que importam</h2>
            <MiniList title="Autocrítica da tese" items={contradictions} />
          </article>

          <article className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8">
            <h2 className="mb-6 text-2xl font-semibold">Analogias incisivas</h2>
            <MiniList title="Anti-autoengano" items={analogies} />
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8">
          <h2 className="mb-6 text-2xl font-semibold">Solução objetiva</h2>
          <MiniList
            title="Checklist de execução"
            items={actionChecklist}
          />
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8">
          <h2 className="mb-6 text-2xl font-semibold">Fontes âncora</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sources.map((source) => (
              <a
                key={source.title}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/8 bg-neutral-950/60 p-5 transition hover:border-white/20"
              >
                <p className="mb-1 text-sm uppercase tracking-[0.2em] text-neutral-500">
                  {source.kind}
                </p>
                <h3 className="text-lg font-medium">{source.title}</h3>
                <p className="mt-2 text-sm text-neutral-300">{source.evidence}</p>
                <p className="mt-3 text-sm text-neutral-400">{source.implication}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-red-400/30 bg-red-500/10"
          : "border-white/10 bg-black/20"
      }`}
    >
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-400">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  text,
}: {
  label: string;
  score: number;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-neutral-900/80 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">{label}</p>
        <p className="text-lg font-semibold text-white">{score}/10</p>
      </div>
      <p className="text-sm text-neutral-200">{text}</p>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">{title}</p>
      <ul className="space-y-2 text-sm text-neutral-200">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
