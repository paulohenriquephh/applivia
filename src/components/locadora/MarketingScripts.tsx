"use client";

import { useState } from "react";

const AIRBNB_HOSTS_SCRIPT = `
SCRIPT MASSIVO — AIRBNB HOSTS MIAMI (PT/EN)
============================================
Versão PT (para hosts brasileiros/lusófonos):
─────────────────────────────────────────────
Olá! Meu nome é Gabriel da Miami Car Rental 🚗

Sou especializado em atender hóspedes brasileiros e latino-americanos aqui em Miami.

PROPOSTA: Receba 8% de comissão para cada carro alugado que você indicar para seus hóspedes.

✅ Entrega gratuita no endereço do seu imóvel
✅ Atendimento 24/7 em português
✅ Seguro completo incluso
✅ Carros novos (RAV4 Hybrid, sedãs, SUVs)
✅ Sem taxa de aeroporto ($70+ economizado)
✅ PIX/cartão/Zelle aceito

Comissão: Para cada booking de $400+, você recebe $32 automaticamente.
10 hóspedes/mês = $320 extra sem esforço.

Interesse? Manda mensagem aqui ou WhatsApp: [NÚMERO]
Enviamos contrato de parceria em 24h.

Atenciosamente,
Gabriel | Miami Car Rental
🌐 [WEBSITE] | 📱 [WHATSAPP]
─────────────────────────────────────────────
English Version (all hosts):
─────────────────────────────────────────────
Hi [Host Name]!

I noticed your property on Airbnb and wanted to reach out personally.

I run Miami Car Rental — a boutique fleet serving Airbnb guests with free delivery 
right to their rental address.

PARTNERSHIP OFFER:
• 8% commission on every booking from your guests
• Free delivery/pickup to any Miami address
• 24/7 guest support (English + Portuguese + Spanish)
• No airport fees — guests save $70+
• New vehicles: RAV4 Hybrid, SUVs, sedans

Average host earns: $280–$450/month in passive commissions.

Interested? Reply here or text/WhatsApp: [NUMBER]
Partnership agreement sent within 24 hours.

Best,
Gabriel | Miami Car Rental
[WEBSITE] | [WHATSAPP]
`;

const HOTEL_SCRIPT = `
SCRIPT CONCIERGE BOUTIQUE HOTELS
=================================
OBJETIVO: 3 visitas/dia nos primeiros 7 dias. Levar material impresso.

Abordagem:
─────────
"Bom dia! Meu nome é Gabriel, sou proprietário da Miami Car Rental, 
uma locadora boutique especializada em turistas que ficam em hotéis boutique.

Quero propor uma parceria de indicação:
- Seus hóspedes alugam conosco, entregamos direto na portaria
- Você recebe 12% de comissão por reserva confirmada
- Sem burocracia: link exclusivo do hotel + pagamento mensal

Para um hotel com 30 hóspedes/mês que alugam carro, isso é $1.200+/mês 
para o concierge ou para o fundo de funcionários."

Material a levar:
- Cartão de visita (frente PT, verso EN)
- Folheto bilíngue A4
- Proposta escrita de parceria

Hotéis alvo (boutique, não chains):
- Brickell: Kimpton EPIC, Langford
- South Beach: The Betsy, Pelican
- Wynwood: LIFE Hotel, Mr. Purple
- Coral Gables: Hotel Colonnade
`;

const WHATSAPP_GROUPS_SCRIPT = `
SCRIPT GRUPOS WHATSAPP/FACEBOOK — BRASILEIROS MIAMI
=====================================================
Grupos alvo (50+ grupos com 5K-100K membros):
- "Brasileiros em Miami"
- "Imigrantes Brasileiros na Flórida"  
- "Brasileiros em South Florida"
- "Miami Dicas Turistas Brasileiros"
- [buscar no FB: "brasileiros miami" → filtrar grupos]

POST MODELO (variar texto a cada 3 posts para não ser banido):

─ Versão 1 ─
🚗 ALUGUEL DE CARRO EM MIAMI — SEM TAXA DE AEROPORTO!

Miami Car Rental — atendimento em PORTUGUÊS 24/7

✅ RAV4 Hybrid, SUVs e sedãs novos
✅ Entrega no seu hotel/Airbnb grátis
✅ Economia de $70+ vs aeroporto
✅ Seguro completo incluso
✅ Aceito PIX internacional / Cartão
✅ Sem surpresas no checkout

A partir de $65/dia 📱 WhatsApp: [NÚMERO]
Resposta em minutos!

─ Versão 2 ─
Quem vai pra Miami e precisa de carro? 🇧🇷🚗

Meu nome é Gabriel, moro em Miami há X anos e abri uma locadora 
especialmente para atender brasileiros.

Sem estresse, sem fila, sem taxa de aeroporto.
Entrego o carro no seu Airbnb ou hotel.

Já atendi mais de [X] famílias brasileiras.

DM ou WhatsApp: [NÚMERO] 
(Aceito PIX via inter.co / Wise)

─ Versão 3 ─ (pós temporada carnaval/art basel)
Galera, fui no Art Basel / Carnaval de Miami e o carro foi essencial! 🎊

Usamos a Miami Car Rental (indicação de amigo) — atendimento em português, 
entrega no hotel, preço justo.

@GabrielMiamiCars no Instagram para ver a frota

REGRAS dos grupos:
- Não postar mais de 2x/semana por grupo
- Nunca usar bot/automação em grupos FB
- Responder todos comentários em 30 min
- Não prometer o que não pode cumprir
`;

const MARKETING_SCRIPTS = [
  { id: "airbnb", label: "🏠 Airbnb Hosts (EN/PT)", content: AIRBNB_HOSTS_SCRIPT },
  { id: "hotel", label: "🏨 Hotéis Boutique", content: HOTEL_SCRIPT },
  { id: "whatsapp", label: "💬 Grupos Brasileiros", content: WHATSAPP_GROUPS_SCRIPT },
];

const GOOGLE_ADS_TEMPLATE = `
CAMPANHA GOOGLE ADS — MIAMI CAR RENTAL
=======================================
Budget inicial: $500/mês (testar 30 dias)
Objetivo: Conversões (reservas ou WhatsApp click)

PALAVRAS-CHAVE (match phrase + exact):
─ "car rental miami delivery"
─ "miami car rental no airport fee"  
─ "aluguel de carro miami português"
─ "miami rent a car airbnb delivery"
─ "rent car miami beach cheap"
─ "miami car rental near me"
─ "locadora de carro miami"
─ "car rental miami doral"
─ "miami car rental rav4"

ANÚNCIO 1 (em inglês):
Headline 1: Miami Car Rental — Free Delivery
Headline 2: No Airport Fees — Save $70+
Headline 3: RAV4 Hybrid from $65/Day
Description: We deliver to your Airbnb or hotel. 24/7 support. Free insurance included. Book in minutes.
CTA: Book Now

ANÚNCIO 2 (em português):
Headline 1: Aluguel Carro Miami — Português 24/7
Headline 2: Sem Taxa Aeroporto | Entrega Grátis
Headline 3: A partir de $65/dia | PIX Aceito
Description: Atendimento em português, entrega no seu hotel ou Airbnb. Seguro incluso. Sem surpresas.
CTA: Reservar Agora

SEGMENTAÇÃO:
- Localização: Miami-Dade + turistas chegando (extension)
- Horário: 7am-11pm (pico reservas)
- Device: Mobile-first (70%+ reservas via celular)
- Audiência: Viajantes, ex-pat communities

META (conversão):
- CPC alvo: $1.50-3.00
- CTR alvo: >3%
- Conversion rate alvo: >4%
- CAC alvo: <$35/reserva
`;

export default function MarketingScripts() {
  const [activeScript, setActiveScript] = useState<string>("airbnb");
  const [showAds, setShowAds] = useState(false);

  const current = MARKETING_SCRIPTS.find((s) => s.id === activeScript);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="space-y-4">
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">📣</span> Scripts de Marketing Nuclear
        </h2>
        <p className="text-xs text-neutral-400">
          Scripts validados para canais com maior ROI. CAC alvo: &lt;$20 via parceiros, &lt;$35 via pago.
        </p>
      </div>

      {/* Scripts de parceria */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h3 className="text-sm font-bold text-white mb-3">Scripts de Parceria</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {MARKETING_SCRIPTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScript(s.id)}
              className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                activeScript === s.id
                  ? "bg-orange-600 text-white"
                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {current && (
          <div className="relative">
            <button
              onClick={() => copy(current.content)}
              className="absolute top-2 right-2 text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded z-10"
            >
              📋 Copiar
            </button>
            <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap bg-neutral-900 rounded-lg p-4 border border-neutral-700 max-h-72 overflow-auto">
              {current.content}
            </pre>
          </div>
        )}
      </div>

      {/* Google Ads */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🎯</span> Google Ads Template
          </h3>
          <button
            onClick={() => setShowAds(!showAds)}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            {showAds ? "▲ Recolher" : "▼ Expandir"}
          </button>
        </div>
        {showAds && (
          <div className="mt-3 relative">
            <button
              onClick={() => copy(GOOGLE_ADS_TEMPLATE)}
              className="absolute top-2 right-2 text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded z-10"
            >
              📋 Copiar
            </button>
            <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap bg-neutral-900 rounded-lg p-4 border border-neutral-700 max-h-72 overflow-auto">
              {GOOGLE_ADS_TEMPLATE}
            </pre>
          </div>
        )}
      </div>

      {/* Checklist de Execução */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h3 className="text-sm font-bold text-white mb-3">✅ Checklist Marketing — Semana 1</h3>
        <div className="space-y-2">
          {[
            ["D1", "Criar Google Business Profile (gratuito)"],
            ["D1", "Setup WhatsApp Business com catálogo de veículos"],
            ["D2", "Postar em 10 grupos FB brasileiros (manual, não bot)"],
            ["D2", "Contatar 100 hosts Airbnb via DM (n8n automation)"],
            ["D3", "Visitar 3 hotéis boutique pessoalmente"],
            ["D4", "Ativar Google Ads $500 campanha teste"],
            ["D4", "Criar perfil Instagram com fotos da frota"],
            ["D5", "TikTok: 1 vídeo entregando carro para hóspede"],
            ["D6", "Solicitar 5 reviews Google de clientes iniciais"],
            ["D7", "Relatório: qual canal gerou mais leads"],
          ].map(([dia, acao], i) => (
            <CheckItem key={i} dia={dia} acao={acao} />
          ))}
        </div>
      </div>

      {/* KPIs de marketing */}
      <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
        <h3 className="text-sm font-bold text-white mb-3">📊 KPIs de Marketing — Metas</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "CAC via parceiros", target: "<$20", great: "$5-12" },
            { label: "CAC via Google Ads", target: "<$50", great: "$20-35" },
            { label: "CTR Google Ads", target: ">3%", great: ">5%" },
            { label: "Conversion rate site", target: ">4%", great: ">8%" },
            { label: "WhatsApp response time", target: "<30 min", great: "<10 min" },
            { label: "Google rating alvo", target: ">4.7", great: "4.9" },
          ].map((kpi, i) => (
            <div key={i} className="bg-neutral-900 rounded-lg p-3 border border-neutral-700">
              <p className="text-xs text-neutral-400">{kpi.label}</p>
              <p className="text-sm font-bold text-white">{kpi.target}</p>
              <p className="text-xs text-green-400">Excelente: {kpi.great}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckItem({ dia, acao }: { dia: string; acao: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
        checked ? "bg-green-950/30" : "hover:bg-neutral-700"
      }`}
      onClick={() => setChecked(!checked)}
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
          checked ? "bg-green-600 border-green-600" : "border-neutral-600"
        }`}
      >
        {checked && <span className="text-white text-xs">✓</span>}
      </div>
      <span className="text-xs text-orange-400 font-bold w-6 shrink-0">{dia}</span>
      <span className={`text-xs ${checked ? "line-through text-neutral-500" : "text-neutral-300"}`}>
        {acao}
      </span>
    </div>
  );
}
