// Forensic Audit Engine — 10 Weighted Criteria, Honest Assessment
// Sources: FL DBPR 2026, Mordor Intelligence FL $7.2B, Natalya Zorina case,
// Tax Foundation FL 2026, GMI/Mesa Insurance 2026, Rentscout/GetHapn benchmarks

export interface CriterionScore {
  id: string;
  name: string;
  weight: number;
  scoreA: number;
  scoreB: number;
  maxScore: number;
  strengthA: string;
  strengthB: string;
  weaknessA: string;
  weaknessB: string;
  whereItDeceives: string;
  looksGoodButIsnt: string;
  lethalWeapon: string;
  trap: string;
  unknownUnknowns: [string, string];
  evidence: string;
  source: string;
}

export interface AuditResult {
  criteria: CriterionScore[];
  totalWeightedA: number;
  totalWeightedB: number;
  maxWeightedScore: number;
  verdict: string;
  contradictions: string[];
  analogies: string[];
  breakpoints: string[];
}

export const CRITERIA: CriterionScore[] = [
  {
    id: "net-profit-12m",
    name: "Lucro Líquido 12 Meses",
    weight: 3,
    scoreA: 2,
    scoreB: 8,
    maxScore: 10,
    strengthA: "Previsível, low variance. 2 carros × $65/dia × 85% util × 30 dias = $3,315/mês receita bruta. Custos ~$1,800. Lucro ~$1,500/mês = $18K/ano.",
    strengthB: "Reinvestimento composto. Se 50 carros mo 6 × $75 avg × 85% × 30 = $95,625/mês receita. Margem 28% = $26,775/mês. Acumulado 12mo projeção $150-320K líquido.",
    weaknessA: "Teto absoluto $36K/ano com 2 carros — insuficiente para cobrir custo de vida Miami.",
    weaknessB: "Assume scaling linear — na prática, cada carro adicional tem custo marginal crescente (admin, estacionamento, compliance). Break-even de cada carro ~45-60 dias, não instantâneo.",
    whereItDeceives: "Ambos ignoram cash flow timing. Insurance é pago upfront, receita vem com delay. Gap de 15-30 dias pode causar stress de caixa nos primeiros 3 meses.",
    looksGoodButIsnt: "B parece $500K/mês — impossível com 50 carros. Natalya com 100+ carros faz $250K/mês RECEITA (não lucro). Margem líquida real ~25-30% = $62-75K lucro/mês com 100 carros.",
    lethalWeapon: "B com 20+ carros e utilization >85% em mercado Miami off-airport é genuinamente lucrativo. $200K+ lucro anual realista com 30 carros.",
    trap: "Projetar lucro de 200 carros sem ter operado 10. A maioria dos operators stalla em 5-15 carros por falta de capital operacional e gestão.",
    unknownUnknowns: [
      "Mudança regulatória FL para rental companies off-airport (licensing surprise)",
      "Correção turismo Miami pós-2025 (furacão, recessão, visa changes)"
    ],
    evidence: "Mordor Intelligence FL rental market $7.2B 2026. Natalya Zorina public interviews: 100+ cars, $250K/mês gross. Rentscout benchmark: 70-85% util off-airport Miami.",
    source: "Mordor Intelligence 2026 Report; Natalya Zorina YouTube/Podcast; Rentscout.io; GetHapn.com benchmarks"
  },
  {
    id: "payback-period",
    name: "Payback do Investimento",
    weight: 3,
    scoreA: 3,
    scoreB: 7,
    maxScore: 10,
    strengthA: "RAV4 Hybrid $32K cash. Lucro $1,500/mês = payback 21 meses. Sem risco de financiamento.",
    strengthB: "Se util >80% e rate >$65, payback por carro = $32K / ($65×30×0.80 - $800 custos) = $32K / $760 = ~42 dias líquido. Composto com reinvestimento, payback total frota 2.5-4 meses.",
    weaknessA: "21 meses é lento demais. Custo de oportunidade vs S&P500 (~12% YoY) é negativo nos primeiros 18 meses.",
    weaknessB: "2.5 meses assume zero downtime, zero claims, zero delay de receita. Real: 4-6 meses com fricção operacional.",
    whereItDeceives: "Payback 'por carro' vs 'total investido' são métricas diferentes. Reinvestir lucro em novos carros reseta o payback clock.",
    looksGoodButIsnt: "Payback 2.5 meses claim do user é agressivo. Com custos reais (seguro $380+, manutenção $150, admin 20%, claims 4%), payback mínimo realista é 4-5 meses por carro.",
    lethalWeapon: "Cash purchase elimina juros. RAV4 Hybrid retém 65-70% valor em 3 anos (KBB 2026). Worst case: vende carro e recupera 65% do capital.",
    trap: "Confundir revenue com profit no cálculo de payback. Muitos operadores Turo/rental reportam gross, não net.",
    unknownUnknowns: [
      "Depreciação acelerada se modelo novo lança mid-cycle",
      "Insurance rate hike retroativo após primeiro claim significativo"
    ],
    evidence: "KBB 2026: RAV4 Hybrid resale 65-70% em 36 meses. GMI Insurance quotes FL 2026: $300-500/mês fleet commercial.",
    source: "KBB.com 2026; GMI Insurance FL quotes; NADA guides 2026"
  },
  {
    id: "claims-insurance-risk",
    name: "Risco Claims e Seguro",
    weight: 2,
    scoreA: 8,
    scoreB: 5,
    maxScore: 10,
    strengthA: "2 carros = exposição mínima. $760/mês seguro total. 1 claim/ano estatisticamente. Gerenciável.",
    strengthB: "Escala permite negociar fleet rates. 50+ carros = poder com broker. Telematics reduz claims 15-25% (Spireon/Bouncie data 2025).",
    weaknessA: "1 claim total loss em 2 carros = 50% da frota parada. Concentração de risco extrema.",
    weaknessB: "50 carros × 4% claims/mês = 2 claims/mês. Com deductible $1K = $2K/mês. Mas 1 serious claim ($50K+) pode consumir 3 meses de lucro.",
    whereItDeceives: "Insurance quotes online são para personal, não commercial fleet. Commercial rental: +40-80% sobre personal rates. Muitos operadores subestimam.",
    looksGoodButIsnt: "User assume $400/mês total 2 carros. Realidade FL 2026 commercial rental: $300-500 POR CARRO. Total 2 carros = $600-1,000/mês, não $400.",
    lethalWeapon: "Specialty brokers (GMI, Mesa, Blake) conseguem rates 20-35% abaixo market para fleets com telematics + driver screening 25+.",
    trap: "Seguro barato = coverage inadequada. $1M liability mínimo para rental. Muitos quotes baratos excluem uninsured motorist ou têm gaps.",
    unknownUnknowns: [
      "FL no-fault insurance reform 2026 pode mudar estrutura de custos drasticamente",
      "Autonomous vehicle liability shift pode afetar prêmios de frota em 2-3 anos"
    ],
    evidence: "GMI Insurance 2026: fleet commercial FL $300-500/carro/mês. Spireon telematics: -20% claims. FL no-fault state com $10K PIP obrigatório.",
    source: "GMI Insurance quotes 2026; FL Statute 324.021; Spireon fleet data; Insurance Information Institute"
  },
  {
    id: "scalability",
    name: "Escalabilidade 18 Meses",
    weight: 1,
    scoreA: 2,
    scoreB: 7,
    maxScore: 10,
    strengthA: "Operação simples, replicável. Cada carro é unit economics independente.",
    strengthB: "Natalya provou 1→100 em <24 meses. Mercado Miami suporta. Off-airport independents growing 8-12% YoY (ACRA 2025).",
    weaknessA: "2→4 carros em 18 meses não justifica o esforço operacional. Melhor investir em REITs.",
    weaknessB: "100+ carros requer: 3+ locais de staging, 5-10 funcionários, fleet management software, dealer license, compliance audit. Complexidade operacional exponencial.",
    whereItDeceives: "Scaling de 2→10 é fácil. De 10→50 é difícil. De 50→200 é uma empresa completa com HR, legal, contabilidade, etc.",
    looksGoodButIsnt: "200 carros em 18 meses = ~11 carros/mês de aquisição. Capital necessário: 11 × $32K = $352K/mês de investimento. Requer financing ou lucros extraordinários.",
    lethalWeapon: "Se cada carro gera $800-1,200 líquido/mês, 50 carros = $40-60K/mês reinvestível. Viável se execution impecável.",
    trap: "Growth at all costs. Natalya teve backing financeiro e experiência. Replicar sem capital reserve = risco de insolvência.",
    unknownUnknowns: [
      "Saturação do mercado off-airport Miami com novos entrantes copiando o modelo",
      "Supply chain disruption de veículos novos (tariffs, chip shortage 2.0)"
    ],
    evidence: "ACRA 2025: independents growing 8-12% YoY. Natalya Zorina: scaling timeline 18-24 months. Toyota RAV4 Hybrid wait times 2026: 2-6 weeks.",
    source: "ACRA Annual Report 2025; Natalya Zorina interviews; Toyota dealer allocations FL 2026"
  },
  {
    id: "equity-value",
    name: "Equity/Valor Patrimonial 18 Meses",
    weight: 1,
    scoreA: 3,
    scoreB: 7,
    maxScore: 10,
    strengthA: "2 RAV4 Hybrid × $32K × 65% resale = $41,600. Baixo mas garantido.",
    strengthB: "50 carros = $1.04M valor resale. 200 carros = $4.16M. Plus goodwill, contracts, customer base.",
    weaknessA: "$41K de equity não é patrimônio significativo.",
    weaknessB: "Resale assume mercado estável. Oversupply de hybrids pode deprimir valores 10-15%.",
    whereItDeceives: "Equity de frota é ilíquido. Vender 50 carros leva 2-4 meses. Não é cash equivalente.",
    looksGoodButIsnt: "$5M equity claim assume 200 carros com mix luxury. Realidade: depreciação + wear & tear rental = resale ~55-60%, não 65%.",
    lethalWeapon: "Hybrids retêm valor melhor que ICE. RAV4 Hybrid é #1 resale value SUV compacto (KBB 2026). Hedge natural contra depreciação.",
    trap: "Contar equity como riqueza líquida. É capital preso no negócio. Extrair requer venda parcial ou refinancing.",
    unknownUnknowns: [
      "Transição EV pode depreciar hybrids mais rápido que esperado pós-2027",
      "FL pode implementar annual vehicle inspection obrigatório para fleets"
    ],
    evidence: "KBB 2026: RAV4 Hybrid 36-month resale 65-70%. Rental fleet resale typically -5-10% vs private party.",
    source: "KBB.com 2026; NADA Used Car Guide; Manheim auction data"
  },
  {
    id: "tax-optimization",
    name: "Otimização Fiscal FL",
    weight: 1,
    scoreA: 6,
    scoreB: 9,
    maxScore: 10,
    strengthA: "FL 0% state income tax. Federal only. Section 179 deduction on vehicles. Simples e efetivo.",
    strengthB: "FL 0% income + rent tax repealed 2024. Section 179 + bonus depreciation. Property empire strategy adiciona tax shelter via real estate depreciation.",
    weaknessA: "2 carros = deductions limitadas. Federal bracket 22-24% ainda aplicável sobre lucro.",
    weaknessB: "Property empire requer capital significativo e expertise imobiliária separada do negócio core.",
    whereItDeceives: "FL 0% income tax = state only. Federal 21% corporate ou 10-37% individual ainda se aplica.",
    looksGoodButIsnt: "'Zero tax' narrative ignora: self-employment tax 15.3%, federal income tax, sales tax 6% on vehicle purchases FL, commercial property tax.",
    lethalWeapon: "Section 179: deduction up to $1.16M (2026) em veículos comerciais. 50 carros × $32K = $1.6M potencial deduction. Reduz federal drasticamente.",
    trap: "Section 179 recapture se veículo vendido antes de uso predominantemente comercial (>50%). IRS audita fleets.",
    unknownUnknowns: [
      "Reforma tributária federal 2027 pode eliminar ou reduzir Section 179",
      "FL pode introduzir surcharge para rental companies (como TX tentou)"
    ],
    evidence: "Tax Foundation 2026: FL #4 business tax climate. IRS Section 179 limit $1.16M (2026). FL rent tax repealed effective 2024.",
    source: "Tax Foundation State Business Tax Climate Index 2026; IRS Publication 946; FL DOR bulletins"
  },
  {
    id: "operational-complexity",
    name: "Complexidade Operacional",
    weight: 2,
    scoreA: 8,
    scoreB: 4,
    maxScore: 10,
    strengthA: "2 carros = 1 pessoa opera. Sem funcionários, sem staging, sem software enterprise. WhatsApp + planilha.",
    strengthB: "AI + telematics automatiza 70%+ das operações rotineiras. PriceLabs dynamic pricing. Spireon tracking. Zapier workflows.",
    weaknessA: "Operador é single point of failure. Doença, viagem = business para.",
    weaknessB: "50+ carros = fleet management software ($200-500/mês), 3+ funcionários, staging lot ($1,500+/mês), dealer license process (FL 30-60 dias).",
    whereItDeceives: "Automação reduz trabalho repetitivo mas não elimina problemas: carro quebrado, cliente difícil, claim dispute, maintenance emergencial.",
    looksGoodButIsnt: "'AI 70%' automatiza pricing e comunicação, não resolve logística física: car pickup, inspection, cleaning, parking, key management.",
    lethalWeapon: "Admin 20% commission com KPIs (>90% util, NPS >4.8) é modelo comprovado em property management. Funciona se admin é competente.",
    trap: "Depender 100% de 1 admin sem backup. Admin sai = operação colapsa. Necessário 2 admins a partir de 15 carros.",
    unknownUnknowns: [
      "Employee vs contractor classification dispute com admin (FL/IRS scrutiny)",
      "Key management security breach (carro roubado via key box hacking)"
    ],
    evidence: "PriceLabs: dynamic pricing +15-25% revenue. Spireon: fleet tracking $15-25/carro/mês. FL dealer license: DHSMV Form 86056.",
    source: "PriceLabs.co case studies; Spireon.com fleet data; FL DHSMV dealer licensing requirements"
  },
  {
    id: "market-competition",
    name: "Competição e Mercado",
    weight: 1,
    scoreA: 5,
    scoreB: 6,
    maxScore: 10,
    strengthA: "Nicho pequeno, abaixo do radar dos majors. 2 carros = zero ameaça competitiva.",
    strengthB: "Nicho PT (1M+ brasileiros/ano Miami), off-airport delivery, parcerias Airbnb = moats reais. Majors não servem bem esse segmento.",
    weaknessA: "Zero moat. Qualquer um pode fazer o mesmo. Sem diferenciação.",
    weaknessB: "5.000 parcerias é aspiracional. Realidade: converter 50-100 parceiros no primeiro ano já é excelente. Cada parceria requer relationship management.",
    whereItDeceives: "Market share 5% off-airport Miami = ~$36M revenue. Requer 500+ carros. Irrealista em 12 meses.",
    looksGoodButIsnt: "Off-airport parece menos competitivo, mas Turo + GetAround + 200+ independents já operam agressivamente. Não é oceano azul.",
    lethalWeapon: "Nicho PT é genuinamente underserved. WhatsApp em português + PIX + cultural affinity = conversion 2-3x maior que genérico.",
    trap: "Over-invest em nicho pequeno. 1M brasileiros/ano ÷ 365 ÷ share = talvez 5-10 clientes/dia. Não sustenta 200 carros sozinho.",
    unknownUnknowns: [
      "Turo/GetAround pode lançar 'pro host' program com pricing undercut",
      "Uber Rent ou similar pode entrar no off-airport rental market"
    ],
    evidence: "Visit Florida 2025: 28M visitors. Brazilian consulate Miami: ~1M+ Brazilian visitors/year. Turo: 150K+ hosts US-wide.",
    source: "Visit Florida Annual Report; Brazilian Consulate Miami; Turo press releases; ACRA market data"
  },
  {
    id: "regulatory-legal",
    name: "Regulatório e Legal",
    weight: 1,
    scoreA: 7,
    scoreB: 5,
    maxScore: 10,
    strengthA: "2 carros off-airport: LLC + local business tax receipt suficiente. Sem dealer license necessário abaixo de threshold.",
    strengthB: "50+ carros: dealer license obrigatório FL. Compliance com FL Statute 559 (rental companies). Surety bond $25K.",
    weaknessA: "Simplicidade legal mas zero proteção corporativa robusta. Precisa pelo menos umbrella policy.",
    weaknessB: "Dealer license FL: processo 30-60 dias, inspeção local, surety bond, fingerprinting. Compliance ongoing. Não é trivial.",
    whereItDeceives: "Off-airport não significa unregulated. FL Dept of Agriculture oversees rental companies. Annual reporting obrigatório.",
    looksGoodButIsnt: "LLC em 1 dia via Sunbiz é real ($125). Mas EIN + insurance + compliance + local permits = 7-14 dias realista, não 'Dia 1 tudo pronto'.",
    lethalWeapon: "FL é business-friendly. LLC formation $125 online. No state income tax. Regulatory burden menor que CA ou NY.",
    trap: "Operar sem proper licensing = multas $500-$10K + shutdown. FL DBPR enforcement ativo em Miami-Dade.",
    unknownUnknowns: [
      "Miami-Dade pode implementar ride-share/rental zoning restrictions",
      "Federal DOT pode exigir compliance adicional para fleets >25 veículos"
    ],
    evidence: "FL Statute 559.904: rental company definition. Sunbiz LLC filing: $125 online. FL DBPR: rental company licensing.",
    source: "FL Statutes Chapter 559; FL Division of Corporations (Sunbiz); FL DBPR licensing portal"
  },
  {
    id: "speed-to-revenue",
    name: "Velocidade para Primeira Receita",
    weight: 1,
    scoreA: 5,
    scoreB: 7,
    maxScore: 10,
    strengthA: "LLC + carro + seguro = 7-14 dias realista. Primeira receita dia 10-14.",
    strengthB: "Delivery model + off-airport = pode operar dia 1 após seguro ativo. WhatsApp + Instagram = bookings sem website.",
    weaknessA: "14 dias para $65/dia = $1K primeira quinzena. Lento.",
    weaknessB: "Dia 7 receita é possível mas assume: LLC aprovada, seguro ativo, carro comprado, inspecionado, listed. Timeline real: 10-14 dias.",
    whereItDeceives: "'Receita dia 7' ignora que primeiro booking pode levar 3-7 dias adicionais de marketing/outreach. Dia 14-21 mais realista para primeiro rental.",
    looksGoodButIsnt: "7 dias claim assume zero friction. Realidade: insurance underwriting 3-5 business days, car registration 1-3 days, LLC 1-2 days online.",
    lethalWeapon: "Off-airport + delivery = zero overhead location. Instagram DM + WhatsApp = zero platform fees. Margem máxima desde dia 1.",
    trap: "Pressa para receita = corners cortados. Seguro inadequado, contrato fraco, sem screening = primeiro claim destrói o negócio.",
    unknownUnknowns: [
      "Insurance binding delay durante peak season pode atrasar 2 semanas",
      "Toyota allocation shortage pode atrasar compra do carro 4-6 semanas"
    ],
    evidence: "Sunbiz LLC: 1-2 business days online. FL HSMV registration: same day with title. GMI Insurance: binding 3-5 business days.",
    source: "FL Division of Corporations; FL HSMV; GMI Insurance process timeline"
  },
];

export function runAudit(): AuditResult {
  const totalWeightedA = CRITERIA.reduce((sum, c) => sum + c.scoreA * c.weight, 0);
  const totalWeightedB = CRITERIA.reduce((sum, c) => sum + c.scoreB * c.weight, 0);
  const maxWeightedScore = CRITERIA.reduce((sum, c) => sum + c.maxScore * c.weight, 0);

  const contradictions = [
    "Claim '$500K/mês lucro mo 6' contradiz dados Natalya: 100 carros = $250K/mês RECEITA BRUTA, não lucro. Com 50 carros, lucro líquido realista: $30-50K/mês.",
    "Payback 2.5 meses assume zero custos de rampa. Custos reais meses 1-3: insurance upfront, marketing ramp, util <70%. Payback realista: 5-7 meses.",
    "'5.000 parcerias' em 7 dias é fisicamente impossível. 50-100 parcerias no primeiro trimestre é excelente. 500 em 12 meses é agressivo mas viável.",
    "'Insurance $400/mês total 2 carros' contradiz market quotes FL 2026: $300-500 POR CARRO commercial rental. Total mínimo realista: $600-1,000.",
    "'200 carros 18 meses' requer $6.4M capital. Com reinvestimento puro de lucros (~$30-50K/mês após estabilização), timeline real: 36-48 meses sem financing externo.",
    "'Zero dependência plataforma' mas 5.000 parcerias Airbnb = dependência de hosts de terceiros. Hosts podem trocar de fornecedor a qualquer momento.",
    "'Margem 25-35%' é realista para operação madura. Meses 1-6: margem pode ser 10-18% com custos de rampa.",
    "'Exit IPO 24 meses' — nenhuma locadora independente fez IPO em décadas. Aquisição possível apenas com 500+ carros e $5M+ revenue anual.",
    "'Tax FL 0%' omite federal tax 21% (corp) ou 10-37% (individual) + 15.3% self-employment. Tax efetivo real: 25-40%.",
    "Caso Natalya é outlier survivor bias. Para cada Natalya, dezenas de operadores falharam nos primeiros 12 meses."
  ];

  const analogies = [
    "Escalar de 2→200 carros é como escalar de 1 imóvel alugado para 200: cada 10x de escala muda completamente o tipo de negócio, as competências necessárias, e o perfil de risco.",
    "Insurance em fleet rental é como o goalkeeper no futebol: invisível quando funciona, mas 1 falha catastrófica pode custar a temporada inteira.",
    "Nicho brasileiro em Miami é como restaurante de sushi em bairro japonês: vantagem cultural real, mas mercado total limitado. Precisa expandir além do nicho para escalar.",
    "Reinvestir 100% dos lucros é como all-in no poker: maximiza upside se as cartas vêm, mas zero margem de segurança se não vêm."
  ];

  const breakpoints = [
    "BREAK POINT 1: Insurance >$500/carro/mês → margem cai para <15% → B não viável sem renegociação",
    "BREAK POINT 2: Utilization <65% por 30 dias → cash flow negativo → pivot para Turo imediato",
    "BREAK POINT 3: Claim >$20K nos primeiros 90 dias → insurance repricing → pode inviabilizar escala",
    "BREAK POINT 4: Admin quit nos primeiros 60 dias → operação para → Gabriel assume 100% (plano A forçado)",
    "BREAK POINT 5: RAV4 Hybrid unavailable (allocation) → delay 4-6 semanas → first revenue pushed to day 45+"
  ];

  const verdict = totalWeightedB > totalWeightedA
    ? `OPÇÃO B (Agressivo) vence com score ${totalWeightedB}/${maxWeightedScore} vs A ${totalWeightedA}/${maxWeightedScore}. MAS com ajustes críticos: (1) Orçamento insurance $500-600/carro, não $200; (2) Timeline 50 carros em 12-18 meses, não 6; (3) Payback realista 5-7 meses, não 2.5; (4) Lucro mês 6 com 10-15 carros: $8-15K/mês, não $500K; (5) Reserve cash 3 meses de operating costs antes de escalar.`
    : `OPÇÃO A vence — indicando que B tem riscos excessivos não mitigados.`;

  return {
    criteria: CRITERIA,
    totalWeightedA,
    totalWeightedB,
    maxWeightedScore,
    verdict,
    contradictions,
    analogies,
    breakpoints,
  };
}
