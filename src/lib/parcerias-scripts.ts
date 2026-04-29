// Scripts de parcerias e marketing – Locadora Miami Nuclear 2026

export interface ScriptParceria {
  tipo: string;
  canal: string;
  assunto: string;
  corpo: string;
  followUp: string;
  kpiAlvo: string;
}

export const SCRIPTS_PARCERIAS: ScriptParceria[] = [
  {
    tipo: 'Airbnb Host (EN)',
    canal: 'Airbnb Messaging / WhatsApp',
    assunto: 'Partnership offer: Earn 8% commission referring your guests to our car rental',
    corpo: `Hi [Host Name],

I noticed your listing in [Brickell/Miami Beach/Wynwood] — beautiful place!

I run a boutique car rental service in Miami specializing in SUVs and hybrids. Many of your guests probably need a car during their stay.

Our offer:
✅ 8% commission for every completed rental you refer (avg $15-25/referral)
✅ We handle everything — delivery to your address, 24/7 support
✅ Your guests get a $10 discount on first rental
✅ Simple tracking link via WhatsApp or our portal

Zero work on your end. Just share the link.

Interested? Reply here or WhatsApp me: [NUMBER]

Best,
[Name] | [Company Name] | Miami Car Rental`,
    followUp: `Hi [Host], just following up on my message from [X days ago]. We already have [N] Airbnb hosts referring guests and earning passive income. Happy to answer any questions!`,
    kpiAlvo: 'Meta: 50 hosts ativos em 30 dias → +15% bookings',
  },
  {
    tipo: 'Hotel Concierge (EN)',
    canal: 'Email / Visita presencial',
    assunto: 'B2B Partnership: Car Rental Referral Program for [Hotel Name] Guests',
    corpo: `Dear [Concierge/Manager Name],

I'm reaching out from [Company Name], a boutique car rental service based in Miami specializing in premium SUVs and hybrids for hotel guests.

Partnership proposal:
• 8% commission per completed rental (avg $150-250/rental = $12-20/referral)
• We deliver cars directly to your hotel
• 24/7 support in English, Spanish, and Portuguese
• $20 discount for your guests
• Monthly payment via check or ACH

We currently serve guests at [list 2-3 hotels] and have 4.9/5.0 Google Rating.

Could we schedule a 15-minute call this week?

[Name] | [Phone] | [Email]`,
    followUp: `Following up on partnership — happy to provide our insurance certificate and FL dealer license for your records. Can we connect Thursday or Friday?`,
    kpiAlvo: 'Meta: 10 hotéis com contrato em 30 dias → +25% bookings',
  },
  {
    tipo: 'WhatsApp Grupos Brasileiros',
    canal: 'WhatsApp / Facebook Grupos PT',
    assunto: '🚗 Aluguel de carro em Miami – SEM surpresas, ATENDIMENTO em português!',
    corpo: `Olá pessoal! 🇧🇷

Sou o [Nome], tenho uma locadora aqui em Miami e ofereço atendimento 100% em português.

O que a gente tem:
✅ RAV4 Hybrid, Camry, SUVs – carros novos e bem cuidados
✅ Entrega no seu Airbnb, hotel ou aeroporto particular
✅ Sem taxa de aeroporto (economize $60-80/aluguel!)
✅ Sem papelada complicada – tudo explicado em português
✅ Aceita PIX (via cotação) e cartão internacional
✅ WhatsApp direto: [NÚMERO]

Para quem está planejando vir: me manda mensagem antes e garantimos o melhor preço da temporada! 

Grupo exclusivo Brasileiros em Miami: [link]`,
    followUp: `Oi [Nome], tudo bem? Vi que você perguntou sobre aluguel de carro. Posso te ajudar! Temos RAV4 disponível para as suas datas. Qual hotel/Airbnb você vai ficar?`,
    kpiAlvo: 'Meta: 200 membros no grupo → 20-30 bookings/mês nicho BR',
  },
  {
    tipo: 'Agência de Turismo BR',
    canal: 'Email B2B / LinkedIn',
    assunto: 'Parceria B2B: Locadora exclusiva para seus clientes em Miami',
    corpo: `Prezado(a) [Nome],

Represento a [Empresa], locadora premium em Miami com atendimento exclusivo em português.

Proposta para sua agência:
• Comissão de 10% sobre cada aluguel (repassamos em até 5 dias úteis)
• Tarifas especiais para grupos (5+ carros simultâneos: -15%)
• Relatório mensal de comissões
• Suporte em PT 24/7 para seus clientes
• Parceria formal com contrato e seguro documentado

Perfil dos nossos carros: SUVs família (RAV4, CR-V), sedans executivos, opcionais de luxo.

Posso agendar uma videochamada para esta semana?

[Nome] | [Cargo] | [WhatsApp] | [Email]`,
    followUp: `Olá [Nome], acompanhando nossa conversa. Temos disponibilidade esta semana para uma chamada rápida de 10 minutos. O que acha de [data/horário]?`,
    kpiAlvo: 'Meta: 5 agências parceiras → 15-25 bookings/mês agências',
  },
  {
    tipo: 'Cruise Lines / Portos',
    canal: 'Email / Visita PortMiami',
    assunto: 'Day-trip car rental for cruise passengers – partnership opportunity',
    corpo: `Dear [Port Agent/Excursions Manager],

We offer same-day car rentals for cruise passengers arriving at PortMiami who want to explore Miami independently.

Our value proposition:
• Cars delivered directly to port pickup zone
• 4-hour, 8-hour, and full-day rates
• No airport surcharges
• Instant booking via QR code
• English, Spanish, Portuguese support

We can provide 10-20 cars per cruise arrival on pre-booked basis.

Would you be open to a quick call or meeting at the port?

[Name] | [Company] | [Phone]`,
    followUp: `Following up — cruise season runs through April and we want to ensure we can accommodate your passengers. Can we connect this week?`,
    kpiAlvo: 'Meta: 2 contratos cruise lines → +30 bookings/semana pico temporada',
  },
];

export interface ChecklistOperacional {
  categoria: string;
  itens: { texto: string; prazo: string; prioridade: 'CRITICO' | 'ALTO' | 'MEDIO' }[];
}

export const CHECKLIST_7_DIAS: ChecklistOperacional[] = [
  {
    categoria: 'DIA 1 – LEGAL & ESTRUTURA',
    itens: [
      { texto: 'Abrir LLC na Sunbiz.org (online, $125)', prazo: '2h', prioridade: 'CRITICO' },
      { texto: 'Obter EIN no IRS.gov (instantâneo online)', prazo: '30min', prioridade: 'CRITICO' },
      { texto: 'Iniciar processo Dealer License MV-205 FHSMV (30-60 dias)', prazo: 'Dia 1', prioridade: 'CRITICO' },
      { texto: 'Abrir conta bancária business (Chase/Bank of America fleet)', prazo: 'Dia 1-2', prioridade: 'CRITICO' },
      { texto: 'Solicitar 3 quotes seguro: GMI + Mesa + Blake/Univista', prazo: 'Dia 1', prioridade: 'CRITICO' },
      { texto: 'BTR (Business Tax Receipt) Miami-Dade', prazo: 'Semana 1', prioridade: 'ALTO' },
    ],
  },
  {
    categoria: 'DIA 1-2 – FROTA',
    itens: [
      { texto: 'Comprar RAV4 Hybrid #1 (cash, certified pre-owned, <50K miles)', prazo: 'Dia 1-2', prioridade: 'CRITICO' },
      { texto: 'Comprar RAV4 Hybrid #2 ou Camry Hybrid (cash)', prazo: 'Dia 2-3', prioridade: 'CRITICO' },
      { texto: 'Inspeção mecânica independente ($100-150 por carro)', prazo: 'Na compra', prioridade: 'CRITICO' },
      { texto: 'Registro comercial FLHSMV + título em nome da LLC', prazo: 'Semana 1', prioridade: 'CRITICO' },
      { texto: 'Instalar telematics (Spireon NSpire ou Samsara GO)', prazo: 'Antes 1o aluguel', prioridade: 'ALTO' },
      { texto: 'Fotografar 360° cada carro (antes de qualquer aluguel)', prazo: 'Antes 1o aluguel', prioridade: 'ALTO' },
    ],
  },
  {
    categoria: 'DIA 2-3 – OPERACIONAL',
    itens: [
      { texto: 'Assinar contrato admin Gabriel (20% KPIs)', prazo: 'Dia 2', prioridade: 'CRITICO' },
      { texto: 'Setup sistema reservas: Rent Centric ou HQ Rental (free tier)', prazo: 'Dia 2', prioridade: 'ALTO' },
      { texto: 'Criar website (Squarespace ou Webflow, $20/mês)', prazo: 'Dia 3', prioridade: 'ALTO' },
      { texto: 'Google Business Profile + 10 fotos profissionais', prazo: 'Dia 3', prioridade: 'ALTO' },
      { texto: 'WhatsApp Business + número 786/305', prazo: 'Dia 1', prioridade: 'CRITICO' },
      { texto: 'Setup Zapier: reserva → WhatsApp notificação → planilha', prazo: 'Dia 3', prioridade: 'MEDIO' },
    ],
  },
  {
    categoria: 'DIA 3-5 – LANÇAMENTO',
    itens: [
      { texto: 'Listar carros no Turo (temporário até dealer license)', prazo: 'Dia 3', prioridade: 'ALTO' },
      { texto: 'Primeiras 20 mensagens para Airbnb hosts (script EN)', prazo: 'Dia 3-4', prioridade: 'ALTO' },
      { texto: 'Entrar em 10 grupos FB brasileiros Miami', prazo: 'Dia 3', prioridade: 'ALTO' },
      { texto: 'Visitar 5 hotéis presencialmente com kit parceria', prazo: 'Dia 4-5', prioridade: 'ALTO' },
      { texto: 'Google Ads $300 budget (keywords: car rental miami no airport)', prazo: 'Dia 4', prioridade: 'MEDIO' },
      { texto: 'Criar perfil Instagram + TikTok da locadora', prazo: 'Dia 4', prioridade: 'MEDIO' },
    ],
  },
  {
    categoria: 'DIA 5-7 – MÉTRICAS & PIVOT',
    itens: [
      { texto: 'Dashboard KPI diário: util, reservas, receita, NPS', prazo: 'Dia 5', prioridade: 'ALTO' },
      { texto: 'Analisar utilização dos 2 carros (trigger: <60% = pivot)', prazo: 'Dia 7', prioridade: 'CRITICO' },
      { texto: 'Coletar 5 primeiras reviews Google/Turo', prazo: 'Dia 7', prioridade: 'ALTO' },
      { texto: 'Quote luxo/exotic para mo 3 (Ferrari/Lamborghini dealer)', prazo: 'Dia 6', prioridade: 'MEDIO' },
      { texto: 'Revisar quotes seguro (comparar 3 offers)', prazo: 'Dia 5', prioridade: 'CRITICO' },
      { texto: 'Plano de aquisição próximos 3 carros (fontes: Manheim, CarMax fleet, Enterprise Sales)', prazo: 'Dia 7', prioridade: 'ALTO' },
    ],
  },
];
