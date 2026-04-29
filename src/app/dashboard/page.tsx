import Link from "next/link";

const agents = [
  { id: "orchestrator", name: "Orchestrator", icon: "👔", description: "Coordenador geral de operações" },
  { id: "import", name: "Importação", icon: "🚢", description: "Fornecedores China/Itália" },
  { id: "advertising", name: "Publicidade", icon: "📢", description: "Meta, Google, TikTok Ads" },
  { id: "luxury_watch", name: "Relógios", icon: "⌚", description: "Análise técnica de luxo" },
  { id: "whatsapp_sdr", name: "WhatsApp SDR", icon: "💬", description: "Vendas via WhatsApp" },
  { id: "tiktok_growth", name: "TikTok", icon: "🎵", description: "Crescimento orgânico" },
  { id: "knowledge_sync", name: "Knowledge Sync", icon: "🧠", description: "Sincronização de dados" },
];

const services = [
  { name: "maestro-brain", port: 8000, description: "FastAPI backend" },
  { name: "maestro-crewai", port: 8002, description: "Multi-agent orchestration" },
  { name: "maestro-litellm", port: 4000, description: "LLM proxy" },
  { name: "maestro-n8n", port: 5678, description: "Automation workflows" },
  { name: "maestro-evolution", port: 8080, description: "WhatsApp API" },
  { name: "maestro-qdrant", port: 6333, description: "Vector database" },
  { name: "maestro-postgres", port: 5432, description: "PostgreSQL" },
  { name: "maestro-redis", port: 6379, description: "Redis cache" },
  { name: "maestro-grafana", port: 3000, description: "Monitoring" },
  { name: "maestro-prometheus", port: 9090, description: "Metrics" },
];

const dealSources = [
  { name: "Facebook Marketplace", angle: "vendedor local + urgência", cadence: "15 min", score: 9 },
  { name: "Craigslist Miami", angle: "private seller cash offer", cadence: "20 min", score: 8 },
  { name: "OfferUp", angle: "negociação rápida por chat", cadence: "20 min", score: 8 },
  { name: "AutoTempest / Autotrader", angle: "queda de preço e estoque parado", cadence: "60 min", score: 7 },
  { name: "Probate / estate sales", angle: "liquidação formal e documentada", cadence: "diário", score: 7 },
  { name: "Dealer wholesale lists", angle: "trade-in encalhado", cadence: "diário", score: 6 },
];

const alertRules = [
  "Preço 20%+ abaixo de KBB/private party comparável",
  "Título limpo, VIN verificável e sem inconsistência de odômetro",
  "Motivo de venda indica liquidez urgente, não vulnerabilidade explorável",
  "RAV4/Corolla/Camry/Highlander híbridos com baixa manutenção e seguro aceitável",
  "Distância até 80 mi de Miami ou custo de transporte já descontado",
  "Score final >= 82 dispara WhatsApp + e-mail em até 60 segundos",
];

const scoring = [
  { label: "Desconto vs. mercado", weight: "28%", note: "20-40% abaixo do comparável real" },
  { label: "Liquidez do vendedor", weight: "18%", note: "mudança, divórcio, inventário, dívida, carro parado" },
  { label: "Risco documental", weight: "16%", note: "título, VIN, lien, odômetro, recall, histórico" },
  { label: "Rentabilidade para locadora", weight: "14%", note: "ADR esperado, seguro, manutenção e downtime" },
  { label: "Velocidade de fechamento", weight: "10%", note: "cash today, inspeção móvel, assinatura remota" },
  { label: "Custo de recondicionamento", weight: "8%", note: "pneu, freio, bateria, pintura, interior" },
  { label: "Revenda/downside", weight: "6%", note: "saída rápida se a tese falhar" },
];

const dealExamples = [
  { vehicle: "2022 Toyota RAV4 Hybrid XLE", market: "$30.500", target: "$23.900", discount: "22%", score: 88, action: "WhatsApp imediato" },
  { vehicle: "2021 Toyota Camry Hybrid LE", market: "$24.800", target: "$18.900", discount: "24%", score: 85, action: "E-mail + call" },
  { vehicle: "2020 Toyota Highlander Hybrid", market: "$32.000", target: "$25.500", discount: "20%", score: 82, action: "Inspeção móvel" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-400 mb-2">Miami Car Deal Hunter</p>
            <h1 className="text-4xl font-black">Dashboard de compra 20-40% abaixo do mercado</h1>
            <p className="text-neutral-400 mt-2 max-w-3xl">
              Radar operacional para encontrar carros com desconto real, validar risco documental e disparar alertas
              por WhatsApp/e-mail antes do mercado reagir.
            </p>
          </div>
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors text-sm">
            ← Back
          </Link>
        </div>

        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-10">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-neutral-900 to-neutral-900 p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Modo executor</h2>
                <p className="text-neutral-300 mt-1">Score mínimo para alerta: 82/100</p>
              </div>
              <span className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-neutral-950">Ativo</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-neutral-950/70 p-4">
                <p className="text-sm text-neutral-400">Desconto alvo</p>
                <p className="text-3xl font-black">20-40%</p>
              </div>
              <div className="rounded-2xl bg-neutral-950/70 p-4">
                <p className="text-sm text-neutral-400">Tempo de alerta</p>
                <p className="text-3xl font-black">&lt;60s</p>
              </div>
              <div className="rounded-2xl bg-neutral-950/70 p-4">
                <p className="text-sm text-neutral-400">Canais</p>
                <p className="text-3xl font-black">WA + e-mail</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm font-semibold text-emerald-300">Posicionamento forte</p>
              <p className="mt-2 text-neutral-300">
                O sistema procura liquidez, não tragédia. Divórcio, inventário, mudança e aperto de caixa entram como
                sinais de urgência comercial; a regra é comprar barato com documentação limpa, sem assédio e sem risco
                reputacional que destrói a locadora antes do primeiro aluguel.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Notificações perfeitas</h2>
            <div className="space-y-3">
              {[
                ["WhatsApp", "Evolution API ou Twilio", "deal >= 82"],
                ["E-mail", "Resend/SMTP", "relatório + ficha do carro"],
                ["Dashboard", "/dashboard", "ranking e checklist"],
                ["Domínio", "deals.seudominio.com", "DNS + SSL + Vercel"],
              ].map(([channel, tool, trigger]) => (
                <div key={channel} className="rounded-2xl bg-neutral-800 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{channel}</p>
                    <span className="text-xs rounded-full bg-neutral-700 px-2 py-1 text-neutral-300">{trigger}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">{tool}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Fontes priorizadas</h2>
            <div className="space-y-3">
              {dealSources.map((source) => (
                <div key={source.name} className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl bg-neutral-800 p-4">
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-neutral-400">{source.angle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-300">{source.score}/10</p>
                    <p className="text-xs text-neutral-500">{source.cadence}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Regras de disparo</h2>
            <div className="space-y-3">
              {alertRules.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-2xl bg-neutral-800 p-4">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                  <p className="text-sm text-neutral-300">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 mb-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold">Score forense do deal</h2>
              <p className="text-sm text-neutral-400">Notas ponderadas para decidir em minutos sem comprar problema.</p>
            </div>
            <Link
              href="/api/car-deal-alerts"
              className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Ver blueprint JSON →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {scoring.map((item) => (
              <div key={item.label} className="rounded-2xl bg-neutral-800 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.label}</p>
                  <span className="text-sm font-bold text-emerald-300">{item.weight}</span>
                </div>
                <p className="text-sm text-neutral-400 mt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Ranking de oportunidades simuladas</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-white/10">
                  <th className="py-3 pr-4">Veículo</th>
                  <th className="py-3 pr-4">Mercado</th>
                  <th className="py-3 pr-4">Oferta alvo</th>
                  <th className="py-3 pr-4">Desconto</th>
                  <th className="py-3 pr-4">Score</th>
                  <th className="py-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {dealExamples.map((deal) => (
                  <tr key={deal.vehicle} className="border-b border-white/10 last:border-0">
                    <td className="py-4 pr-4 font-medium">{deal.vehicle}</td>
                    <td className="py-4 pr-4 text-neutral-300">{deal.market}</td>
                    <td className="py-4 pr-4 text-neutral-300">{deal.target}</td>
                    <td className="py-4 pr-4 text-emerald-300 font-bold">{deal.discount}</td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-emerald-400 px-3 py-1 font-bold text-neutral-950">
                        {deal.score}
                      </span>
                    </td>
                    <td className="py-4 text-neutral-300">{deal.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Domínio</h2>
            <ol className="space-y-3 text-sm text-neutral-300">
              <li>1. Comprar domínio curto: <span className="text-white">miamicardeals.ai</span> ou subdomínio.</li>
              <li>2. Apontar CNAME para Vercel/Cloudflare.</li>
              <li>3. Usar <span className="text-white">deals.seudominio.com</span> para o dashboard.</li>
              <li>4. SPF/DKIM/DMARC para e-mail de alerta não cair em spam.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Stack de automação</h2>
            <ol className="space-y-3 text-sm text-neutral-300">
              <li>1. Scraper/API de fontes permitidas.</li>
              <li>2. Normalização VIN/preço/milhas.</li>
              <li>3. Score + deduplicação.</li>
              <li>4. n8n dispara WhatsApp/e-mail.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Kill switch</h2>
            <ol className="space-y-3 text-sm text-neutral-300">
              <li>1. Sem título limpo: bloqueia.</li>
              <li>2. Sem VIN: bloqueia.</li>
              <li>3. Desconto sem prova comparável: revisão manual.</li>
              <li>4. Sinal de golpe: alerta vermelho, não negociar.</li>
            </ol>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">AI Agents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-neutral-900 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-neutral-400">{agent.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {services.map((service) => (
              <div key={service.name} className="bg-neutral-900 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{service.name}</p>
                  <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                    :{service.port}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
