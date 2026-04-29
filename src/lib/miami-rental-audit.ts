export type SourceKind = "Oficial" | "SEC" | "Benchmark";

export type Source = {
  label: string;
  kind: SourceKind;
  url: string;
  note: string;
};

export type ClaimStatus = "Suportado" | "Parcial" | "Fraco" | "Contradito";

export type ClaimAudit = {
  claim: string;
  status: ClaimStatus;
  verdict: string;
  whyItMatters: string;
  sources: string[];
};

export type Criterion = {
  id: string;
  name: string;
  weight: number;
  why: string;
};

export type Scenario = {
  id: string;
  name: string;
  strapline: string;
  thesis: string;
  scores: Record<string, number>;
  force: string;
  weakness: string;
  whereItMisleads: string;
  looksGoodFor: string;
  lethalWhen: string;
  trapWhen: string;
  unknownUnknowns: [string, string];
  action: string;
};

export type PaybackInputs = {
  capitalAtRisk: number;
  dailyRate: number;
  occupancy: number;
  commissionPct: number;
  taxLeakPct: number;
  insurancePerMonth: number;
  depreciationPerMonth: number;
  maintenanceReserve: number;
  cleaningAndDelivery: number;
  miscFixed: number;
};

export const sources: Source[] = [
  {
    label: "GMCVB — turismo recorde em 2024",
    kind: "Oficial",
    url: "https://www.miamiandbeaches.com/press-and-media/miami-press-releases/gmcvb-reports-record-tourism-numbers",
    note: "Aponta 28,2 milhões de visitantes em 2024 e US$ 22 bilhões em gastos.",
  },
  {
    label: "Florida Department of Revenue — Rental Car Surcharge",
    kind: "Oficial",
    url: "https://floridarevenue.com/taxes/taxesfees/Pages/solid_waste.aspx",
    note: "Mostra que a rental car surcharge continua existindo e é declarada em DR-15SW.",
  },
  {
    label: "Florida Statutes 212.0606 — Rental car surcharge",
    kind: "Oficial",
    url: "https://www.flhouse.gov/Statutes/2025/0212.0606/",
    note: "Mantém sobretaxa de US$ 2/dia nos primeiros 30 dias para locação qualificada.",
  },
  {
    label: "Florida DOR — Discretionary sales surtax",
    kind: "Oficial",
    url: "https://www.floridarevenue.com/taxes/taxesfees/Pages/discretionary.aspx",
    note: "Base para a leitura de 6% estadual mais surtax local aplicável em Miami-Dade.",
  },
  {
    label: "Miami-Dade Tax Collector — Local Business Tax Receipt",
    kind: "Oficial",
    url: "https://www.mdctaxcollector.gov/public/services/local-business-tax-receipt",
    note: "Confirma exigência de Local Business Tax Receipt no condado e, em muitos casos, também municipal.",
  },
  {
    label: "MIA — Permit Agreement Procedures",
    kind: "Oficial",
    url: "https://www.miami-airport.com/business_permits.asp",
    note: "Permissão aeroportuária pode exigir US$ 1.000 de taxa, US$ 1.000 de depósito e 7% da receita associada ao aeroporto.",
  },
  {
    label: "MIA — Rates, Fees and Charges FY 2025-2026",
    kind: "Oficial",
    url: "https://documents.miamidade.gov/ao-io/IO/IO-04-125.pdf",
    note: "Tabela oficial com taxas de transporte terrestre, inclusive classes para off-airport car rental.",
  },
  {
    label: "PortMiami — Car Rental Non-Concessionaire",
    kind: "Oficial",
    url: "https://www.miamidade.gov/portmiami/car-rental-permits.page",
    note: "Permissão inicial de US$ 700 e participação anual de 8% sobre receitas ligadas ao porto.",
  },
  {
    label: "Avis Budget Group — resultados FY2025",
    kind: "SEC",
    url: "https://www.sec.gov/Archives/edgar/data/723612/000072361226000010/car-20260218.htm",
    note: "Receita FY2025 de US$ 11,7 bi e EBITDA ajustado de US$ 748 mi, cerca de 6,4% de margem.",
  },
  {
    label: "Hertz — resultados 2025",
    kind: "SEC",
    url: "https://www.sec.gov/Archives/edgar/data/47129/000165785325000095/q22025earningsrelease.htm",
    note: "Mostra utilização de 83%-84%, RPU perto de US$ 1.334 e DPU entre US$ 251 e US$ 330/mês.",
  },
  {
    label: "Toyota — 2026 RAV4 Hybrid",
    kind: "Oficial",
    url: "https://www.toyota.com/rav4hybrid/",
    note: "Serve de âncora para MSRP inicial do ativo que o plano quer comprar à vista.",
  },
];

export const claimAudits: ClaimAudit[] = [
  {
    claim: "Miami tem demanda estrutural forte o bastante para sustentar uma locadora off-airport pequena.",
    status: "Suportado",
    verdict:
      "A demanda existe: o GMCVB reporta 28,2 milhões de visitantes em 2024 e gasto recorde no destino.",
    whyItMatters:
      "A tese de entrada faz sentido só porque existe tráfego real; demanda não é o gargalo principal, execução e unit economics são.",
    sources: ["GMCVB — turismo recorde em 2024"],
  },
  {
    claim: "A Florida repealed the rent tax, então a tese tem uma vantagem tributária nuclear.",
    status: "Contradito",
    verdict:
      "A sobretaxa de locação segue vigente. O estado mantém rental car surcharge e a carga tributária sobre a receita não desapareceu.",
    whyItMatters:
      "Essa premissa infla margem e distorce CAC líquido. Se o motor da tese depende de uma redução tributária inexistente, o modelo já nasce enviesado.",
    sources: [
      "Florida Department of Revenue — Rental Car Surcharge",
      "Florida Statutes 212.0606 — Rental car surcharge",
      "Florida DOR — Discretionary sales surtax",
    ],
  },
  {
    claim: "Florida é 0% income tax, logo o negócio quase não sofre imposto sobre lucro.",
    status: "Parcial",
    verdict:
      "Florida não cobra imposto estadual sobre renda pessoal, mas isso não elimina sales tax, surtax local, surcharge nem corporate income tax para C-corp.",
    whyItMatters:
      "Confundir ausência de IRPF com ausência de carga total leva a margens líquidas fantasiosas.",
    sources: [
      "Florida DOR — Discretionary sales surtax",
      "Florida Department of Revenue — Rental Car Surcharge",
    ],
  },
  {
    claim: "Off-airport significa quase zero atrito regulatório nos hubs.",
    status: "Contradito",
    verdict:
      "Se a aquisição depender de aeroporto ou porto, há regimes próprios: MIA cobra permissão e participação sobre receita; PortMiami cobra permissão inicial e 8% anual sobre receita associada ao porto.",
    whyItMatters:
      "A tese vende 'fora do aeroporto' como se fosse imune ao aeroporto. Não é. Se o cliente entra pelo hub, o hub tende a querer sua parte.",
    sources: [
      "MIA — Permit Agreement Procedures",
      "MIA — Rates, Fees and Charges FY 2025-2026",
      "PortMiami — Car Rental Non-Concessionaire",
    ],
  },
  {
    claim: "Seguro total de 2 carros abaixo de US$ 400/mês é um guardrail sólido para executar B.",
    status: "Fraco",
    verdict:
      "É uma meta possível em casos muito favoráveis, mas não há base pública robusta para tratá-la como valor padrão de mercado para frota turística nova em Miami.",
    whyItMatters:
      "Seguro é um dos principais pontos de quebra. Tratar um quote otimista como baseline sabota a decisão.",
    sources: ["MIA — Permit Agreement Procedures"],
  },
  {
    claim: "50 carros em 6 meses a partir de 2 carros cash, sem dívida e sem plataforma, é plausível.",
    status: "Contradito",
    verdict:
      "A matemática do capital não fecha sem alavancagem, consignação, revenue-share, seller financing ou aporte externo. Dois SUVs pagos à vista não geram caixa orgânico suficiente para isso em seis meses.",
    whyItMatters:
      "Esse é o centro da tese B. Se o motor de escala é impossível, o restante vira teatro de PowerPoint.",
    sources: [
      "Hertz — resultados 2025",
      "Avis Budget Group — resultados FY2025",
      "Toyota — 2026 RAV4 Hybrid",
    ],
  },
  {
    claim: "Payback de 2,5 meses está ao alcance com 2 RAV4 Hybrid cash.",
    status: "Contradito",
    verdict:
      "Sobre o capital integral do ativo, não fecha. Só fica crível se 'payback' significar recuperar uma tranche menor de equity ou um down payment, não o carro pago à vista.",
    whyItMatters:
      "O rótulo 'payback' está sendo usado sem definir o numerador. Essa é a forma clássica de uma tese parecer brilhante enquanto esconde o risco.",
    sources: ["Toyota — 2026 RAV4 Hybrid", "Hertz — resultados 2025"],
  },
  {
    claim: "Margem líquida de 25%-35% é baseline para a operação.",
    status: "Fraco",
    verdict:
      "Pode ocorrer em nichos muito bem operados, sobretudo sem overhead corporativo e com entrega direta, mas não pode ser tratada como base segura para um rollout de 2 para 50 carros.",
    whyItMatters:
      "Margem em pequena escala depende de mix, sinistralidade, ociosidade, mão de obra escondida do dono e custo de aquisição real.",
    sources: ["Avis Budget Group — resultados FY2025", "Hertz — resultados 2025"],
  },
  {
    claim: "Dealer license é parte natural do plano.",
    status: "Fraco",
    verdict:
      "Não apareceu como requisito básico para locar veículos. Sem prova oficial, isso deve sair do plano base e entrar apenas se houver atividade paralela de compra e venda regulada.",
    whyItMatters:
      "Adicionar licença errada aumenta fricção sem melhorar a operação principal.",
    sources: ["Miami-Dade Tax Collector — Local Business Tax Receipt"],
  },
  {
    claim: "O maior risco do plano é só claims/insurance.",
    status: "Parcial",
    verdict:
      "Seguro é grande risco, mas não é o único dominante. Capital velocity, aquisição direta sem plataforma, e compliance em hubs são riscos igualmente letais.",
    whyItMatters:
      "Quando a tese escolhe só um inimigo, ela fica cega para os outros três que realmente matam a execução.",
    sources: [
      "MIA — Permit Agreement Procedures",
      "PortMiami — Car Rental Non-Concessionaire",
      "Avis Budget Group — resultados FY2025",
      "Hertz — resultados 2025",
    ],
  },
];

export const criteria: Criterion[] = [
  {
    id: "demand",
    name: "Qualidade de demanda",
    weight: 14,
    why: "Sem demanda estrutural, nada mais importa; com demanda estrutural, a batalha vira execução e preço.",
  },
  {
    id: "unit",
    name: "Unit economics na escala de 2 carros",
    weight: 16,
    why: "O modelo precisa sobreviver antes de escalar. O erro mais comum é projetar escala antes de provar contribuição por carro.",
  },
  {
    id: "insurance",
    name: "Risco de seguro e claims",
    weight: 14,
    why: "Miami combina turistas, tráfego intenso e litigiosidade; um mês ruim destrói meses de margem.",
  },
  {
    id: "reg",
    name: "Fricção regulatória e de hub",
    weight: 10,
    why: "A tese depende de aeroporto, porto, hotéis e Airbnbs. Onde há acesso privilegiado, há custo e regra.",
  },
  {
    id: "capital",
    name: "Velocidade de capital",
    weight: 14,
    why: "O plano só merece nota alta se a própria caixa conseguir financiar a próxima tranche sem fantasia.",
  },
  {
    id: "direct",
    name: "Aquisição direta sem plataforma",
    weight: 8,
    why: "Não depender de plataforma é bom; prescindir de canais de descoberta cedo demais é suicídio comercial.",
  },
  {
    id: "ops",
    name: "Controlabilidade operacional",
    weight: 6,
    why: "Entrega, lavagem, check-in, documentação e atendimento 24/7 viram gargalo rápido em frota pequena.",
  },
  {
    id: "equity",
    name: "Equity e residual da frota",
    weight: 8,
    why: "O ativo pode defender downside, mas só se o mix estiver certo e a rotação não destruir valor.",
  },
  {
    id: "survival",
    name: "Sobrevivência em cenário ruim",
    weight: 5,
    why: "Projetos agressivos morrem menos por falta de upside e mais por um trimestre ruim mal absorvido.",
  },
  {
    id: "optionality",
    name: "Opcionalidade estratégica",
    weight: 5,
    why: "A melhor tese preserva portas abertas para B2B, assinaturas, consignment e crédito depois de provar a base.",
  },
];

export const scenarios: Scenario[] = [
  {
    id: "a",
    name: "A — conservador steady",
    strapline: "Baixa velocidade, baixo estresse, upside amputado.",
    thesis:
      "Começar com 2 carros pagos à vista, crescer devagar, minimizar risco operacional e deixar a tese de escala para depois.",
    scores: {
      demand: 6,
      unit: 5,
      insurance: 7,
      reg: 7,
      capital: 3,
      direct: 4,
      ops: 8,
      equity: 5,
      survival: 8,
      optionality: 4,
    },
    force: "Evita quebrar cedo e reduz chance de um erro operacional virar desastre irreversível.",
    weakness: "Quase não cria vantagem competitiva; pode virar apenas autoemprego com ativos caros.",
    whereItMisleads: "Parece prudente, mas pode mascarar retorno medíocre e custo de oportunidade alto.",
    looksGoodFor:
      "Parece bom para quem teme risco, mas não é bom para quem realmente quer construir uma plataforma de frota em Miami.",
    lethalWhen:
      "Vira arma letal se o objetivo real for apenas validar canal, preço e perfil de cliente antes de usar capital maior.",
    trapWhen:
      "Vira armadilha quando o operador interpreta ausência de caos como prova de produto-market fit.",
    unknownUnknowns: [
      "Mudança abrupta de preços de seguro por ZIP code ou perfil de uso.",
      "Demanda aparentemente boa, mas concentrada em janelas de evento que não repetem no resto do ano.",
    ],
    action: "Serve como laboratório, não como máquina de escala.",
  },
  {
    id: "b",
    name: "B — agressivo nuclear",
    strapline: "Upside enorme no papel, gargalo mortal no capital real.",
    thesis:
      "Sair de 2 carros para 50 em 6 meses, cortar plataformas, dominar parcerias e depois anexar luxo/exótico e múltiplas bases.",
    scores: {
      demand: 8,
      unit: 4,
      insurance: 4,
      reg: 3,
      capital: 2,
      direct: 5,
      ops: 3,
      equity: 8,
      survival: 2,
      optionality: 9,
    },
    force: "Se a máquina de aquisição e o funding existirem, a opcionalidade explode.",
    weakness: "O plano mistura três negócios de uma vez: locadora, máquina de aquisição e estrutura de financiamento.",
    whereItMisleads: "Ele usa exemplos extremos de vencedores como se fossem baseline reproduzível.",
    looksGoodFor:
      "Parece bom para quem lê storytelling de escala, mas não é bom para quem ainda não provou CAC, sinistro e ADR no próprio canal.",
    lethalWhen:
      "Vira arma letal apenas quando há underwriting disciplinado, funding já mapeado e demanda direta comprovada por dados próprios.",
    trapWhen:
      "Vira armadilha quando a escala vem antes da prova e o negócio compra volume de problema em vez de volume de lucro.",
    unknownUnknowns: [
      "Mudança de política de hub ou permissão que encarece o canal mais lucrativo.",
      "Cluster de claims em turistas internacionais que trava caixa, seguro e reputação ao mesmo tempo.",
    ],
    action: "Como tese pura, está superalavancada em premissas frágeis.",
  },
  {
    id: "c",
    name: "C — blitz disciplinado",
    strapline: "Agressivo de verdade, mas só depois de gates mensuráveis.",
    thesis:
      "Entrar com 2 carros, operar direto e em nicho brasileiro, usar canais complementares apenas como hedge tático, e só escalar após bater gates duros de ocupação, ADR, contribuição e compliance.",
    scores: {
      demand: 8,
      unit: 7,
      insurance: 6,
      reg: 6,
      capital: 7,
      direct: 7,
      ops: 6,
      equity: 7,
      survival: 7,
      optionality: 8,
    },
    force: "Preserva upside sem exigir fé cega. Converte agressividade em sequência de checkpoints.",
    weakness: "É menos sexy do que o plano nuclear e exige disciplina para dizer não ao crescimento prematuro.",
    whereItMisleads: "Pode parecer tímido para quem só olha headline de escala, mas na prática acelera mais porque evita erros fatais.",
    looksGoodFor:
      "Parece bom para operador que quer velocidade com controle; não serve para quem quer narrativa épica antes de dados.",
    lethalWhen:
      "Vira arma letal quando o canal português, hotéis/Airbnbs e corporate local entregam recorrência sem comer toda a margem.",
    trapWhen:
      "Vira armadilha se os gates forem frouxos e o fundador chamar de 'disciplina' uma escala ainda emocional.",
    unknownUnknowns: [
      "Parceria grande concentrar demanda demais e depois renegociar comissão no pior momento.",
      "Falso positivo inicial vindo de eventos sazonais levar a uma leitura errada da demanda recorrente.",
    ],
    action: "É o melhor desenho para escalar sem mentir para si mesmo.",
  },
];

export function getWeightedScore(scenario: Scenario) {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const weighted = criteria.reduce((sum, criterion) => {
    const score = scenario.scores[criterion.id] ?? 0;
    return sum + score * criterion.weight;
  }, 0);

  return Number((weighted / totalWeight).toFixed(1));
}

export function getScenarioRanking() {
  return [...scenarios]
    .map((scenario) => ({
      ...scenario,
      weightedScore: getWeightedScore(scenario),
    }))
    .sort((left, right) => right.weightedScore - left.weightedScore);
}

export function getScoreLabel(score: number) {
  if (score >= 8) return "forte";
  if (score >= 6) return "aceitável";
  if (score >= 4) return "frágil";
  return "ruim";
}

export function getScoreColor(score: number) {
  if (score >= 8) return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
  if (score >= 6) return "bg-sky-500/15 text-sky-300 border border-sky-500/20";
  if (score >= 4) return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
  return "bg-rose-500/15 text-rose-300 border border-rose-500/20";
}

export const contradictions = [
  "A tese vende 0% tax como se fosse 0% carga relevante, mas locação ainda sofre sales tax, surtax e surcharge.",
  "A tese vende off-airport como se blindasse contra aeroporto e porto, mas o próprio go-to-market depende de hubs com taxa e permissão.",
  "A tese promete 50 carros em 6 meses sem dívida nem plataforma, mas a matemática do capital exige funding adicional ou estrutura asset-light.",
  "A tese trata 2,5 meses como payback do ativo, quando esse número só fica plausível se o numerador for uma tranche muito menor de equity.",
  "A tese elege claims como risco dominante, mas capital velocity e aquisição direta sem plataforma são tão letais quanto.",
];

export const recommendation = {
  verdict: "Não execute A nem B puros. Execute C.",
  why:
    "O lado certo da agressividade não é prometer escala impossível; é desenhar gates que liberam escala só quando o dado protege você.",
  gates: [
    "Quote vinculante de seguro e estrutura de cobertura antes de comprar o segundo lote.",
    "Ocupação real em 21 dias maior ou igual a 75% sem maquiar calendário com picos de evento.",
    "ADR líquido sustentado suficiente para contribuição por carro maior ou igual a US$ 1.500/mês.",
    "Nenhum canal isolado representando mais de 25% da demanda.",
    "Mapeamento formal de MIA e PortMiami antes de vender pickup em hub como motor de aquisição.",
  ],
  verdictOnPayback:
    "Payback de 2,5 meses no carro pago à vista é marketing, não underwriting. Se o objetivo for 2,5 meses, redefina o capital em risco: tranche de equity, não CAPEX integral.",
};

export const analogies = [
  "O plano B, do jeito que foi escrito, é tentar abrir um fundo de private equity com o caixa de uma padaria.",
  "Dizer que o modelo é off-airport e portanto livre de atrito regulatório é como montar um hotel 'fora da praia' contando com acesso exclusivo pela areia.",
  "Chamar 2,5 meses de payback sobre carro cash é trocar o velocímetro pelo conta-giros e jurar que o carro andou mais.",
];

export const defaultPaybackInputs: PaybackInputs = {
  capitalAtRisk: 34750,
  dailyRate: 92,
  occupancy: 0.82,
  commissionPct: 0.1,
  taxLeakPct: 0.03,
  insurancePerMonth: 325,
  depreciationPerMonth: 300,
  maintenanceReserve: 140,
  cleaningAndDelivery: 220,
  miscFixed: 120,
};

export function calculatePayback(inputs: PaybackInputs) {
  const monthlyRevenue = inputs.dailyRate * 30 * inputs.occupancy;
  const revenueBasedCosts = monthlyRevenue * (inputs.commissionPct + inputs.taxLeakPct);
  const fixedCosts =
    inputs.insurancePerMonth +
    inputs.depreciationPerMonth +
    inputs.maintenanceReserve +
    inputs.cleaningAndDelivery +
    inputs.miscFixed;
  const monthlyContribution = monthlyRevenue - revenueBasedCosts - fixedCosts;
  const paybackMonths =
    monthlyContribution > 0 ? inputs.capitalAtRisk / monthlyContribution : Number.POSITIVE_INFINITY;
  const requiredMonthlyContributionForTarget = inputs.capitalAtRisk / 2.5;
  const requiredDailyRateForTarget =
    ((requiredMonthlyContributionForTarget + fixedCosts) /
      (30 * Math.max(inputs.occupancy, 0.01) * (1 - inputs.commissionPct - inputs.taxLeakPct)));

  return {
    monthlyRevenue,
    revenueBasedCosts,
    fixedCosts,
    monthlyContribution,
    paybackMonths,
    requiredMonthlyContributionForTarget,
    requiredDailyRateForTarget,
  };
}
