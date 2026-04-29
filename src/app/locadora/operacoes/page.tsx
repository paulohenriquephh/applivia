"use client";

import { useState } from "react";
import Link from "next/link";

interface CheckItem {
  id: string;
  task: string;
  detail: string;
  category: "legal" | "vehicle" | "insurance" | "marketing" | "ops" | "finance";
  day: number;
  estimatedHours: number;
  cost?: string;
  source?: string;
}

const CHECKLIST: CheckItem[] = [
  { id: "llc", task: "Formar LLC Florida (Sunbiz.org)", detail: "Filing online $125. Nome: [Brand] LLC. Registered Agent necessário ($50-100/ano). Articles of Organization. EIN solicitado mesmo dia via IRS.gov.", category: "legal", day: 1, estimatedHours: 2, cost: "$125-225", source: "Sunbiz.org" },
  { id: "ein", task: "Obter EIN (IRS.gov)", detail: "Formulário SS-4 online, gratuito, emitido imediatamente se LLC já registrada. Necessário para conta bancária business.", category: "legal", day: 1, estimatedHours: 0.5, cost: "$0", source: "IRS.gov" },
  { id: "lbt", task: "Local Business Tax Receipt (Miami-Dade)", detail: "County + City BTR necessários. Filing online ou presencial. $50-150 dependendo da classificação.", category: "legal", day: 1, estimatedHours: 1, cost: "$50-150", source: "Miami-Dade County" },
  { id: "bank", task: "Abrir conta bancária business", detail: "Chase Business Complete ou Mercury (digital). Levar LLC docs + EIN + ID. Mercury aprovação em 1-2 dias.", category: "finance", day: 1, estimatedHours: 2, cost: "$0", source: "Chase/Mercury" },
  { id: "quotes", task: "3 quotes de seguro (GMI, Mesa, Blake)", detail: "Ligar para 3 specialty brokers. Commercial auto fleet coverage. $1M liability minimum. Comparar: premium, deductible, coverage gaps, excluded drivers. Budget: $300-500/carro/mês.", category: "insurance", day: 1, estimatedHours: 3, cost: "$600-1,000/mês", source: "GMI/Mesa/Blake Insurance" },
  { id: "car1", task: "Comprar RAV4 Hybrid #1 (cash)", detail: "Dealers: AutoNation Toyota, Earl Stewart Toyota, Rick Case. Negociar OTD (out-the-door) price. Target: $31-33K. Title transfer same-day se cash. Registration FLHSMV.", category: "vehicle", day: 2, estimatedHours: 4, cost: "$31-33K", source: "KBB 2026" },
  { id: "car2", task: "Comprar RAV4 Hybrid #2 (cash)", detail: "Mesmo processo. Se allocation issue, considerar Corolla Cross Hybrid ($28-30K) como alternativa.", category: "vehicle", day: 2, estimatedHours: 4, cost: "$31-33K", source: "KBB 2026" },
  { id: "inspect", task: "Inspeção e prep dos 2 veículos", detail: "Inspeção mecânica completa. Interior detailing ($150-200/carro). Instalar phone holder, charger, floor mats premium. Checklist 40 pontos.", category: "vehicle", day: 2, estimatedHours: 3, cost: "$400-500", source: "Operacional" },
  { id: "insurance-bind", task: "Ativar seguro (bind coverage)", detail: "Enviar VINs para broker escolhido. Binding letter = coverage ativa. Processo: 3-5 business days típico. Não operar sem seguro ativo.", category: "insurance", day: 2, estimatedHours: 1, cost: "Incluído premium", source: "Broker" },
  { id: "telematics", task: "Instalar telematics (Bouncie/Spireon)", detail: "OBD-II plug-in. $8-15/mês por device. Tracking GPS, velocidade, geofencing, alerts. Spireon para fleet >10 carros.", category: "ops", day: 3, estimatedHours: 1, cost: "$20-30/mês", source: "Bouncie.com" },
  { id: "contracts", task: "Preparar contrato de aluguel", detail: "Template attorney-reviewed. Cláusulas: liability waiver, deductible renter, mileage limit (250mi/dia), excluded areas, age 25+, clean driving record check. Portuguese + English.", category: "legal", day: 3, estimatedHours: 3, cost: "$300-500 attorney", source: "FL Statute 559" },
  { id: "admin-contract", task: "Contrato admin local (20% comissão)", detail: "KPIs: >85% utilization (bonus +2% acima 90%), NPS >4.5, response time <30min, weekly report. Trigger: se util <65% por 21 dias, renegociar ou encerrar.", category: "ops", day: 3, estimatedHours: 2, cost: "20% da receita", source: "Operacional" },
  { id: "website", task: "Website + booking simples", detail: "Carrd.co ($19/ano) ou Framer. Fotos profissionais. WhatsApp button. Booking form (Google Forms → Zapier → notification). SEO básico.", category: "marketing", day: 3, estimatedHours: 4, cost: "$19-100", source: "Carrd.co" },
  { id: "socials", task: "Instagram + Google My Business", detail: "Instagram business account. 9 posts iniciais (fotos carros, Miami, reviews). Google My Business listing. WhatsApp Business com catálogo.", category: "marketing", day: 4, estimatedHours: 3, cost: "$0", source: "Instagram/Google" },
  { id: "partnerships-50", task: "50 parcerias Airbnb hosts (script)", detail: "Buscar Airbnb listings Miami com >100 reviews. DM template oferecendo 8% comissão por referral. Target: 50 hosts contactados, 10-15 convertidos mês 1.", category: "marketing", day: 4, estimatedHours: 4, cost: "8% por booking", source: "Airbnb.com" },
  { id: "nicho-pt", task: "Ativar nicho brasileiro", detail: "Entrar em 20+ grupos Facebook brasileiros em Miami. WhatsApp broadcasting. Parcerias com restaurantes brasileiros (Fogo de Chão, etc). Flyers em consulado.", category: "marketing", day: 5, estimatedHours: 3, cost: "$100-200", source: "Facebook Groups" },
  { id: "pricing", task: "Setup dynamic pricing", detail: "Planilha Google Sheets com rate card: weekday $55-65, weekend $75-95, peak season $100-130, weekly discount 15%. Review semanal baseado em ocupação.", category: "ops", day: 5, estimatedHours: 2, cost: "$0", source: "Operacional" },
  { id: "soft-launch", task: "Soft launch — primeiros 5 bookings", detail: "Oferecer rate 10% abaixo market para primeiros 5 clientes. Pedir review 5 estrelas. Processo completo: screening, contrato, pickup/delivery, inspeção retorno.", category: "ops", day: 5, estimatedHours: 8, cost: "Desconto 10%", source: "Operacional" },
  { id: "ads", task: "Lançar anúncios (Google + Instagram)", detail: "Google Ads: 'car rental Miami' + 'aluguel de carro Miami'. Instagram: Reels dos carros. Budget: $500-1K mês 1, ROI tracking via UTM.", category: "marketing", day: 6, estimatedHours: 3, cost: "$500-1K/mês", source: "Google/Meta Ads" },
  { id: "metrics", task: "Dashboard de métricas semana 1", detail: "Google Sheets ou Notion. Tracking: ocupação %, receita, custos, NPS, leads, conversion rate, CAC. Review diário.", category: "finance", day: 7, estimatedHours: 2, cost: "$0", source: "Operacional" },
];

const GUARDRAILS = [
  {
    title: "Guardrail 1: Insurance < $500/carro/mês",
    description: "Se quotes vierem > $500/carro/mês, negociar deductible mais alto ($2,500 vs $1,000) ou pivotar para personal coverage com endorsement rental (consultar broker). Não operar com custo de seguro que consome >20% da receita bruta.",
    trigger: "Quotes > $500/carro",
    action: "Renegociar deductible ou pivotar coverage type",
    color: "border-amber-800/40 bg-amber-950/20",
  },
  {
    title: "Guardrail 2: Utilização > 65% após 21 dias",
    description: "Se após 21 dias de operação, utilização média < 65%, executar: (1) Reduzir rate 10-15%, (2) Intensificar outreach parcerias, (3) Se < 50% após 30 dias, listar 1 carro no Turo como bridge.",
    trigger: "Util < 65% dia 21",
    action: "Rate cut + outreach + Turo bridge",
    color: "border-red-800/40 bg-red-950/20",
  },
  {
    title: "Guardrail 3: Zero escala sem $10K cash reserve",
    description: "Não comprar 3º carro até ter $10K em cash reserve (operating buffer 3 meses de custos para 2 carros). Protege contra: claim inesperado, mês de baixa temporada, reparo emergencial.",
    trigger: "Cash reserve < $10K",
    action: "Parar expansão, acumular reserve",
    color: "border-blue-800/40 bg-blue-950/20",
  },
  {
    title: "Guardrail 4: Admin performance review 30/60/90 dias",
    description: "Avaliar admin nos marcos 30/60/90 dias. Critérios: util target, tempo de resposta, NPS, compliance com processos. Se falhar 2+ critérios em qualquer marco, trigger plano de melhoria 15 dias → rescisão se não melhorar.",
    trigger: "Admin falha 2+ KPIs",
    action: "PIP 15 dias → rescisão",
    color: "border-purple-800/40 bg-purple-950/20",
  },
  {
    title: "Guardrail 5: Claim >$5K = pause + audit",
    description: "Se qualquer claim exceder $5K out-of-pocket: (1) Pausar novos bookings 48h, (2) Auditar screening process, (3) Revisar coverage com broker, (4) Implementar medida preventiva antes de retomar. Nunca normalizar claims altos.",
    trigger: "Claim > $5K OOP",
    action: "Pause 48h + audit + review coverage",
    color: "border-red-800/40 bg-red-950/20",
  },
];

const SCALING_MILESTONES = [
  { month: 1, cars: "2", revenue: "$3-4K", profit: "$800-1,500", focus: "Validação: util >70%, processo rodando, primeiros reviews 5★" },
  { month: 2, cars: "2-3", revenue: "$4-6K", profit: "$1,200-2,500", focus: "Otimização: rate tuning, 30+ parcerias ativas, nicho PT validado" },
  { month: 3, cars: "3-5", revenue: "$7-12K", profit: "$2,500-5,000", focus: "Primeiro scaling: 3º carro só com $10K reserve. Mix standard + 1 SUV premium" },
  { month: 6, cars: "8-15", revenue: "$20-45K", profit: "$6-15K", focus: "Growth mode: fleet management software, 2º admin, dealer license process" },
  { month: 12, cars: "20-40", revenue: "$50-120K", profit: "$15-40K", focus: "Operação madura: 3 admins, staging lot, 200+ parcerias, luxury mix 10-15%" },
  { month: 18, cars: "40-80", revenue: "$100-250K", profit: "$30-80K", focus: "Escala: 2ª localização, fleet financing considerado, valuation para exit/raise" },
];

const categoryColors: Record<string, string> = {
  legal: "bg-blue-900/30 text-blue-400 border-blue-800/30",
  vehicle: "bg-emerald-900/30 text-emerald-400 border-emerald-800/30",
  insurance: "bg-red-900/30 text-red-400 border-red-800/30",
  marketing: "bg-purple-900/30 text-purple-400 border-purple-800/30",
  ops: "bg-amber-900/30 text-amber-400 border-amber-800/30",
  finance: "bg-cyan-900/30 text-cyan-400 border-cyan-800/30",
};

const categoryLabels: Record<string, string> = {
  legal: "Legal",
  vehicle: "Veículo",
  insurance: "Seguro",
  marketing: "Marketing",
  ops: "Operações",
  finance: "Finanças",
};

export default function OperacoesPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalItems = CHECKLIST.length;
  const completedItems = checked.size;
  const progress = (completedItems / totalItems) * 100;

  const totalCostLow = 64_000;
  const totalCostHigh = 69_000;

  const days = Array.from(new Set(CHECKLIST.map(c => c.day))).sort((a, b) => a - b);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link href="/locadora" className="text-neutral-500 hover:text-white text-sm transition-colors">
            &larr; Locadora
          </Link>
          <h1 className="text-3xl font-bold mt-2">Plano Operacional</h1>
          <p className="text-neutral-400 text-sm mt-1">
            7 dias para primeira receita &middot; Checklist executável &middot; 5 guardrails
          </p>
        </div>

        {/* Progress */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">Progresso</h3>
              <p className="text-xs text-neutral-400 mt-1">{completedItems}/{totalItems} tarefas ({Math.round(progress)}%)</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-neutral-400">Investimento estimado</p>
              <p className="font-bold text-amber-400">${totalCostLow.toLocaleString()} - ${totalCostHigh.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">(2 carros + setup completo)</p>
            </div>
          </div>
          <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist by Day */}
        <div className="space-y-8 mb-12">
          {days.map(day => (
            <div key={day}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-sm font-mono">
                  {day}
                </span>
                Dia {day}
              </h2>
              <div className="space-y-2">
                {CHECKLIST.filter(c => c.day === day).map(item => (
                  <div
                    key={item.id}
                    className={`rounded-lg border border-neutral-800 p-4 transition-all ${
                      checked.has(item.id) ? "bg-neutral-800/30 opacity-60" : "bg-neutral-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggle(item.id)}
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          checked.has(item.id)
                            ? "bg-emerald-600 border-emerald-600"
                            : "border-neutral-600 hover:border-emerald-500"
                        }`}
                      >
                        {checked.has(item.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className={`font-medium text-sm ${checked.has(item.id) ? "line-through text-neutral-500" : ""}`}>
                            {item.task}
                          </h4>
                          <span className={`text-xs px-2 py-0.5 rounded border ${categoryColors[item.category]}`}>
                            {categoryLabels[item.category]}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">{item.detail}</p>
                        <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                          {item.cost && <span>Custo: <span className="text-neutral-300">{item.cost}</span></span>}
                          <span>Tempo: <span className="text-neutral-300">{item.estimatedHours}h</span></span>
                          {item.source && <span>Fonte: <span className="text-neutral-300">{item.source}</span></span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Guardrails */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">5 Guardrails Nucleares</h2>
          <div className="space-y-4">
            {GUARDRAILS.map((g, i) => (
              <div key={i} className={`rounded-xl border p-5 ${g.color}`}>
                <h3 className="font-bold mb-2">{g.title}</h3>
                <p className="text-sm text-neutral-300 leading-relaxed mb-3">{g.description}</p>
                <div className="flex gap-6 text-xs">
                  <div>
                    <span className="text-neutral-400">Trigger: </span>
                    <span className="text-amber-400 font-medium">{g.trigger}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Ação: </span>
                    <span className="text-emerald-400 font-medium">{g.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scaling Roadmap */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Roadmap de Escala (Realista)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700 text-neutral-400 text-xs">
                  <th className="text-left py-3 px-3">Mês</th>
                  <th className="text-center py-3 px-3">Frota</th>
                  <th className="text-right py-3 px-3">Receita/mês</th>
                  <th className="text-right py-3 px-3">Lucro/mês</th>
                  <th className="text-left py-3 px-3">Foco</th>
                </tr>
              </thead>
              <tbody>
                {SCALING_MILESTONES.map(m => (
                  <tr key={m.month} className="border-b border-neutral-800/50">
                    <td className="py-3 px-3 font-mono text-emerald-400">M{m.month}</td>
                    <td className="py-3 px-3 text-center font-bold">{m.cars}</td>
                    <td className="py-3 px-3 text-right text-blue-400">{m.revenue}</td>
                    <td className="py-3 px-3 text-right text-emerald-400">{m.profit}</td>
                    <td className="py-3 px-3 text-neutral-300 text-xs">{m.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-500 mt-3 italic">
            * Números conservadores baseados em util 72-85%, rate $55-85/dia, margem 25-30%. 
            Não inclui luxury mix, sazonalidade peak, ou financing acceleration.
          </p>
        </div>

        {/* Partnership Script */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5 mb-8">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Script de Parceria (Airbnb Hosts)</h3>
          <div className="bg-neutral-800 rounded-lg p-4 text-sm text-neutral-300 leading-relaxed font-mono">
            <p className="text-amber-400 mb-2">{`// Template DM — adaptar por host`}</p>
            <p className="mb-2">Hi [Name]! 👋</p>
            <p className="mb-2">I run a car rental service in Miami and noticed your beautiful property [address/area]. Many of your guests probably need a car during their stay.</p>
            <p className="mb-2">I&apos;d love to offer your guests a special rate on our SUVs (Toyota RAV4 Hybrid — great on gas, perfect for Miami). We offer free delivery to your property.</p>
            <p className="mb-2">For every guest you refer, I&apos;ll pay you 8% commission on the rental. Most hosts earn $50-150/month with just 2-3 referrals.</p>
            <p className="mb-2">No commitment needed — I can send you a simple link to share with guests. Interested? 🚗</p>
            <p className="text-neutral-500 mt-4">{`// Versão PT para hosts brasileiros`}</p>
            <p className="mt-2 text-neutral-400">Oi [Nome]! Tenho uma locadora de carros em Miami e vi que seu imóvel é incrível. Seus hóspedes provavelmente precisam de carro. Ofereço SUVs híbridos com entrega grátis no seu endereço. Pago 8% de comissão por cada indicação. A maioria dos hosts ganha $50-150/mês com 2-3 indicações. Sem compromisso — te mando um link simples para compartilhar. Interesse? 🚗</p>
          </div>
        </div>

        {/* Admin Contract KPIs */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">KPIs do Contrato Admin</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-xs text-neutral-400">Utilização Target</p>
              <p className="text-2xl font-bold text-emerald-400">&gt;85%</p>
              <p className="text-xs text-neutral-500">Bonus +2% acima 90%</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-xs text-neutral-400">NPS / Rating</p>
              <p className="text-2xl font-bold text-blue-400">&gt;4.5</p>
              <p className="text-xs text-neutral-500">Google + direct reviews</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-xs text-neutral-400">Response Time</p>
              <p className="text-2xl font-bold text-amber-400">&lt;30min</p>
              <p className="text-xs text-neutral-500">WhatsApp + phone</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-xs text-neutral-400">Weekly Report</p>
              <p className="text-2xl font-bold text-purple-400">Obrigatório</p>
              <p className="text-xs text-neutral-500">P&L + ocupação + issues</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-xs text-neutral-400">Comissão Base</p>
              <p className="text-2xl font-bold text-cyan-400">20%</p>
              <p className="text-xs text-neutral-500">Da receita bruta</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-xs text-neutral-400">Trigger Renegociação</p>
              <p className="text-2xl font-bold text-red-400">&lt;65%</p>
              <p className="text-xs text-neutral-500">Util por 21 dias consecutivos</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
