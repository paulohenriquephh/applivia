// Forensic Audit Engine — 10 Criteria, Weighted Scoring, Contradictions, Unknown Unknowns

export interface CriterionScore {
  id: string;
  name: string;
  weight: number;
  scoreA: number;
  scoreB: number;
  maxScore: number;
  weightedA: number;
  weightedB: number;
  strength: string;
  weakness: string;
  deception: string;
  looksGoodButIsnt: string;
  lethalWeapon: string;
  trap: string;
  unknownUnknowns: [string, string];
  tradeoff: string;
  source: string;
}

export interface AuditResult {
  criteria: CriterionScore[];
  totalWeightedA: number;
  totalWeightedB: number;
  maxPossible: number;
  contradictions: string[];
  verdict: string;
  breakpoints: string[];
  riskMatrix: { risk: string; probability: string; impact: string; mitigation: string }[];
}

export function runForensicAudit(): AuditResult {
  const criteria: CriterionScore[] = [
    {
      id: "net-profit-12m",
      name: "Lucro Líquido 12 Meses",
      weight: 3,
      scoreA: 2,
      scoreB: 7,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "B gera volume pelo reinvestimento agressivo e mix luxury com rates $150-350/dia em peak season",
      weakness: "B assume utilização >80% sustentável — dados Rentscout mostram 70-85% para independentes, não 90%+. A $60-120K é realista mas medíocre",
      deception: "O número $500K/mês com 50 carros assume margem 30%+ consistente — insurance claims sozinhos podem cortar 10-15% da margem num mês ruim",
      looksGoodButIsnt: "B parece nuclear mas depende de 100% reinvestimento — zero distribuição por 18 meses. Gabriel vive de quê?",
      lethalWeapon: "B com execução perfeita: compounding exponencial de frota gera equity irreversível. Quem chega a 50 carros primeiro domina parcerias locais",
      trap: "Projeção linear de scaling ignora que cada 10 carros novos = nova camada de complexidade operacional, insurance renegociação, e parking logistics",
      unknownUnknowns: [
        "Mudança regulatória FL 2026-27: projetos de lei para taxar rental cars off-airport estão em discussão na câmara estadual",
        "Saturação de independentes off-airport Miami pós-Turo boom 2023-25 — quantos novos entrantes estão competindo pelos mesmos 28M turistas?"
      ],
      tradeoff: "B +5.000% lucro potencial vs +300% volatilidade. Cada carro adicionado aumenta exposure a claims proporcionalmente",
      source: "Mordor Intelligence FL Rental Market $7.2B 2026; Rentscout ROI Calculator; Natalya Zorina case study (não auditado independentemente)"
    },
    {
      id: "payback-months",
      name: "Payback em Meses",
      weight: 3,
      scoreA: 3,
      scoreB: 6,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "B com 2 RAV4 cash $64K: se util >80% e rate >$65/dia, payback teórico ~5-7 meses. Sem dívida = sem pressão de cash flow",
      weakness: "Payback 2.5 meses é FICÇÃO para 2 carros — $64K investidos / ($65 × 30 × 0.80 × 2 carros × 0.30 margem) = $936/mês lucro líquido = payback 68 meses. Com 50 carros sim, mas para CHEGAR a 50 precisa de 6-12 meses",
      deception: "Payback 2.5 meses confunde payback do INVESTIMENTO INICIAL com payback MARGINAL de cada carro adicional. São métricas completamente diferentes",
      looksGoodButIsnt: "Claims $0 deductible no primeiro semestre é provável? Não. Um acidente com RAV4 = $2-5K out of pocket mesmo com seguro",
      lethalWeapon: "Se Gabriel consegue 2 carros com 90%+ util nos primeiros 60 dias, prova de conceito validada e scaling fica exponencial",
      trap: "Calcular payback sem incluir tempo operacional de Gabriel (opportunity cost ~$4-6K/mês equivalente emprego) distorce a métrica real",
      unknownUnknowns: [
        "Depreciação acelerada do RAV4 Hybrid 2024-25 se Toyota lança redesign 2026 — resale value pode cair 15% overnight",
        "Tempo de processamento de claims com specialty insurers (GMI/Mesa) pode ser 60-90 dias — cash flow gap real"
      ],
      tradeoff: "B payback real estimado 8-14 meses considerando ramp-up, claims, e sazonalidade vs A 20-30 meses",
      source: "Cálculo próprio baseado em rates médios Miami off-airport 2025-26; Insurance industry claims processing benchmarks"
    },
    {
      id: "insurance-risk",
      name: "Risco de Seguro e Claims",
      weight: 2,
      scoreA: 7,
      scoreB: 4,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "A com 2 carros: exposure limitada, 1 claim por ano estatisticamente. B escala mas também diversifica risco",
      weakness: "B com 50+ carros FL tourists: claims frequency ~15-20% ao ano por veículo. 50 carros = 8-10 claims/ano, cada um $1-5K deductible",
      deception: "$300-400/mês por carro é quote de telefone — rate real após underwriting para RENTAL fleet com drivers diferentes pode ser $450-700/mês",
      looksGoodButIsnt: "Telematics reduz prêmio 10-15% mas NÃO elimina claims. Driver screening reduz mas turistas internacionais = high risk profile para seguradoras",
      lethalWeapon: "Portfolio approach: 50+ carros = melhor poder de negociação com brokers, potencial self-insurance parcial, e diversificação de risco",
      trap: "Specialty brokers (GMI/Mesa) são intermediários — a seguradora final pode cancelar policy mid-term se claims ratio exceder 60-70%",
      unknownUnknowns: [
        "Florida insurance market hardening 2025-26: múltiplas seguradoras saíram do mercado, prêmios subiram 20-40% YoY em algumas categorias",
        "Litigation climate FL: estado #1 em insurance fraud e lawsuits — um claim litigado pode custar $20-50K mesmo com razão"
      ],
      tradeoff: "A risco controlado mas sem escala. B risco proporcional à frota mas com ferramentas de mitigação disponíveis (telematics, screening, deductible management)",
      source: "Florida Office of Insurance Regulation 2025 Report; NAIC auto insurance data; III.org claims statistics"
    },
    {
      id: "scalability",
      name: "Escalabilidade 18 Meses",
      weight: 2,
      scoreA: 2,
      scoreB: 6,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "B modelo Natalya comprova que 1→100 é possível em Miami. Mercado $7.2B comporta múltiplos independentes grandes",
      weakness: "Natalya levou ~2 anos, não 6 meses. E tinha experiência prévia + network. Gabriel começa do zero com 0 reputação local",
      deception: "200 carros em 18 meses = adicionar ~11 carros/mês consistentemente. Isso requer $350K+/mês em capital de aquisição — de onde vem?",
      looksGoodButIsnt: "Reinvest 100% do lucro: com margem 25% sobre $200K rev = $50K lucro = 1.5 carros/mês. Para 11/mês precisa de financing externo que contradiz 'zero dívida'",
      lethalWeapon: "Se consegue financing criativo (lease-to-own, dealer financing, fleet programs), scaling real. Toyota Fleet Programs existem com taxas competitivas",
      trap: "Cada nível de escala (5, 15, 50, 100 carros) requer infraestrutura completamente diferente: parking, admins, sistemas, seguros. Não é linear",
      unknownUnknowns: [
        "Disponibilidade de veículos: RAV4 Hybrid tem backlog de 2-4 meses em alguns dealers. Fleet purchase pode ser mais difícil que parece",
        "Parking/storage em Miami: $200-500/mês por vaga em áreas úteis. 50 carros = $10-25K/mês só em estacionamento"
      ],
      tradeoff: "B 100x potencial vs complexidade operacional exponencial. Cada dobra de frota requer repensar toda a operação",
      source: "Natalya Zorina interviews (YouTube/podcasts); Toyota Fleet Programs 2026; Miami commercial real estate rates"
    },
    {
      id: "equity-value",
      name: "Valor Patrimonial (Equity) 18 Meses",
      weight: 1,
      scoreA: 3,
      scoreB: 7,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "Carros são ativos tangíveis com mercado secundário líquido. RAV4 Hybrid retém valor excepcionalmente bem (60-75% após 3 anos)",
      weakness: "Equity != liquidez. Vender 50 carros leva semanas/meses. E goodwill de negócio rental independente vale pouco em acquisition",
      deception: "Valuation 5-10x revenue para IPO/acquisition é fantasia para locadora independente. Hertz vale 0.3x revenue. Enterprise é privada",
      looksGoodButIsnt: "Exit via acquisition: grandes redes compram LOCAÇÕES e CONTRATOS, não frotas. Carros eles já têm. O valor real é a base de clientes e parcerias",
      lethalWeapon: "Property empire (comprar imóveis com cash flow da frota) = equity real com apreciação FL 5-8%/ano",
      trap: "Contar equity de frota como 'patrimônio' ignora depreciação acelerada de uso rental (muito mais que uso pessoal) e custo de oportunidade do capital",
      unknownUnknowns: [
        "EV transition: se incentivos federais mudam em 2027, híbridos podem depreciar mais rápido que esperado",
        "Flood/hurricane damage FL: um evento climático pode destruir valor de múltiplos veículos simultaneamente"
      ],
      tradeoff: "B $5M equity nominal, mas valor realizável provavelmente $2-3M. A $100K equity conservador mas muito mais líquido",
      source: "KBB.com RAV4 Hybrid residual values; Hertz/Enterprise valuation multiples; FL real estate appreciation data"
    },
    {
      id: "operational-complexity",
      name: "Complexidade Operacional",
      weight: 2,
      scoreA: 8,
      scoreB: 3,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "A é trivial: 2 carros, Gabriel faz tudo, admin básico. B com AI/telematics pode automatizar 60-70% de ops de alto volume",
      weakness: "B com 50+ carros: check-in/out, cleaning, maintenance scheduling, customer service, claims processing, partnerships management = full-time team necessária",
      deception: "AI pricing + telematics ≠ automação de operações. PriceLabs ajusta preço, mas quem limpa, entrega, inspeciona, lida com avaria? Humanos",
      looksGoodButIsnt: "Admin 20% com KPIs parece barato mas 20% de $200K = $40K/mês. E se util cai, admin cost vira % maior do revenue",
      lethalWeapon: "SOPs rigorosos + tech stack certo = operação escalável. Empresas como Kyte e Turo Host Programs provaram isso",
      trap: "3 locations em 6 meses = 3x complexity, 3x rent, 3x staff. Sem processos maduros na location 1, expandir é suicídio operacional",
      unknownUnknowns: [
        "Turnover de staff em Miami: mercado de trabalho tight, salários subindo 4-6%/ano. Encontrar admins confiáveis é o gargalo real",
        "Software stack maintenance: PriceLabs + Spireon + Zapier + CRM + contabilidade = 5+ sistemas para integrar e manter"
      ],
      tradeoff: "A simples mas não escala. B escala mas cada salto de complexidade requer investimento em processos antes de investimento em carros",
      source: "Kyte operations playbook; Turo Host Program guidelines; Miami labor market data BLS 2025"
    },
    {
      id: "market-competition",
      name: "Competição e Posicionamento",
      weight: 1,
      scoreA: 5,
      scoreB: 6,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "Nicho brasileiro é real: 1M+ brasileiros/ano em Miami, subatendidos em PT. Off-airport evita competição direta com Hertz/Enterprise",
      weakness: "Independentes off-airport já são centenas em Miami. Diferenciação só por idioma é frágil — qualquer um contrata falante de PT",
      deception: "5% market share Miami off-airport em 12 meses = ~$360M em revenue. Com 200 carros a $65/dia = $3.5M max. Inconsistência matemática brutal",
      looksGoodButIsnt: "Parcerias com 5.000 Airbnbs: hosts recebem dezenas de propostas similares. Comissão 8% é competitiva mas não diferenciadora",
      lethalWeapon: "Operação delivery-only elimina overhead de counter/office. Gabriel entrega na porta do hotel/Airbnb = experiência premium por custo baixo",
      trap: "Saturação de independentes pós-Turo significa guerra de preços em baixa temporada (jun-set). Margem pode ser 5-10% nesses 4 meses",
      unknownUnknowns: [
        "Entrada de players tech-first (como Kyte, Turo expansion) em Miami pode comprimir margens de todos os independentes",
        "Regulação municipal Miami-Dade sobre short-term vehicle rental pode mudar sem aviso — precedente com regulação Airbnb"
      ],
      tradeoff: "Nicho PT = vantagem temporária de 6-12 meses até copiam. Vantagem sustentável = operações superiores + parcerias exclusivas",
      source: "Visit Florida 2025 statistics; Miami-Dade tourism board; Airbnb host community forums"
    },
    {
      id: "tax-legal",
      name: "Estrutura Fiscal e Legal",
      weight: 1,
      scoreA: 7,
      scoreB: 8,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "FL 0% state income tax é real e permanente. LLC structure simples e eficiente. Depreciação Seção 179 permite deduzir 100% do custo do veículo no ano 1",
      weakness: "Federal income tax ainda existe: 10-37% dependendo do bracket. Self-employment tax 15.3%. 0% state ≠ 0% total tax",
      deception: "Property empire para tax optimization é complexo e caro para implementar. CPA + attorney + property management = $30-50K/ano em fees",
      looksGoodButIsnt: "Rent tax repealed ajuda mas não elimina property tax FL (um dos mais altos do país). Property empire come cash flow inicial",
      lethalWeapon: "Seção 179 + Bonus Depreciation 2026: deduzir 100% do custo de cada veículo no ano 1 reduz tax burden federal dramaticamente",
      trap: "IRS audit risk: rental car business com 100% reinvest e 0 distribuição = perfil que atrai atenção do IRS. Documentação impecável obrigatória",
      unknownUnknowns: [
        "Bonus Depreciation phase-out: reduzindo 20% por ano desde 2023. Em 2027 será apenas 40%. Janela fechando",
        "SALT cap mudanças possíveis com novo congresso — pode afetar planejamento fiscal FL advantage"
      ],
      tradeoff: "Tax optimization é vantagem real mas requer investimento em compliance proporcional. Economia de 5-15% vs custo de 2-5% em profissionais",
      source: "IRS.gov Section 179; Tax Foundation FL state tax profile 2026; FL Dept of Revenue rent tax repeal 2024"
    },
    {
      id: "execution-speed",
      name: "Velocidade de Execução",
      weight: 1,
      scoreA: 5,
      scoreB: 5,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "LLC Sunbiz = 24-48h online. EIN = imediato. Comprar carro cash = mesma semana. Seguro = 1-3 dias após quotes",
      weakness: "7 dias para primeira receita é otimista mas possível com delivery model. 500 parcerias Airbnb em 1 dia é fisicamente impossível — 50 talvez",
      deception: "Cronograma hora-a-hora ignora burocracia real: title transfer 5-10 dias, commercial insurance underwriting 3-7 dias, dealer inspection scheduling",
      looksGoodButIsnt: "Soft launch 20 bookings em 48h com 0 reviews, 0 reputação, 0 presença online. Mesmo com ads, conversão leva semanas para estabelecer",
      lethalWeapon: "Gabriel on-site 24/7 elimina lag de comunicação e decisão. Execução paralela (LLC + compra + insurance simultâneos) é viável",
      trap: "Pressa gera erros: seguro errado, contrato admin sem escape clause, carro com problema mecânico oculto. Due diligence mínima obrigatória",
      unknownUnknowns: [
        "DMV/DHSMV Florida processing delays: picos sazonais podem atrasar registration 2-3 semanas",
        "Dealer willingness to sell at fleet price para buyer individual sem histórico: pode rejeitar ou adicionar markup"
      ],
      tradeoff: "Velocidade de setup similar para A e B (2 carros iniciais idênticos). Diferença aparece no mês 2+ quando B precisa escalar agressivamente",
      source: "Florida DHSMV processing times; Sunbiz.org LLC formation data; dealer fleet pricing programs"
    },
    {
      id: "dependency-resilience",
      name: "Dependência e Resiliência",
      weight: 1,
      scoreA: 6,
      scoreB: 4,
      maxScore: 10,
      weightedA: 0,
      weightedB: 0,
      strength: "A independente de tudo exceto seguradora e admin. B com AI/parcerias distribui dependência — se Airbnb muda regras, tem 4.999 outros canais",
      weakness: "B depende de: 1 admin confiável, seguradora que não cancela, PriceLabs uptime, Spireon funcionando, parcerias mantidas. Cada uma é single point of failure",
      deception: "AI 70% automação é marketing — na prática é pricing automático + templates de mensagem. Operações reais continuam manuais",
      looksGoodButIsnt: "Zero dependência de plataforma? Website próprio = 0 tráfego orgânico. Sem Turo/Getaround/Google = depende 100% de ads e parcerias outbound",
      lethalWeapon: "Multi-channel distribution real: website + Google Ads + parcerias + referrals + repeat customers = nenhum canal é mais que 30% do revenue",
      trap: "Admin 20% com 21-day trigger: demitir admin no dia 21 e fazer tudo sozinho? Gabriel não escala sozinho além de 5 carros",
      unknownUnknowns: [
        "Dependência de um único mercado geográfico: Miami recessão turística (improvável mas possível) = 0 plano B",
        "Key person risk: Gabriel é a operação inteira. Doença, burnout, visto = operação para"
      ],
      tradeoff: "A resiliente mas estagnado. B frágil individualmente mas anti-frágil no agregado se diversificação é real (não apenas planejada)",
      source: "Nassim Taleb anti-fragility framework; business continuity planning best practices"
    },
  ];

  criteria.forEach(c => {
    c.weightedA = c.scoreA * c.weight;
    c.weightedB = c.scoreB * c.weight;
  });

  const totalWeightedA = criteria.reduce((sum, c) => sum + c.weightedA, 0);
  const totalWeightedB = criteria.reduce((sum, c) => sum + c.weightedB, 0);
  const maxPossible = criteria.reduce((sum, c) => sum + c.maxScore * c.weight, 0);

  const contradictions = [
    "CONTRADIÇÃO #1: Payback 2.5 meses é matematicamente impossível com 2 carros. $64K investidos ÷ ~$936/mês lucro líquido (2 carros × $65/dia × 30 dias × 80% util × 30% margem) = 68 meses. Mesmo no cenário mais otimista (95% util, $85/dia, 40% margem) = 19 meses. O número 2.5 meses só funciona se o denominador for 50+ carros operando simultaneamente.",
    "CONTRADIÇÃO #2: Zero dívida + 200 carros em 18 meses + 100% reinvestimento. Para 200 × $32K = $6.4M em carros, o lucro acumulado precisa ser $6.4M em 18 meses. Isso requer receita de ~$21M com margem 30%. Com rate médio $75/dia × 200 carros × 85% util × 30 dias = $382K/mês. Mas os 200 carros não existem desde o mês 1 — é circular.",
    "CONTRADIÇÃO #3: Admin 20% é barato vs Admin 30% é caro. Na verdade, em B com volume, 20% de receita alta = $40K+/mês. Isso compra 2-3 funcionários full-time, não 1 admin. A estrutura de custo precisa refletir headcount real, não % arbitrária.",
    "CONTRADIÇÃO #4: Tax FL 0% income apresentado como se fosse 0% total. Federal tax (10-37%) + self-employment tax (15.3%) + property tax FL (um dos mais altos do país) = effective rate 25-40% para renda > $100K/ano. A vantagem FL é real mas muito menor que apresentada.",
    "CONTRADIÇÃO #5: 5.000 parcerias em 7 dias. Isso requer contactar 714 parceiros/dia, ou 89/hora num turno de 8h. Cada cold outreach + negociação + contrato leva mínimo 15-30 minutos. Realista: 50-100 contatos dia 1, 500 em 30 dias, 5.000 em 6-12 meses.",
    "CONTRADIÇÃO #6: Exit via IPO em 24 meses. Locadoras com revenue <$50M não fazem IPO. Hertz fez IPO com $9B em revenue. Acquisition por grandes redes: possível mas por valor de operações/contratos, não frota. Valuation realista: 1-2x earnings, não 5-10x revenue.",
    "CONTRADIÇÃO #7: AI automação 70% das operações. PriceLabs + chatbot automatizam pricing e respostas iniciais. Mas: check-in físico, limpeza, manutenção, delivery, inspeção, claims, banco, contabilidade, renovação seguro = manual. Automação realista: 25-35% das tarefas.",
  ];

  const breakpoints = [
    "PONTO DE QUEBRA #1: Insurance quote > $500/mês por carro → margem cai de 30% para 18%. Acima de $600 → inviável escalar B. Ação: pivotar para A ou Turo.",
    "PONTO DE QUEBRA #2: Utilização < 65% nos primeiros 60 dias → payback se estende para 24+ meses. Ação: reavaliar pricing, canais, e posicionamento.",
    "PONTO DE QUEBRA #3: Mais de 2 claims nos primeiros 90 dias → seguradora pode cancelar ou repricing +50%. Ação: endurecer screening, aumentar deductible.",
    "PONTO DE QUEBRA #4: Gabriel incapacitado por qualquer razão > 7 dias → operação para sem backup. Ação: ter plano B com admin desde dia 1.",
    "PONTO DE QUEBRA #5: RAV4 Hybrid indisponível nos dealers Miami → delay de 30-60 dias. Ação: alternativas pré-aprovadas (Corolla Cross, CR-V, Tucson).",
  ];

  const riskMatrix = [
    { risk: "Insurance cancelation mid-term", probability: "Média (15-25%)", impact: "Crítico — operação para", mitigation: "2 seguradoras ativas, policy overlap, specialty broker dedicado" },
    { risk: "Claim litigado ($20K+)", probability: "Média (10-20%/ano com turistas)", impact: "Alto — cash flow impact 1-2 meses", mitigation: "$1M+ umbrella policy, dash cams, contracts bullet-proof" },
    { risk: "Sazonalidade severe (jun-set)", probability: "Alta (80%+)", impact: "Médio — margem cai 50-60%", mitigation: "Reserva 3 meses expenses, subscription pricing, locals targeting" },
    { risk: "Saturação off-airport independentes", probability: "Média-Alta (30-50% em 2 anos)", impact: "Médio — guerra de preços", mitigation: "Diferenciação serviço, loyalty program, parcerias exclusivas" },
    { risk: "Regulação municipal inesperada", probability: "Baixa (5-15%)", impact: "Alto — compliance costs + possível shut down", mitigation: "Monitoring legislativo, lawyer retainer, FL industry association membership" },
    { risk: "Key person risk (Gabriel)", probability: "Baixa-Média (10%)", impact: "Crítico — operação para completamente", mitigation: "SOPs documentados, admin backup treinado, insurance key-person" },
    { risk: "Hurricane/flood damage to fleet", probability: "Baixa (5-10%/ano FL)", impact: "Catastrófico — perda parcial/total frota", mitigation: "Comprehensive insurance, parking indoor, evacuation protocol" },
    { risk: "Tech stack failure (PriceLabs/CRM)", probability: "Baixa (5%)", impact: "Baixo — fallback manual 24-48h", mitigation: "Backup spreadsheet pricing, manual booking workflow documented" },
  ];

  const verdict = `VEREDITO FORENSE: Cenário B é superior ao A em potencial de lucro e escalabilidade, mas as projeções apresentadas contêm 7 contradições matemáticas graves e superestimam resultados em 3-5x. 

NÚMEROS CORRIGIDOS CENÁRIO B REALISTA:
• Payback real: 8-14 meses (não 2.5)
• Frota mês 18: 30-60 carros (não 200) com reinvestimento puro
• Lucro líquido mês 18: $30-80K/mês (não $500K)
• Equity realizável: $800K-1.5M (não $5M)
• Margem real: 18-28% (não 25-35%) após claims e sazonalidade

RECOMENDAÇÃO FORENSE: Execute B com expectativas REALISTAS. Os fundamentos são sólidos (FL tax, SUV hybrid demand, off-airport viability, nicho PT). Mas o cronograma é 2-3x mais longo e os números 3-5x menores que apresentados. Isso ainda é um negócio EXCELENTE — $50-80K/mês com 30 carros em 18 meses é top 1% de retorno para capital investido.

AÇÃO IMEDIATA VALIDADA:
1. Quotes de seguro HOJE — se < $450/mês por carro, prosseguir
2. 2 RAV4 Hybrid cash esta semana
3. Delivery-only model, 0 overhead fixo de office
4. Meta realista mês 1: 70% util, $55-65/dia rate, $800-1200 lucro líquido
5. Reinvestir 100% mas preparar 3 meses reserva antes de carro #3`;

  return {
    criteria,
    totalWeightedA,
    totalWeightedB,
    maxPossible,
    contradictions,
    verdict,
    breakpoints,
    riskMatrix,
  };
}
