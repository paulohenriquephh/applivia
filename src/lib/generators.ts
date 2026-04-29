/**
 * Generators — Contratos, Marketing, Parcerias, Checklists
 */

export interface ChecklistItem {
  id: string;
  day: number;
  hour: string;
  task: string;
  category: 'legal' | 'insurance' | 'fleet' | 'marketing' | 'ops' | 'tech' | 'finance';
  priority: 'critical' | 'high' | 'medium';
  status: 'pending' | 'done';
  details: string;
  cost: string;
  evidence: string;
}

export interface PartnershipScript {
  type: string;
  target: string;
  subject: string;
  body: string;
  expectedResponse: string;
  commission: string;
}

export interface ContractClause {
  section: string;
  clause: string;
  importance: 'critical' | 'high' | 'medium';
  legalNote: string;
}

export function generateLaunchChecklist(): ChecklistItem[] {
  return [
    {
      id: "llc",
      day: 1, hour: "00:00-02:00",
      task: "Registrar LLC na Sunbiz FL",
      category: "legal",
      priority: "critical",
      status: "pending",
      details: "sunbiz.org → File LLC → Name: [Brand] Rentals LLC → Registered Agent: self or NW Registered Agent → Articles of Organization",
      cost: "$125 filing + $25 registered agent/ano",
      evidence: "FL Statute 605 — LLC Act. Sunbiz processing 24h online."
    },
    {
      id: "ein",
      day: 1, hour: "02:00-03:00",
      task: "Obter EIN do IRS",
      category: "legal",
      priority: "critical",
      status: "pending",
      details: "irs.gov/ein → Apply online → Single-member LLC → Receive EIN instantly",
      cost: "$0",
      evidence: "IRS SS-4 form, instant online for US persons."
    },
    {
      id: "btr",
      day: 1, hour: "03:00-04:00",
      task: "Business Tax Receipt Miami-Dade",
      category: "legal",
      priority: "critical",
      status: "pending",
      details: "miamidade.gov/taxcollector → Business Tax Application → Auto Rental category → Home-based or commercial address",
      cost: "$50-150/ano",
      evidence: "Miami-Dade County Ordinance 8A."
    },
    {
      id: "bank",
      day: 1, hour: "04:00-06:00",
      task: "Abrir conta business banking",
      category: "finance",
      priority: "critical",
      status: "pending",
      details: "Chase/Bank of America business checking → EIN + LLC Articles + ID → Deposit initial capital",
      cost: "$0 (free business checking promos)",
      evidence: "Chase Business Complete Banking, $0 fee com $2K balance."
    },
    {
      id: "ins-quote-1",
      day: 1, hour: "06:00-08:00",
      task: "Quote #1 — GMI Insurance",
      category: "insurance",
      priority: "critical",
      status: "pending",
      details: "gmiinsurance.com → Commercial Auto / Rental Fleet → 2 RAV4 Hybrid 2024 → $1M CSL + $50K comp/collision → Driver age 25+ clean record only",
      cost: "Expected $300-400/mês total 2 carros",
      evidence: "GMI specialty broker FL, rental fleet experience. Quote dentro de 24-48h."
    },
    {
      id: "ins-quote-2",
      day: 1, hour: "08:00-10:00",
      task: "Quote #2 — Mesa Underwriters",
      category: "insurance",
      priority: "critical",
      status: "pending",
      details: "mesaunderwriters.com → Rent-A-Car program → Same specs → Compare deductibles and liability limits",
      cost: "Expected $350-450/mês total 2 carros",
      evidence: "Mesa specializes in RAC (Rent-A-Car) programs nationally."
    },
    {
      id: "ins-quote-3",
      day: 1, hour: "10:00-12:00",
      task: "Quote #3 — Blake Insurance / Univista",
      category: "insurance",
      priority: "high",
      status: "pending",
      details: "blakeinsurance.com + univistainsurance.com → Rental fleet quotes → Compare all 3 → SELECT LOWEST with best coverage",
      cost: "Expected $300-500/mês total 2 carros",
      evidence: "Multiple quotes = leverage para negociação. Target <$400/mês total."
    },
    {
      id: "car-search",
      day: 1, hour: "12:00-14:00",
      task: "Buscar 2x RAV4 Hybrid — dealers + private",
      category: "fleet",
      priority: "critical",
      status: "pending",
      details: "AutoTrader + Cars.com + CarGurus → 2024-2025 RAV4 Hybrid LE/XLE → <15K miles → Cash deal → Target $28-31K each",
      cost: "$56,000-62,000 total cash",
      evidence: "KBB 2025 RAV4 Hybrid: $30,990-$33,740 MSRP new. Used 2024 <15K: $28-31K."
    },
    {
      id: "car-inspect",
      day: 1, hour: "14:00-16:00",
      task: "Inspeção mecânica + test drive",
      category: "fleet",
      priority: "critical",
      status: "pending",
      details: "Pre-purchase inspection por mecânico independente. Verificar: hybrid battery, brakes, tires, AC (crucial Miami), body damage.",
      cost: "$150-200 por inspeção",
      evidence: "Toyota hybrid battery warranty 10yr/150K mi. Mecânico: $100-200."
    },
    {
      id: "car-purchase",
      day: 1, hour: "16:00-18:00",
      task: "Comprar 2 RAV4 Hybrid — cash + title transfer",
      category: "fleet",
      priority: "critical",
      status: "pending",
      details: "Cashier's check ou wire transfer → Title transfer FL DMV → Register in LLC name → Tag & registration",
      cost: "$56-62K + $450 tag/registration per vehicle",
      evidence: "FL DMV title transfer: $75.25 + $225 registration + sales tax (6% + county)."
    },
    {
      id: "website",
      day: 1, hour: "18:00-20:00",
      task: "Website + booking system live",
      category: "tech",
      priority: "high",
      status: "pending",
      details: "Squarespace/Wix com booking widget OU custom Next.js + Stripe. Domínio: [brand]rentals.com. SEO básico: Miami car rental, aluguel carro Miami.",
      cost: "$12-20/mês hosting + $12/ano domínio",
      evidence: "Squarespace: 14-day trial, booking add-on $27/mês. Custom: $0 Vercel."
    },
    {
      id: "partnerships-500",
      day: 1, hour: "20:00-24:00",
      task: "Enviar 500 scripts de parceria — Airbnb hosts",
      category: "marketing",
      priority: "high",
      status: "pending",
      details: "Airbnb Miami → copiar perfis de hosts com 10+ reviews → enviar email/DM com script de parceria 8% comissão por booking",
      cost: "$0 (tempo)",
      evidence: "Airbnb Miami: 15K+ listings. 500 outreach = ~50 partners (10% conversion rate)."
    },
    {
      id: "admin-contract",
      day: 2, hour: "00:00-04:00",
      task: "Contrato admin local — 20% + KPIs",
      category: "ops",
      priority: "high",
      status: "pending",
      details: "Independent contractor agreement: 20% of net revenue, KPIs: >90% occupancy, NPS >4.8, response <15min, 21-day review trigger. Bonus: 5% extra above 90% util.",
      cost: "20% net revenue",
      evidence: "IC agreement FL: no payroll tax, 1099 end of year. KPIs enforceáveis via contract."
    },
    {
      id: "ai-setup",
      day: 2, hour: "04:00-08:00",
      task: "Setup AI pricing + telematics",
      category: "tech",
      priority: "high",
      status: "pending",
      details: "PriceLabs: connect listings, set min/max, enable demand-based pricing. Spireon: install GPS/telematics em ambos carros. Zapier: automate booking→contract→payment.",
      cost: "PriceLabs $20/listing + Spireon $25/car + Zapier $50/mês",
      evidence: "PriceLabs used by 100K+ STR hosts. Spireon FleetLocate standard for rental fleets."
    },
    {
      id: "soft-launch",
      day: 2, hour: "08:00-24:00",
      task: "Soft launch — primeiros 5-10 bookings",
      category: "ops",
      priority: "high",
      status: "pending",
      details: "Google Business Profile + Instagram + WhatsApp Business + primeiros bookings de rede pessoal/brasileira. Price: $55-65/dia introductory.",
      cost: "$0",
      evidence: "Soft launch valida operations antes de full marketing spend."
    },
    {
      id: "nicho-pt",
      day: 3, hour: "00:00-12:00",
      task: "Ativar nicho brasileiro — 50 grupos FB + WhatsApp",
      category: "marketing",
      priority: "high",
      status: "pending",
      details: "Grupos FB: 'Brasileiros em Miami', 'Aluguel carro Miami brasileiros'. WhatsApp: broadcast list. Menu 100% PT. PIX via Wise/Remessa.",
      cost: "$0",
      evidence: "1M+ brasileiros visitam Miami/ano. Nicho underserved para car rental em PT."
    },
    {
      id: "full-launch",
      day: 4, hour: "00:00-24:00",
      task: "Full launch — Google Ads + FB/IG ads",
      category: "marketing",
      priority: "high",
      status: "pending",
      details: "Google Ads: 'car rental Miami' + 'aluguel carro Miami' + 'SUV rental Miami Beach'. FB/IG: targeting tourists + Brazilian community. Budget: $500-1K/mês.",
      cost: "$500-1,000/mês ads",
      evidence: "Google Ads CPC car rental Miami: $2-5. Target CAC <$20."
    },
    {
      id: "metrics-day7",
      day: 7, hour: "00:00-24:00",
      task: "Review métricas Day 7 — PIVOT trigger check",
      category: "ops",
      priority: "critical",
      status: "pending",
      details: "Check: util >70%? Revenue >$2K? Insurance bound <$400? NPS >4.5? Claims 0? Se 3+ fail → pivot para Turo/1 carro.",
      cost: "$0",
      evidence: "7-day checkpoint prevents throwing good money after bad. Data-driven pivot."
    },
  ];
}

export function generatePartnershipScripts(): PartnershipScript[] {
  return [
    {
      type: "Airbnb Host",
      target: "Superhosts com 10+ reviews em Miami Beach / Brickell / Downtown",
      subject: "Partnership: Earn 8% on Every Car Rental Booking from Your Guests",
      body: `Hi [Host Name],

I noticed your beautiful property at [Address] with outstanding reviews. I run a local car rental service here in Miami and I'd love to offer your guests a premium experience.

Here's the deal:
• Your guests get $10 off their first rental + free delivery to your property
• You earn 8% commission on every booking from your referral
• We handle everything — delivery, pickup, 24/7 support
• Fleet: Toyota RAV4 Hybrid (fuel efficient, perfect for Miami)

No cost to you. I'll create a custom booking link with your unique code. Just share it in your welcome guide or house manual.

Interested? Reply here or WhatsApp me at [number].

Best,
[Name] — [Brand] Rentals Miami`,
      expectedResponse: "10-15% response rate, 5-8% conversion to active partner",
      commission: "8% of booking value"
    },
    {
      type: "Hotel Concierge",
      target: "Boutique hotels em South Beach / Wynwood / Coral Gables",
      subject: "Car Rental Partnership — Revenue Share for Your Front Desk Team",
      body: `Dear [Hotel Name] Concierge Team,

I'd like to propose a partnership that benefits your guests and your team.

We provide premium car rentals with free delivery to your hotel:
• SUVs & Hybrids (RAV4 Hybrid, luxury options available)
• 10% commission per booking to the hotel
• Free delivery/pickup at your lobby
• 24/7 bilingual support (English/Portuguese/Spanish)
• Competitive rates vs airport rentals (save 20-30%)

We can set up a QR code at your front desk or integrate with your concierge recommendations.

Happy to meet in person this week.

Best regards,
[Name] — [Brand] Rentals Miami`,
      expectedResponse: "5-10% response rate, 3-5% conversion",
      commission: "10% of booking value"
    },
    {
      type: "Brazilian Community",
      target: "Grupos FB + WhatsApp de brasileiros em Miami",
      subject: "🇧🇷 Aluguel de Carro em Miami — Atendimento 100% em Português",
      body: `Oi pessoal! 🇧🇷

Sou brasileiro e abri uma locadora aqui em Miami especialmente para atender nossa comunidade.

✅ Atendimento 100% em português
✅ WhatsApp 24/7
✅ Aceito PIX (via Wise)
✅ Entrega GRÁTIS no hotel/Airbnb
✅ SUV Toyota RAV4 Hybrid — econômico e espaçoso
✅ Sem taxa de aeroporto (economia de 20-30%)
✅ Seguro completo incluso

📱 WhatsApp: [number]
🌐 [website]

Primeira reserva: cupom BRASIL10 = 10% desconto!

Quem quiser indicar amigos: 8% de comissão por reserva. 💰`,
      expectedResponse: "20-30% engagement rate em grupos brasileiros, 5-10% conversion",
      commission: "8% referral para quem indicar"
    },
    {
      type: "Cruise Terminal",
      target: "PortMiami — cruise passenger pickup/dropoff",
      subject: "Car Rental Service for Cruise Passengers — Pre/Post Cruise",
      body: `Dear [Cruise Line / Terminal Manager],

We offer car rental services specifically for cruise passengers:

• Pre-cruise: Rent a car to explore Miami before sailing
• Post-cruise: Pick up a car at the port for your Florida road trip
• Free delivery/pickup at PortMiami terminals
• Daily & weekly rates available
• Fleet: SUVs perfect for families with luggage

We'd like to explore a partnership where we can be included in your pre-arrival communications or recommended services list.

Commission structure available for your team.

Best,
[Name] — [Brand] Rentals Miami`,
      expectedResponse: "Low response (corporate), but high value per conversion",
      commission: "Negotiable — 5-10% or flat fee per booking"
    },
    {
      type: "Event/Festival",
      target: "Art Basel, Ultra Music Festival, Miami GP, Brazilian events",
      subject: "Official Car Rental Partner — [Event Name] 2026",
      body: `Dear [Event Organizer],

We'd like to be an official car rental partner for [Event Name] 2026.

Our offer:
• Dedicated fleet for event attendees (SUVs, luxury options)
• Special event pricing with attendee discount code
• Free delivery to event venues/hotels
• 24/7 support in English, Portuguese, and Spanish
• Revenue share: 10% of all bookings through event channels

We can provide promotional materials, QR codes, and custom landing pages.

Previous partnerships: [list or "Growing fleet serving Miami's biggest events"]

Let's discuss!

[Name] — [Brand] Rentals Miami`,
      expectedResponse: "Variable — high season events can drive 100%+ rate increases",
      commission: "10% revenue share or fixed sponsorship"
    }
  ];
}

export function generateContractClauses(): ContractClause[] {
  return [
    {
      section: "1. Partes & Veículo",
      clause: "Este contrato é celebrado entre [COMPANY LLC], uma Limited Liability Company registrada no estado da Florida, e o LOCATÁRIO identificado, para aluguel do veículo [MAKE/MODEL/YEAR/VIN/PLATE].",
      importance: "critical",
      legalNote: "VIN obrigatório para insurance e liability. FL Statute 324.021."
    },
    {
      section: "2. Período & Rates",
      clause: "Período de aluguel: [DATA INÍCIO] a [DATA FIM]. Rate: $[DAILY]/dia ou $[WEEKLY]/semana. Overtime: $[HOURLY]/hora após horário de devolução, máximo 3h, após = dia adicional cobrado.",
      importance: "critical",
      legalNote: "Overtime clause previne abusos. FL Statute 559.921."
    },
    {
      section: "3. Insurance & Liability",
      clause: "Veículo coberto por seguro comercial com $1,000,000 Combined Single Limit. Locatário é responsável por deductible de $[1,000-2,500] em caso de dano/acidente. Locatário DEVE possuir seguro pessoal de auto válido ou adquirir cobertura suplementar oferecida pela locadora.",
      importance: "critical",
      legalNote: "FL minimum liability $10K/$20K/$10K é insuficiente para rental. $1M CSL é industry standard."
    },
    {
      section: "4. Qualificação do Motorista",
      clause: "Motorista deve ter: (a) 25+ anos de idade; (b) carteira de motorista válida por 2+ anos; (c) histórico limpo (sem DUI/DWI últimos 5 anos, máximo 2 violations 3 anos); (d) cartão de crédito em nome próprio para depósito caução.",
      importance: "critical",
      legalNote: "Age 25+ reduz claims 40%+ (NHTSA data). Insurance geralmente exige 25+ para commercial."
    },
    {
      section: "5. Proibições de Uso",
      clause: "Proibido: (a) uso fora dos EUA; (b) sublocação; (c) uso comercial (rideshare/delivery); (d) off-road; (e) sob efeito de substâncias; (f) por motoristas não autorizados; (g) em competições; (h) transporte de materiais perigosos.",
      importance: "critical",
      legalNote: "Cada violação anula cobertura de insurance. Cláusula padrão RAC."
    },
    {
      section: "6. Depósito Caução",
      clause: "Depósito caução de $[500-1,000] retido no cartão de crédito do locatário. Liberado em até 7 dias úteis após devolução sem danos. Depósito pode ser usado para: danos, combustível, limpeza excessiva, multas.",
      importance: "high",
      legalNote: "Pre-authorization, não charge. FL consumer protection: 7-day release obrigatório."
    },
    {
      section: "7. Combustível",
      clause: "Veículo entregue com tanque cheio. Locatário deve devolver com tanque cheio. Reabastecimento pela locadora: $[5.99]/galão + taxa de serviço $[25].",
      importance: "medium",
      legalNote: "Fuel surcharge deve ser clara para evitar disputes. RAV4 Hybrid: ~40 MPG."
    },
    {
      section: "8. Manutenção & Danos",
      clause: "Locatário reporta imediatamente: luzes de aviso, barulhos anormais, danos. Em caso de acidente: (a) chamar 911 se necessário; (b) fotografar; (c) trocar informações; (d) NÃO admitir culpa; (e) contatar locadora em 1 hora.",
      importance: "high",
      legalNote: "Protocolo de acidente protege insurance claim. FL Statute 316.062."
    },
    {
      section: "9. GPS/Telematics",
      clause: "Veículo equipado com GPS e telematics para: segurança, recuperação em caso de roubo, monitoramento de velocidade excessiva (>85 mph). Locatário consente com monitoramento durante período de aluguel.",
      importance: "high",
      legalNote: "FL permite GPS tracking com consent do motorista. FL Statute 934.425."
    },
    {
      section: "10. Multas & Infrações",
      clause: "Locatário é responsável por todas as multas, tolls, e infrações durante o período de aluguel. Taxa administrativa de $[35] por infração processada pela locadora. SunPass/toll: cobrado do cartão em file.",
      importance: "medium",
      legalNote: "FL tolls são agressivos. SunPass transponder incluso evita surcharges."
    },
    {
      section: "11. Resolução de Disputas",
      clause: "Disputas serão resolvidas por mediação no condado de Miami-Dade, FL. Se mediação falhar: arbitragem vinculante sob regras AAA. Cada parte arca com seus custos legais.",
      importance: "high",
      legalNote: "Arbitration clause reduz custo legal 80%. Alternativa: small claims court FL <$8K."
    },
  ];
}

export function generateGuardrails(): { id: number; name: string; trigger: string; action: string; evidence: string }[] {
  return [
    {
      id: 1,
      name: "Insurance Cost Cap",
      trigger: "Quotes > $400/mês total para 2 carros OU renewal > $500/mês/carro",
      action: "STOP: Não comprar carros. Buscar mais 3 brokers. Se todos > $500 → pivot para Turo com 1 carro + seguro pessoal.",
      evidence: "GMI/Mesa/Blake range: $300-500/mês para 2 economy SUVs. >$500 indica red flag no perfil."
    },
    {
      id: 2,
      name: "Utilization Floor",
      trigger: "Utilização < 70% por 21 dias consecutivos (após dia 14 de operação)",
      action: "REVIEW: Analisar pricing (muito alto?), marketing (insuficiente?), parcerias (não ativadas?). Se < 60% por 30 dias → reduzir para 1 carro, listar 1 no Turo.",
      evidence: "Rentscout benchmark: 70-85% util off-airport Miami. <70% = problema de distribuição ou pricing."
    },
    {
      id: 3,
      name: "Claims Circuit Breaker",
      trigger: "2+ claims em 90 dias OU 1 claim > $25K",
      action: "PAUSE luxury expansion. Review: driver screening rigoroso? Telematics ativo? Dashcam instalada? Implementar: speed alert 80mph, geofencing FL only, mandatory renter's insurance.",
      evidence: "2+ claims = insurance renewal spike 40-80%. Prevenção é 10x mais barato que remediation."
    },
    {
      id: 4,
      name: "Admin Performance Gate",
      trigger: "NPS < 4.5 OU response time > 30 min OU 2+ customer complaints/semana",
      action: "WARNING imediato. 14 dias para corrigir. Se não melhorar → substituir admin. Nunca escalar frota com admin underperforming.",
      evidence: "NPS <4.5 = death spiral em reviews. Google/Yelp reviews são permanentes e afetam booking 60%+."
    },
    {
      id: 5,
      name: "Cash Reserve Minimum",
      trigger: "Cash < 3 meses operating expenses OU reinvestimento > 80% sem reserva",
      action: "STOP expansão. Acumular cash reserve primeiro. Min: $15K com 2 carros, $50K com 10 carros, $150K com 50 carros.",
      evidence: "Hurricane season (Jun-Nov), recessão, ou claim grande pode zerar cash flow por 2-3 meses."
    }
  ];
}
