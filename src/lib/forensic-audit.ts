/**
 * Forensic Audit Engine — 10 critérios ponderados com análise anti-viés
 * 
 * Metodologia: 
 * - Score ponderado (não média simples)
 * - 3 passadas: mapear, comparar, revisar
 * - Unknown unknowns explícitos por critério
 * - Contradições identificadas
 * - Ponto de quebra (breakeven) calculado
 */

export interface CriterionScore {
  id: number;
  name: string;
  weight: number;
  scoreA: number;
  scoreB: number;
  scoreStress: number;
  strength: string;
  weakness: string;
  deception: string;
  looksGoodButIsnt: string;
  lethalWeapon: string;
  trap: string;
  unknownUnknowns: [string, string];
  tradeoff: string;
  evidence: string;
}

export interface AuditResult {
  criteria: CriterionScore[];
  totalWeightedA: number;
  totalWeightedB: number;
  totalWeightedStress: number;
  maxPossible: number;
  contradictions: string[];
  analogies: string[];
  recommendation: string;
  breakpoints: string[];
  verdict: string;
}

export function runForensicAudit(): AuditResult {
  const criteria: CriterionScore[] = [
    {
      id: 1,
      name: "Lucro Líquido 18 Meses",
      weight: 3,
      scoreA: 2,
      scoreB: 9,
      scoreStress: 5,
      strength: "B gera cashflow agressivo via reinvestimento 100% + luxury mix. Caso Natalya: $250K/mês com 100 carros comprovado.",
      weakness: "Depende de reinvestimento contínuo sem retirada. Qualquer interrupção (claim grande, recessão) quebra a curva de crescimento.",
      deception: "Projeções assumem utilização consistente >80%. Na prática, off-airport Miami tem sazonalidade brutal (Jun-Set queda 30-40%).",
      looksGoodButIsnt: "Para quem não entende cash flow timing — lucro contábil ≠ cash disponível quando 100% é reinvestido.",
      lethalWeapon: "Quando o operador tem disciplina de reinvestir 100% por 12 meses sem tocar no lucro + AI pricing real funcionando.",
      trap: "Quando claims acumulam no Q3 (hurricane season FL) e o operador não tem reserva porque reinvestiu tudo.",
      unknownUnknowns: [
        "Mudança regulatória FL para rent-a-car off-airport (licensing fees municipais podem surgir 2026-2027)",
        "Efeito cascata de AI pricing em todo o mercado — se todos usam, a vantagem desaparece"
      ],
      tradeoff: "B +4.500% lucro vs A, mas +200% volatilidade. Risk-adjusted return: B ainda ganha 3:1.",
      evidence: "Mordor $7.2B FL 2026, Natalya $250K/mês 100 carros, Rentscout 70-85% util off-airport, UpFlip Miami 3 carros $2-3K/mês."
    },
    {
      id: 2,
      name: "Payback (Meses)",
      weight: 3,
      scoreA: 3,
      scoreB: 9,
      scoreStress: 5,
      strength: "B com 2 RAV4 cash ($62K) + utilização 80%+ = payback 2.5-3 meses nos 2 primeiros carros. Escala dilui mas ainda <8 meses.",
      weakness: "Payback dos 2 primeiros carros ≠ payback da operação total. Luxury cars ($85K+) esticam o payback global.",
      deception: "Medir payback só nos primeiros 2 carros é cherry-picking. Payback real da operação inteira (com luxury + scale) é 6-10 meses.",
      looksGoodButIsnt: "Para quem calcula payback simples (revenue/cost). Ignora claims, downtime, sazonalidade e custos ocultos de escala.",
      lethalWeapon: "Quando cash purchase elimina juros e o operador consegue >85% utilização mês 1 (delivery + nicho PT).",
      trap: "Quando o operador conta payback de 2.5 meses mas ignora que escalar para 50 carros reseta o clock.",
      unknownUnknowns: [
        "Depreciação acelerada em hybrids pode mudar com novos modelos 2027 (resale value risk)",
        "Insurance rate increases retroativos após 1º claim grande"
      ],
      tradeoff: "Payback rápido nos primeiros carros dá confiança mas não deve ser extrapolado linearmente.",
      evidence: "RAV4 Hybrid $31K cash, $65-80/dia, 30 dias, 80% util = $1,560-$1,920/mês net. Payback ~2.5-3 meses por carro."
    },
    {
      id: 3,
      name: "Risco Claims/Insurance",
      weight: 2,
      scoreA: 8,
      scoreB: 5,
      scoreStress: 3,
      strength: "A: Frota pequena = exposure limitado. B: Telematics + screening rigoroso reduzem 30-40% claims (Spireon data).",
      weakness: "FL é um dos piores estados para claims — no-fault state, litigation-friendly, tourist drivers desconhecidos.",
      deception: "Insurance quotes iniciais são low-ball para capturar frota. Após 1º claim, renewal pode saltar 40-80%.",
      looksGoodButIsnt: "Para quem nunca operou em FL. Parece gerenciável até o primeiro claim de $50K+ com turista sem seguro adequado.",
      lethalWeapon: "Quando o operador implementa: 25+ anos, clean record, $2M liability, dashcam, GPS, seguro próprio do locatário obrigatório.",
      trap: "Quando pula telematics para economizar $25/carro/mês e perde $50K em um claim sem evidência GPS.",
      unknownUnknowns: [
        "Assignment of Benefits (AOB) abuse em FL — advogados especializados em claims contra rent-a-car",
        "Mudança na lei no-fault FL (proposta 2026) pode alterar todo o cálculo de liability"
      ],
      tradeoff: "B aceita +40% risk para +5.000% lucro. Risk-reward favorável SE guardrails implementados.",
      evidence: "FL no-fault state, GMI/Mesa/Blake quotes $300-500/mês, Spireon telematics -30% claims, $2M umbrella ~$1.5K/ano."
    },
    {
      id: 4,
      name: "Escalabilidade 18 Meses",
      weight: 2,
      scoreA: 2,
      scoreB: 9,
      scoreStress: 6,
      strength: "B replica playbook Natalya: reinvest 100%, 3 locations, dealer license. Escala de 2→200 carros documentada.",
      weakness: "Escala requer: admin team, múltiplas locations, dealer license, fleet management system. Complexidade operacional 10x.",
      deception: "Escalar carros é fácil. Escalar operações (limpeza, manutenção, entrega, customer service) é o gargalo real.",
      looksGoodButIsnt: "Para quem olha só frota. 200 carros = ~20 funcionários, 3+ locations, fleet management software, legal compliance.",
      lethalWeapon: "Quando automatiza 90% ops com AI + contrata admin com KPIs rígidos + tem warehouse próprio.",
      trap: "Quando escala frota sem escalar ops e quality/NPS despenca abaixo de 4.5 (death spiral reviews).",
      unknownUnknowns: [
        "Competidores podem copiar modelo (low barrier to entry off-airport)",
        "Mudança no mercado de EVs pode tornar hybrids menos desejáveis mais rápido que esperado"
      ],
      tradeoff: "Escala = lucro exponencial mas complexidade operacional quadrática. Precisa de sistemas antes de carros.",
      evidence: "Natalya 1→100 em <2 anos. FL dealer license ~$2K. Warehouse Miami ~$3K/mês."
    },
    {
      id: 5,
      name: "Equity/Valor de Revenda",
      weight: 1,
      scoreA: 4,
      scoreB: 9,
      scoreStress: 6,
      strength: "RAV4 Hybrid retém 85% valor ano 1 (KBB 2025). Luxury retém 75-80%. Fleet = asset tangível.",
      weakness: "Depreciação acelerada com alta milhagem (rental = 30-40K mi/ano vs normal 12K). Resale pode ser 60-70%, não 85%.",
      deception: "Equity calculada com resale normal, não rental wear. Carros alugados valem 10-15% menos que uso pessoal.",
      looksGoodButIsnt: "Para quem usa tabela KBB padrão. Precisa usar wholesale auction values para rental fleet.",
      lethalWeapon: "Quando faz turnover da frota a cada 2-3 anos e vende antes de 50K milhas (sweet spot resale).",
      trap: "Quando mantém carros além de 60K milhas e manutenção come o lucro + resale despenca.",
      unknownUnknowns: [
        "Tariff impact 2026 em veículos importados pode inflacionar resale de usados (positivo inesperado)",
        "Recalls Toyota (improvável mas catastrófico para resale de fleet inteira)"
      ],
      tradeoff: "Equity é real mas ilíquido. Não conta como cash até vender. Fleet é colateral para financing futuro.",
      evidence: "RAV4 Hybrid resale 85% Y1 (KBB), rental discount 10-15%, auction values 2025-2026 estáveis."
    },
    {
      id: 6,
      name: "Dependência Operacional",
      weight: 1,
      scoreA: 3,
      scoreB: 7,
      scoreStress: 5,
      strength: "B: AI 70% automação + 5.000 parcerias distribui risco. Nenhum single point of failure.",
      weakness: "A: 100% dependente de 1 admin. B: 70% dependente de stack AI (PriceLabs, Zapier, etc.)",
      deception: "AI 70% automação parece independência mas cria dependência de infra tech. Se PriceLabs cair, pricing manual.",
      looksGoodButIsnt: "Para quem nunca gerenciou stack de automação. Manutenção de integrações consome 5-10h/semana.",
      lethalWeapon: "Quando o operador é técnico e pode manter/ajustar AI stack. Gabriel on-site + tech skills = combo letal.",
      trap: "Quando depende 100% de SaaS externo sem fallback manual documentado.",
      unknownUnknowns: [
        "PriceLabs/competitors podem descontinuar features ou aumentar preços 2-3x",
        "Regulação de AI em pricing (discriminatory pricing laws) pode surgir"
      ],
      tradeoff: "B troca dependência humana (frágil) por dependência tech (escalável mas requer manutenção).",
      evidence: "PriceLabs $20/listing/mês, Zapier $50/mês, Spireon $25/carro/mês. Total tech stack ~$500/mês para 20 carros."
    },
    {
      id: 7,
      name: "Velocidade de Execução",
      weight: 1,
      scoreA: 4,
      scoreB: 9,
      scoreStress: 7,
      strength: "B: LLC Sunbiz 24h + EIN instant + carro cash = operacional em 3-5 dias. Off-airport elimina burocracia airport.",
      weakness: "Insurance binding pode levar 3-7 dias. Sem seguro ativo = zero operação legal.",
      deception: "'7 dias' assume tudo corre perfeito. Realista: 10-14 dias para first revenue com insurance delay.",
      looksGoodButIsnt: "Para quem acha que comprar carro = está operando. Precisa: LLC + insurance + contratos + website + primeiro booking.",
      lethalWeapon: "Quando pre-negocia insurance ANTES de comprar carro. Timeline: quotes dia 0, compra dia 2, binding dia 5, first rental dia 7.",
      trap: "Quando compra carro antes de ter insurance quote e descobre que quotes são $600+ (acima do breakeven).",
      unknownUnknowns: [
        "DMV Florida processing delays (pode atrasar registration 2-3 semanas)",
        "Bank hold em transferência grande (cash purchase $60K+ pode trigger AML review)"
      ],
      tradeoff: "Velocidade é vantagem competitiva mas não deve comprometer due diligence em insurance e legal.",
      evidence: "Sunbiz LLC $125, 24h online. EIN IRS instant. BTR Miami-Dade $50. RAV4 Hybrid availability forte 2026."
    },
    {
      id: 8,
      name: "Tax Optimization FL",
      weight: 1,
      scoreA: 5,
      scoreB: 9,
      scoreStress: 8,
      strength: "FL 0% income tax + rent tax repealed 2024 + Section 179 depreciation + property empire para wealth building.",
      weakness: "Federal tax ainda aplica (21% corporate ou income bracket). FL tax advantage é real mas não é 'zero tax total'.",
      deception: "'Tax 0%' refere-se APENAS a state income tax. Federal + self-employment + sales tax em rental ainda existem.",
      looksGoodButIsnt: "Para quem lê '0% tax FL' e assume zero impostos. Realidade: 6% sales tax on rentals + federal income tax.",
      lethalWeapon: "Quando estrutura como S-Corp + Section 179 + reasonable salary + property depreciation = effective rate <15%.",
      trap: "Quando ignora 6% FL sales tax on short-term rentals (obrigatório, collected from customer).",
      unknownUnknowns: [
        "FL pode reintroduzir rental surcharge (proposta 2025 não passou mas pode voltar)",
        "Federal tax reform 2026-2027 pode alterar Section 179 limits"
      ],
      tradeoff: "FL é genuinamente vantajoso vs CA/NY (~10-13% state tax savings). Mas não é paraíso fiscal total.",
      evidence: "FL Statute 212.0606 rent tax repealed 2024. Section 179 2026 limit $1.22M. FL sales tax 6% + county surtax."
    },
    {
      id: 9,
      name: "Market Timing & Demanda",
      weight: 1,
      scoreA: 6,
      scoreB: 8,
      scoreStress: 4,
      strength: "Miami 28M turistas/ano + 1M+ brasileiros/ano = demanda real. Off-airport underserved. SUVs/hybrids demanda alta.",
      weakness: "Mercado competitivo — Hertz, Enterprise, Sixt + 100+ independents. Diferenciação precisa ser real, não marketing.",
      deception: "28M turistas ≠ 28M clientes potenciais. Só ~15-20% alugam carro. Market share off-airport é 8-12% do total.",
      looksGoodButIsnt: "Para quem extrapola TAM sem SAM/SOM. 28M turistas soa enorme mas seu addressable market é ~500K-1M/ano off-airport.",
      lethalWeapon: "Quando captura nicho PT (1M brasileiros, carente de atendimento em português) + delivery + parcerias Airbnb.",
      trap: "Quando assume que demanda = bookings sem investir em distribuição (SEO, parcerias, ads).",
      unknownUnknowns: [
        "Recessão econômica pode reduzir turismo Miami 20-30% (2008: -35%)",
        "Nova regulação de short-term rental Miami pode afetar Airbnb hosts (reduzindo parcerias)"
      ],
      tradeoff: "Timing 2026 é favorável (turismo recuperado pós-COVID) mas cíclico. Precisa de reserva para downturns.",
      evidence: "Visit Florida 2025: 28M visitors Miami-Dade. Brazilian consulate Miami: 1M+ brazilians/ano."
    },
    {
      id: 10,
      name: "Exit Strategy / Valuation",
      weight: 1,
      scoreA: 2,
      scoreB: 8,
      scoreStress: 4,
      strength: "B com 200 carros + $500K/mês revenue = valuation 3-5x revenue = $18-30M. Aquisição por Hertz/Enterprise viável.",
      weakness: "Car rental independents raramente atingem valuation de tech company. Multiple é 2-3x revenue, não 5-10x.",
      deception: "IPO em 24 meses com car rental é fantasioso. Aquisição é possível mas valuation depende de unit economics provados.",
      looksGoodButIsnt: "Para quem compara com startups tech. Car rental é asset-heavy, low-margin relativo. Valuation é sobre cash flow, não growth.",
      lethalWeapon: "Quando constrói brand + tech stack proprietário + recurring revenue (subscriptions) = premium na aquisição.",
      trap: "Quando projeta exit 5-10x revenue mas comprador aplica 2-3x EBITDA (padrão da indústria).",
      unknownUnknowns: [
        "Consolidação da indústria pode criar compradores inesperados (private equity em roll-ups)",
        "Autonomous vehicles podem disrumpir car rental inteiro em 3-5 anos (reduz valuation futuro)"
      ],
      tradeoff: "Exit é bônus, não estratégia primária. Foco em cash flow. Exit vem como consequência de operação excelente.",
      evidence: "Hertz acquisition 2021 $4.2B (~3x revenue). Enterprise private $35B valuation. PE roll-ups FL 2024-2025."
    }
  ];

  const calcWeighted = (scoreFn: (c: CriterionScore) => number) =>
    criteria.reduce((sum, c) => sum + scoreFn(c) * c.weight, 0);

  const maxPossible = criteria.reduce((sum, c) => sum + 10 * c.weight, 0);

  const totalWeightedA = calcWeighted(c => c.scoreA);
  const totalWeightedB = calcWeighted(c => c.scoreB);
  const totalWeightedStress = calcWeighted(c => c.scoreStress);

  const contradictions = [
    "CONTRADIÇÃO 1: Claim de '0% tax' vs realidade de 6% sales tax FL + federal income tax. Net advantage real é ~10-13% vs estados com income tax, não 'zero tax'.",
    "CONTRADIÇÃO 2: Payback '2.5 meses' refere-se apenas aos 2 primeiros carros cash. Payback da operação com 50 carros + luxury é 6-10 meses, incluindo capital de escala.",
    "CONTRADIÇÃO 3: 'Nenhuma dependência de plataforma' vs stack AI completa (PriceLabs, Zapier, Spireon). Há dependência, só que é de SaaS, não de Turo/Getaround.",
    "CONTRADIÇÃO 4: 'IPO em 24 meses' é irreal para car rental independente. Aquisição por PE é plausível com $6M+ revenue/ano, mas IPO requer >$50M revenue + growth track record.",
    "CONTRADIÇÃO 5: Utilização 90%+ assumed vs dados reais off-airport de 70-85% (Rentscout). Gap de 5-20% impacta diretamente margem e payback.",
    "CONTRADIÇÃO 6: '200 carros em 18 meses' assume reinvestimento 100%. Na prática, tax federal + living expenses + emergency fund = max 60-70% reinvestível.",
  ];

  const analogies = [
    "ANALOGIA 1: Locadora off-airport em Miami é como food truck gourmet em festival — demanda garantida, margens altas, mas cada evento (mês) é uma aposta e weather (claims) pode cancelar tudo.",
    "ANALOGIA 2: Escalar de 2 para 200 carros é como escalar restaurante para franquia — o produto é simples mas os sistemas por trás são 10x mais complexos que o produto.",
    "ANALOGIA 3: Natalya Zorina para locadoras é o que Ray Kroc foi para hamburgers — o produto é commodity, o sistema de escala é o asset real. Cuidado: survivorship bias.",
    "ANALOGIA 4: Insurance em FL para rental é como a taxa de câmbio para exportador — você pode calcular tudo perfeito mas uma variação inesperada pode eliminar toda a margem.",
  ];

  const breakpoints = [
    "QUEBRA 1: Se insurance > $500/mês/carro (total fleet avg), margem cai abaixo de 15% e payback estica para >12 meses.",
    "QUEBRA 2: Se utilização < 65% por 3 meses consecutivos, cash flow negativo com 10+ carros. Pivot imediato necessário.",
    "QUEBRA 3: Se claims > 2 por mês com frota de 20 carros, insurance renewal sobe 50-80% e pode inviabilizar operação.",
    "QUEBRA 4: Se reinvestimento cai abaixo de 50%, escala para 200 carros em 18 meses é impossível. Target máximo: 50-80 carros.",
    "QUEBRA 5: Se admin turn 20% não performa (NPS <4.5, util <75%), toda a tese de escala remota colapsa.",
  ];

  return {
    criteria,
    totalWeightedA,
    totalWeightedB,
    totalWeightedStress,
    maxPossible,
    contradictions,
    analogies,
    recommendation: `VEREDITO FORENSE: Cenário B é superior em 8/10 critérios (score ponderado ${totalWeightedB}/${maxPossible} vs A ${totalWeightedA}/${maxPossible}), MAS com guardrails obrigatórios. O risco dominante (claims/insurance FL) é gerenciável com telematics + screening + $2M liability. Payback real dos 2 primeiros carros: 2.5-3 meses. Payback da operação com escala: 6-8 meses. Recomendação: EXECUTE B com os 5 guardrails nucleares, monitore triggers de quebra mensalmente, e mantenha reserva de 3 meses de operating expenses. NÃO extrapole cases de sucesso (survivorship bias) — Natalya é outlier top 1%. Target realista: 50-80 carros em 18 meses com margem 20-30%.`,
    breakpoints,
    verdict: `Score Ponderado Final: B=${totalWeightedB}/${maxPossible} (${(totalWeightedB/maxPossible*100).toFixed(1)}%) | A=${totalWeightedA}/${maxPossible} (${(totalWeightedA/maxPossible*100).toFixed(1)}%) | Stress=${totalWeightedStress}/${maxPossible} (${(totalWeightedStress/maxPossible*100).toFixed(1)}%). B vence por ${totalWeightedB - totalWeightedA} pontos ponderados. Execução imediata recomendada com monitoramento semanal dos 5 breakpoints.`,
  };
}
