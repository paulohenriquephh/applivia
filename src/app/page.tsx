import Link from "next/link";

const validatedItems = [
  {
    item: "Florida §475",
    detail: "Info product/coaching/concierge flat-fee sem comissao.",
    status: "OK",
    source: "FL Statute 475.011",
  },
  {
    item: "Hotmart Brasil",
    detail: "Taxas 19.9% cartao, 9.9% Pix, payout em 14 dias.",
    status: "Ativo",
    source: "hotmart.com",
  },
  {
    item: "Demanda brasileira em Miami",
    detail: "Brasileiros seguem como publico estrangeiro relevante no mercado.",
    status: "Confirmado",
    source: "NAR 2024",
  },
  {
    item: "Ticket medio",
    detail: "Comprador brasileiro de Miami opera em faixas altas de patrimonio.",
    status: "Confirmado",
    source: "NAR 2024",
  },
  {
    item: "ITIN + EIN",
    detail: "Setup para foreign buyer ocorre em fluxo operacional conhecido.",
    status: "Viavel",
    source: "IRS Form W-7 + CAA",
  },
  {
    item: "FIRPTA",
    detail: "Withholding de 15% na venda por non-resident mapeado.",
    status: "Mapeado",
    source: "IRS FIRPTA",
  },
  {
    item: "WhatsApp + Pix + Stripe",
    detail: "Automacao comercial e pagamentos com stack operacional existente.",
    status: "Ativo",
    source: "Z-API / ChatGuru / Stripe",
  },
];

const revenueCards = [
  { label: "Day 1 max", value: "$985" },
  { label: "Week 1 max", value: "$7.5K" },
  { label: "Month 1 max", value: "$35K" },
];

const tiers = [
  {
    name: "Tier 0 · Lead Magnet",
    badge: "100% autonomo",
    price: "Gratis",
    description:
      'PDF "10 Erros Que Brasileiros Cometem ao Comprar Imovel em Miami" com captura por landing page, email e WhatsApp.',
  },
  {
    name: "Tier 1 · Course",
    badge: "100% autonomo",
    price: "$197",
    description:
      '"Miami Real Estate Mastery for Brazilian Investors" com 8 modulos, PDFs e entrega imediata via Hotmart.',
  },
  {
    name: "Tier 2 · Concierge",
    badge: "80% autonomo",
    price: "$1.997",
    description:
      "Servico premium de 8 semanas com introducoes, framework de closing e uma call Zoom por cliente.",
  },
  {
    name: "Tier 3 · Membership",
    badge: "99% autonomo",
    price: "$97/mes",
    description:
      "Substack Premium, grupo insider, relatorio mensal e Q&A recorrente para MRR.",
  },
];

const channels = [
  "WhatsApp warm network",
  "Instagram @miamiimoveisbr",
  "TikTok @miamiimoveisbr",
  "Substack newsletter",
  "Brazilian FB real estate groups",
  "Reddit / comunidades de investimento",
  "Meta Ads lookalike",
  "Google Ads long-tail BR",
];

const stack = [
  "Hotmart Brazil",
  "Carrd Pro",
  "Mailchimp",
  "Stripe",
  "ChatGuru / Z-API",
  "Calendly",
  "Make.com",
  "Notion",
  "Substack",
  "Claude API",
  "ElevenLabs",
  "CapCut Pro",
];

const executionSteps = [
  "H+0-H+1 · dominio + Hotmart + base da marca",
  "H+1-H+2 · outlines dos 8 modulos + scripts PT-BR",
  "H+2-H+3 · testes de voz + audio dos modulos iniciais",
  "H+3-H+4 · hero shots Brickell / Aventura / Sunny Isles",
  "H+4-H+8 · videos, PDF lead magnet e landing pages",
  "H+8-H+12 · automacoes, email sequences e conteudo de launch",
];

const kpis = [
  "Day 1 · 50-200 visitors, 10-50 captures, 1-5 vendas de course",
  "Week 1 · 800-3K visitors, 10-25 vendas de course, 1-3 concierge",
  "Month 1 · 5K-15K visitors, 40-150 vendas, 5-30 assinantes",
  "Fail signals · <30 visitors D1, 0 vendas D1, CAC > $100 no course",
];

const risks = [
  "Compliance FL §475: educational only, flat-fee, zero commission, zero property recommendation.",
  "Ban no WhatsApp: rotacionar disparos em blocos e usar conta Business/API.",
  "Qualidade de conteudo AI: revisao final humana e leitura nativa PT-BR.",
  "Split focus com XDRIVE: hard cap de 5h/sem apos o launch.",
];

const budget = [
  { item: "Dominio + branding", value: "$20" },
  { item: "Carrd Pro", value: "$19" },
  { item: "Make.com", value: "$54" },
  { item: "ChatGuru bot", value: "$90" },
  { item: "Calendly", value: "$30" },
  { item: "ElevenLabs", value: "$15" },
  { item: "Claude API", value: "$30" },
  { item: "CapCut Pro", value: "$30" },
  { item: "Meta Ads", value: "$150" },
  { item: "Google Ads test", value: "$30" },
  { item: "Reserva", value: "$32" },
];

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_42%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                P2HM IMOVEIS
              </span>
              <span>Brazilian Buyer Funnel · Miami real estate</span>
            </div>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Production-ready funnel para compradores brasileiros de imoveis em Miami.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              Operacao brand-led, auditavel e quase autonoma: lead magnet, course, concierge e membership
              estruturados para launch T+0 setup com revenue inicial em T+1.
            </p>
          </div>

          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Investimento total</p>
              <p className="mt-3 text-3xl font-semibold">$500</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Automatizado</p>
              <p className="mt-3 text-3xl font-semibold">95-99%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Primeiro revenue</p>
              <p className="mt-3 text-3xl font-semibold">T+1</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">ROI projetado</p>
              <p className="mt-3 text-3xl font-semibold">15x-70x</p>
            </div>
          </div>
        </div>
      </section>

      <section id="proxima-acao" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <SectionTitle
            eyebrow="Live state validado"
            title="7 pontos criticos confirmados antes da execucao"
            description="A tese fica ancorada em evidencia primaria recente: compliance, demanda, meios de pagamento, onboarding fiscal e infraestrutura operacional."
          />

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
            <div className="grid grid-cols-[1.2fr,2fr,0.8fr,1.2fr] gap-4 border-b border-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>Item</span>
              <span>Validacao</span>
              <span>Status</span>
              <span>Fonte</span>
            </div>
            <div className="divide-y divide-white/10">
              {validatedItems.map((entry) => (
                <div
                  key={entry.item}
                  className="grid grid-cols-1 gap-3 px-5 py-5 text-sm text-slate-200 md:grid-cols-[1.2fr,2fr,0.8fr,1.2fr]"
                >
                  <p className="font-medium text-white">{entry.item}</p>
                  <p>{entry.detail}</p>
                  <p className="text-cyan-300">{entry.status}</p>
                  <p className="text-slate-400">{entry.source}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-sm leading-7 text-emerald-50">
            <strong className="font-semibold text-white">Insight:</strong> brasileiros com ticket alto ja pagam
            fees relevantes a advogados e CPAs nos EUA. O gap esta em entregar educacao + concierge em PT-BR,
            com processo claro, velocidade e linguagem acessivel.
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <SectionTitle
            eyebrow="Resposta direta"
            title="$500, 99% autonomo e revenue a partir de amanha"
            description="O 1% manual remanescente e a call Zoom de 30-60 minutos no concierge. Fora isso, captacao, nurturing, checkout, entrega e grande parte do conteudo operam por automacao."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {revenueCards.map((card) => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{card.label}</p>
                <p className="mt-4 text-4xl font-semibold text-white">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 lg:col-span-2">
              <p className="text-sm leading-7 text-slate-300">
                Day 1 depende do warm network e da ativacao imediata dos ativos. Week 1 combina volume do course
                com os primeiros upsells do concierge. Month 1 adiciona compounding de ads, conteúdo recorrente e
                MRR da membership para ampliar a assimetria do retorno sobre o capital inicial.
              </p>
            </div>
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Founder</p>
              <p className="mt-3 text-2xl font-semibold">Paulo Henrique Hagenbeck</p>
              <p className="mt-4 text-sm text-cyan-50">P2HM Ventures LLC · Wyoming · Data 02/05/2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <SectionTitle
            eyebrow="Arquitetura end-to-end"
            title="4 tiers de monetizacao, do lead magnet ao recorrente"
            description="A operacao combina um front-end de captacao com ofertas digitais e um servico premium de apoio educacional sem comissao."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {tiers.map((tier) => (
              <article key={tier.name} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                      {tier.badge}
                    </span>
                    <span className="text-lg font-semibold text-white">{tier.price}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{tier.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 text-sm leading-7 text-amber-50">
            <strong className="font-semibold text-white">Compliance:</strong> concierge em flat-fee, conteudo
            educacional, introducoes e frameworks. Sem comissao, sem recomendacao de propriedade especifica, sem
            atuar como broker.
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr,0.8fr] lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Go-to-market"
              title="8 canais com distribuicao organica, warm e paid"
              description="A camada de marketing mistura audiencia proprietaria, captacao social e ativacao controlada de ads para validar a tese com custo baixo."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => (
                <div key={channel} className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
                  {channel}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="Ops stack"
              title="Ferramental enxuto para venda, entrega e nurturing"
              description="O stack cabe no budget de launch e cobre hospedagem do produto, automacao, checkout, CRM leve e producao assistida por IA."
            />
            <div className="grid gap-3">
              {stack.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <SectionTitle
            eyebrow="Execucao"
            title="Day 0 em 8-12h, Day 1 com engine ativa"
            description="A sequencia abaixo resume a montagem auditavel do funil e deixa claro o que precisa existir antes do disparo comercial."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold text-white">Day 0 · setup completo</h3>
              <div className="mt-5 space-y-3">
                {executionSteps.map((step) => (
                  <div key={step} className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold text-white">Day 1 · launch</h3>
              <div className="mt-5 space-y-3 text-sm text-slate-200">
                <div className="rounded-2xl bg-white/5 p-4">07:00-08:00 · Substack post + IG/Story + cross-post</div>
                <div className="rounded-2xl bg-white/5 p-4">08:00-09:00 · WhatsApp warm broadcast em blocos</div>
                <div className="rounded-2xl bg-white/5 p-4">09:00-10:00 · Meta Ads high-income lookalike</div>
                <div className="rounded-2xl bg-white/5 p-4">10:00-11:00 · Apollo outbound para wealth managers</div>
                <div className="rounded-2xl bg-white/5 p-4">11:00 em diante · bot, automacao, nurtures e booking</div>
              </div>
              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
                Day 1 esperado: $0-$985, puxado principalmente pela rede morna no WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Metricas"
              title="KPIs com thresholds claros de fail"
              description="Nao basta narrativa. O projeto so segue se houver trafego, conversao e CAC dentro dos limites definidos."
            />
            <div className="space-y-3">
              {kpis.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="Riscos e mitigacao"
              title="10 vetores reduzidos a um plano operacional objetivo"
              description="Os principais riscos foram traduzidos em mitigacoes praticas, com foco em compliance, qualidade percebida e preservacao do foco do founder."
            />
            <div className="space-y-3">
              {risks.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <SectionTitle
            eyebrow="Budget"
            title="$500 alocados de forma cirurgica"
            description="Cada linha do budget justifica um pedaço da maquina de captacao, entrega e automacao necessaria para o launch."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budget.map((entry) => (
              <div key={entry.item} className="rounded-3xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-300">{entry.item}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{entry.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <SectionTitle
            eyebrow="Proxima acao"
            title="Primeiras 4 horas de Paulo"
            description="O plano foi desenhado para reduzir o setup inicial ao minimo viavel e permitir drip release dos modulos restantes."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 text-sm text-slate-200">
              H+0-H+1 · registrar dominio, abrir Hotmart e separar docs da LLC.
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 text-sm text-slate-200">
              H+1-H+2 · gerar outlines e scripts dos 8 modulos em PT-BR.
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 text-sm text-slate-200">
              H+2-H+3 · validar 3 vozes, fechar audio dos modulos 1 e 2.
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 text-sm text-slate-200">
              H+3-H+4 · criar 8 hero shots e preparar o visual do launch.
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Decision rule</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50">
                Reavaliar no fim do mes: abaixo de $3K mata a tese; a partir de $5K escala com novo budget.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#proxima-acao"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100"
              >
                GO · Implementar funnel
              </a>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Ver dashboard atual
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
