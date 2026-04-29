export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="mb-12 max-w-4xl">
          <span className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-300">
            Auditoria forense 29/04/2026
          </span>
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            Locadora tradicional em Miami:
            <span className="block text-emerald-400">verdade operacional, sem fantasia.</span>
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-300">
            Veredito brutalmente honesto sobre a tese de abrir com 2 carros, escalar sem plataforma,
            validar payback e atacar os riscos que mais destroem retorno no mundo real.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <a
            href="/miami-locadora-forense"
            className="rounded-2xl border border-emerald-500/30 bg-neutral-900 p-6 transition hover:border-emerald-400 hover:bg-neutral-800"
          >
            <p className="mb-2 text-sm font-medium text-emerald-300">Leitura principal</p>
            <h2 className="mb-3 text-2xl font-semibold">Dossiê forense</h2>
            <p className="text-sm leading-7 text-neutral-400">
              Fontes, pesos, notas, ranking, contradições, tese contrária, payback e recomendação objetiva.
            </p>
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl border border-white/10 bg-neutral-900 p-6 transition hover:border-white/20 hover:bg-neutral-800"
          >
            <p className="mb-2 text-sm font-medium text-neutral-300">Estrutura existente</p>
            <h2 className="mb-3 text-2xl font-semibold">Dashboard técnico</h2>
            <p className="text-sm leading-7 text-neutral-400">
              Página original do projeto com agentes e serviços da stack.
            </p>
          </a>

          <div className="rounded-2xl border border-amber-500/20 bg-neutral-900 p-6">
            <p className="mb-2 text-sm font-medium text-amber-300">Síntese do veredito</p>
            <h2 className="mb-3 text-2xl font-semibold">B irrestrito perde</h2>
            <p className="text-sm leading-7 text-neutral-400">
              O vencedor é um híbrido agressivo com prova de unidade antes do blitzscale.
              O payback de 2,5 meses não fecha no capex total de 2 RAV4 cash.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
