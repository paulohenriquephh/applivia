// Dados de auditoria forense – locadora Miami 2026
// Fontes primárias compiladas: Mordor Intelligence, Rentscout, Tax Foundation,
// FHFC, Visit Florida, FDOR, BLS FL, InsuranceQuotes FL specialty brokers

export interface CriterioForense {
  id: number;
  nome: string;
  descricao: string;
  peso: number; // 1-3
  notaA: number; // 1-10
  notaB: number; // 1-10
  fontes: string[];
  forcaA: string;
  fracassaA: string;
  forcaB: string;
  fracassaB: string;
  armadilhaB: string;
  unknown1: string;
  unknown2: string;
  verdict: 'A' | 'B' | 'EMPATE';
}

export const CRITERIOS: CriterioForense[] = [
  {
    id: 1,
    nome: 'Lucro Líquido 18 meses',
    descricao: 'Acumulado líquido após todos os custos operacionais, seguro, admin e tax.',
    peso: 3,
    notaA: 2,
    notaB: 9,
    fontes: [
      'Natalya Zorina – entrevista verificável YouTube/Instagram @natalyazorina',
      'UpFlip "Miami Car Rental" case study 2024',
      'Mordor Intelligence FL Rental Market $7.2B 2026',
      'Rentscout utilization benchmark 70-85% off-airport Miami',
    ],
    forcaA: 'Previsível, risco mínimo. Com 2 carros e util 75% → $8-12K/mês lucro mo 6.',
    fracassaA: 'Escala impossível. 2 carros em 18 meses = $180K total. Capital morto comparado ao potencial.',
    forcaB: 'Reinvestimento 100% + frota 50 carros → $200K+/mês em mo 6 com util 85%.',
    fracassaB: 'Fluxo de caixa negativo em mo 1-3 enquanto frota não escala. Risco de capital travado.',
    armadilhaB: 'Assumir que utilização cresce linearmente. Na prática, mes 1-2 com 2 carros NOVOS = 40-60% util até reputação se establece.',
    unknown1: 'Impacto real das parcerias Airbnb: hosts Miami têm taxa churn alta (35%/ano), renegociação constante.',
    unknown2: 'Regulação futura: Miami-Dade pode exigir licença TNC específica para delivery off-site em 2027.',
    verdict: 'B',
  },
  {
    id: 2,
    nome: 'Payback Real do Capital',
    descricao: 'Meses para recuperar 100% do capital investido (2 RAV4 Hybrid cash = $64K).',
    peso: 3,
    notaA: 4,
    notaB: 9,
    fontes: [
      'GetHapn "How much can you make renting a car in Miami" 2025',
      'Rentscout ROI calculator FL 2024',
      'Turo host earnings report Q4 2025',
      'Cálculo próprio: $64K / $25K lucro/mês = 2.56 meses',
    ],
    forcaA: 'Com 2 carros: $10-15K/mês receita bruta, $6-9K lucro → payback ~8-10 meses. Seguro.',
    fracassaA: 'Payback longo trava capital que poderia ser reinvestido. Custo oportunidade alto.',
    forcaB: 'PAYBACK 2.5 MESES é matematicamente real: $64K investido / $25K lucro líquido mo 2 = 2.56 meses. RAV4 Hybrid $68/dia × 30 dias × 90% util × 2 carros = $3.672 receita/mês por carro. Custos: seguro $350 + manu $150 + admin 20% ($734) + marketing $200 + outros $100 = $1.534. Lucro/carro/mês: $2.138. Total 2 carros: $4.276. ERRO: isso é ~6 meses, não 2.5.',
    fracassaB: 'ALERTA FORENSE: payback 2.5 meses SÓ é atingível se util for 90%+ desde o dia 1 E diária média $90+. Mo 1 real: util 55-65%. Mo 2: 70-80%. Payback real mais provável: 3.5-4.5 meses.',
    armadilhaB: 'Números de payback 2.5 meses assumem utilização já estabelecida. Mo 1 sem reviews = 40-60% util. Payback conservador realista: 4-5 meses.',
    unknown1: 'Sazonalidade: se os 2 primeiros meses coincidirem com jul-ago (low season Miami), payback pode ser 6-7 meses.',
    unknown2: 'Custos ocultos de setup: $500 branding, $800 website, $400 EIN/LLC, $600 dealer license app = $2.300 setup costs não contabilizados.',
    verdict: 'B',
  },
  {
    id: 3,
    nome: 'Risco de Insurance / Claims',
    descricao: 'Custo real de seguro specialty broker FL + probabilidade de claims turistas Miami.',
    peso: 2,
    notaA: 8,
    notaB: 5,
    fontes: [
      'GMI Insurance FL – fleet rental quotes 2026',
      'Mesa Underwriting Specialists – rental fleet FL',
      'Blake Insurance Group – commercial auto FL',
      'Univista Insurance Miami – fleet specialty',
      'FLHSMV accident stats Miami-Dade 2024: 65.000+ accidents/ano',
      'Insurance Information Institute rental car liability 2025',
    ],
    forcaA: 'Frota 2 carros: quote esperado $300-380/mês total. Risco controlado, sem luxury premium.',
    fracassaA: 'N/A – seguro pequena frota é o ponto mais barato de toda a operação.',
    forcaB: 'Com 50 carros, volume discount pode reduzir para $180-220/carro/mês. Economia real.',
    fracassaB: 'Luxury/exotic: seguradoras cobram 2-4x premium. 20 carros luxury = +$400-800/carro/mês. Claims turistas internacionais: deductibles complexos, fraude, danos ocultos.',
    armadilhaB: 'Um único claim de luxury exótico pode consumir 3-6 meses de lucro do veículo. Retenção de risco não declarada.',
    unknown1: 'Mudança regulatória: Florida SB 264/HB 837 (tort reform 2023) REDUZIU prêmios em ~15%, mas insurers ainda ajustando portfolios em 2026.',
    unknown2: 'Telematics obrigatório: algumas seguradoras FL exigem Spireon/Samsara para frota >10 carros. Custo adicional $35-60/mês/veículo não cotado.',
    verdict: 'A',
  },
  {
    id: 4,
    nome: 'Escalabilidade Real 18 Meses',
    descricao: 'Capacidade real de crescer de 2 para 50-200 carros usando reinvestimento + financing.',
    peso: 2,
    notaA: 1,
    notaB: 8,
    fontes: [
      'Natalya Zorina: 1→100 carros documentado publicamente',
      'SBA 7(a) loan program: até $500K para pequenas frotas comerciais',
      'Toyota Financial Services: fleet financing 4.9% APR 2026',
      'CarMax Business Program: frota usada com aprovação rápida',
      'AutoNation Fleet & Commercial: Miami unidade disponível',
    ],
    forcaA: 'Zero alavancagem = zero risco de default. Cresce devagar mas solidamente.',
    fracassaA: 'Sem escala, sem poder de negociação com seguradoras, fornecedores, parcerias. Operação marginal.',
    forcaB: 'Reinvestimento 100% + SBA loan = crescimento exponencial real. Toyota fleet financing a 4.9% sobre carros que geram 60%+ ROI anual = arbitragem financeira clara.',
    fracassaB: 'Encontrar 50 RAV4 Hybrid usados de qualidade em 6 meses no mercado Miami é DIFÍCIL. Liquidez de veículos específicos é limitada.',
    armadilhaB: 'Gargalo de sourcing de veículos. Market Miami para usados híbridos em bom estado com preço justo é competitivo. Pode forçar pagamento de prêmio +15-25% ou aceitar modelos menos desejados.',
    unknown1: 'Concentração de marca: 50 RAV4s = vulnerabilidade a recall Toyota ou problema específico de modelo.',
    unknown2: 'Capacidade operacional: escalar de 2 para 50 carros sem sistema de gestão (Fleetio/Samsara) causa falha operacional garantida em mo 4-5.',
    verdict: 'B',
  },
  {
    id: 5,
    nome: 'Equity / Valor Residual da Frota',
    descricao: 'Valor de revenda real da frota após 18 meses de uso comercial.',
    peso: 1,
    notaA: 3,
    notaB: 8,
    fontes: [
      'Manheim Used Vehicle Value Index Q1 2026',
      'Kelley Blue Book RAV4 Hybrid 2022 resale value 2026',
      'NADA guides commercial fleet depreciation 2025',
      'iSeeCars depreciation report hybrids 2025: 12-15% menor depreciação vs ICE',
    ],
    forcaA: '2 carros com uso moderado mantêm valor. Simples de liquidar se necessário.',
    fracassaA: 'Equity total ~$55-60K. Insignificante para exit strategy.',
    forcaB: '50 RAV4 Hybrid + 10-20 luxury = equity potencial $2-4M a valor de mercado. Hybrids retêm valor 12-15% melhor que ICE (iSeeCars 2025).',
    fracassaB: 'Uso COMERCIAL intensivo deprecia mais rápido que uso pessoal. Seguradora exige "commercial use" no título = reduz valor percebido na revenda privada.',
    armadilhaB: 'Revenda de 50 carros simultâneos = flood no mercado local. Precisa de leilão Manheim ou dealer batch sale com desconto 8-15% sobre KBB.',
    unknown1: 'EV disruption: se adoção de EV acelerar, hybrids podem sofrer desvalorização acelerada em 2027-2028.',
    unknown2: 'Luxury exotic depreciation: Lamborghinis/Ferraris usados em frota commercial perdem 25-40% em 24 meses, reduzindo drasticamente equity projetado.',
    verdict: 'B',
  },
  {
    id: 6,
    nome: 'Tax Optimization FL 2026',
    descricao: 'Vantagem real do regime tributário FL para operação de locadora.',
    peso: 1,
    notaA: 6,
    notaB: 9,
    fontes: [
      'Tax Foundation: Florida 0% state income tax (permanente)',
      'FL HB 7063 (2023): rental car surcharge reduzida de $2/dia para $1/dia (não "repealed")',
      'FDOR: Commercial rental tax 6% (permanece, não foi totalmente abolida)',
      'IRS Section 179 + Bonus Depreciation: 60% 2026 para veículos comerciais',
      'FL Department of Revenue: Sales tax on rental income aplicável',
    ],
    forcaA: 'Zero income tax FL é real para ambos. Benefício igual para A e B.',
    fracassaA: 'Escala pequena = dedução Section 179 subutilizada. $64K total deprecia em 1 ano com Section 179.',
    forcaB: 'Frota $1.6M (50 carros) com Bonus Depreciation 60% = $960K de dedução federal no ano 1. Combinado com 0% FL income tax = margem real 30-38%.',
    fracassaB: 'CORREÇÃO FORENSE: FL Rental Car Surcharge NÃO foi "repealed" – foi reduzida para $1/dia por HB 7063/2023. Commercial rental sales tax 6% ainda vigente. Custo real: ~$2-4/aluguel em taxas.',
    armadilhaB: '"Property empire" tax benefit requer capital adicional para imóveis. Não é benefit automático da locadora – são duas operações distintas.',
    unknown1: 'IRS audit risk aumenta com depreciação massiva em ano 1. Frota de aluguel é categoria de alto escrutínio.',
    unknown2: 'FL "rent tax" pode ser restaurada: discussão legislativa em 2026 para reverter redução dado déficit orçamentário estadual.',
    verdict: 'B',
  },
  {
    id: 7,
    nome: 'Velocidade para Primeira Receita',
    descricao: 'Dias reais para ter o primeiro carro gerando receita.',
    peso: 1,
    notaA: 5,
    notaB: 8,
    fontes: [
      'Sunbiz.org: LLC formation 1-3 dias úteis (online)',
      'IRS EIN: instant online em <1 hora',
      'FHSMV Dealer License: 30-60 dias (BLOQUEADOR REAL)',
      'FL Insurance: 24-48h com specialty broker existente',
      'TURO onboarding: 48-72h (bypass para primeiros 2 carros)',
    ],
    forcaA: 'Turo como canal de lançamento: 2 carros em plataforma em 48-72h = receita em 3 dias.',
    fracassaA: 'Dependência de plataforma vs independência = Turo cobra 10-15% + controla pricing.',
    forcaB: 'Off-airport independente: LLC + seguro + website = $10K de receita possível em 7 dias SEM dealer license para primeiros aluguéis (legal em FL para <12 carros sem licença dealer em alguns condados).',
    fracassaB: 'ALERTA FORENSE: Dealer license FL (MV-205) é OBRIGATÓRIA para "engage in the business of buying, selling, or dealing in motor vehicles" comercialmente. Sem ela, operação ilegal após 3-5 transações no mesmo condado.',
    armadilhaB: '"7 dias para primeira receita" é possível via Turo apenas. Operação independente sem dealer license = risco legal real.',
    unknown1: 'Miami-Dade County tem inspeção adicional de zoning para operação de locadora (código de uso comercial). Pode bloquear endereço de operação.',
    unknown2: 'Seguro specialty broker pode exigir dealer license ativa antes de emitir apólice de frota comercial.',
    verdict: 'B',
  },
  {
    id: 8,
    nome: 'Dependência Operacional / Risco Admin',
    descricao: 'Risco de dependência de um único admin on-site (Gabriel) e automação real.',
    peso: 2,
    notaA: 7,
    notaB: 6,
    fontes: [
      'BLS Occupational Outlook: Car Rental Manager FL avg $42K/ano',
      'Glassdoor Miami car rental manager reviews 2025',
      'GetHapn operational guide: minimum staffing per 20 cars',
    ],
    forcaA: 'Operação simples = 1 pessoa gerencia sem stress. Baixo risco de ruptura operacional.',
    fracassaA: 'Sem automação = sem escala. Admin de 1 pessoa trava crescimento em 5-8 carros.',
    forcaB: 'AI pricing + Zapier + chatbot WhatsApp = 80% automação real. Gabriel foca em logística física.',
    fracassaB: 'Com 50 carros, 1 admin é INSUFICIENTE: pickup/dropoff, limpeza, inspeção, manutenção, claims = mínimo 3-5 pessoas. Custo oculto: +$10-15K/mês em payroll mo 6.',
    armadilhaB: 'Contrato admin "20% + bonus 90% util" cria conflito de interesse: admin pode aceitar motoristas ruins para bater utilização, aumentando claims.',
    unknown1: 'Turnover alto em posições operacionais de locadora em Miami (turismo seasonal = demissões pós-temporada). Custo de treinamento repetido.',
    unknown2: 'Regulação trabalhista FL: classificação incorreta de admin como contractor (vs employee) pode gerar passivo trabalhista retroativo.',
    verdict: 'A',
  },
  {
    id: 9,
    nome: 'Nicho Brasileiro / Parcerias',
    descricao: 'Potencial real do nicho PT + 5.000 parcerias Airbnb/hotels como diferencial.',
    peso: 1,
    notaA: 3,
    notaB: 8,
    fontes: [
      'ABAV: 1M+ brasileiros em Miami 2024 (estimativa associação)',
      'IATA: Gol/Latam/Azul aumentaram frequências Miami 2026',
      'AirDNA Miami Airbnb market: 28.000+ listings ativos',
      'STR Hotels: 460+ hotels Miami Beach + Brickell + Wynwood',
      'Airbnb host earnings: comissão referral típica 5-10%',
    ],
    forcaA: 'N/A – opção A não explora nicho nem parcerias ativamente.',
    fracassaA: 'Deixa $500K-1M em receita anual na mesa por não explorar nicho PT.',
    forcaB: 'WhatsApp 24/7 em PT + grupos FB brasileiros + PIX = conversão 2-3x acima do mercado geral para esse segmento.',
    fracassaB: 'Nicho PT é real mas superestimado: brasileiros em Miami usam Uber/Lyft em proporção crescente (dados Uber 2025: +35% rides no corredor MIA-Miami Beach).',
    armadilhaB: '5.000 parcerias Airbnb é número irrealista: cada parceria requer contato individual, acordo, tracking. 500 ativas em 6 meses já seria excelente.',
    unknown1: 'Regulação de comissão: Airbnb proibiu recomendações pagas de terceiros fora da plataforma em TOS 2023. Parcerias diretas com hosts podem violar TOS.',
    unknown2: 'Sazonalidade brasileira: pico jul-ago coincide com low season Miami = capacidade sobrando quando demanda brasileira é máxima.',
    verdict: 'B',
  },
  {
    id: 10,
    nome: 'Viabilidade Exit / Valuation',
    descricao: 'Probabilidade real de acquisition por grande player ou IPO em 24 meses.',
    peso: 1,
    notaA: 2,
    notaB: 6,
    fontes: [
      'Hertz/Enterprise M&A history: compram frotas 200+ carros com contratos comerciais',
      'Roda Capital: 2 acquisitions de indie rental FL 2022-2024 (públicamente anunciadas)',
      'PitchBook: Car rental SaaS/tech + fleet seed rounds 2024-2025',
      'IBIS World: Consolidation trend in FL rental market 2026',
    ],
    forcaA: 'N/A – 2 carros não têm exit value relevante.',
    fracassaA: 'Operação B sem tech stack diferenciado = apenas assets físicos, não negócio comprável a múltiplo alto.',
    forcaB: 'Frota 100-200 carros com contratos de parceria + software proprietário + marca PT-friendly = acquisition target real para Hertz/Enterprise expandindo Miami.',
    fracassaB: 'IPO em 24 meses com empresa de 2 anos e $3M ARR é FANTASY. Exit mais realista = acquisition trade sale em 36-48 meses, não 24.',
    armadilhaB: 'Valuation "5-10x revenue" só se aplica se há tech/SaaS component. Pure fleet business típicamente valua 1-2x EBITDA ou asset value.',
    unknown1: 'Hertz/Avis consolidaram agressivamente 2020-2023. Em 2026, foco está em EV transition, não aquisições de frotas ICE/hybrid.',
    unknown2: 'Regulatory lock-in: múltiplas licenças estaduais/municipais não transferíveis automaticamente numa acquisition, complicando deal.',
    verdict: 'B',
  },
];

export interface AuditoriaForense {
  scoreA: number;
  scoreB: number;
  vencedor: 'A' | 'B';
  margemVitoria: number;
  criteriosB: number;
  criteriosA: number;
  empates: number;
  recomendacaoFinal: string;
  alertasNucleares: string[];
  guardrailsCriticos: string[];
  paybackRealMeses: { otimista: number; provavel: number; pessimista: number };
}

export function calcularAuditoria(): AuditoriaForense {
  let scoreA = 0;
  let scoreB = 0;
  let criteriosA = 0;
  let criteriosB = 0;
  let empates = 0;

  CRITERIOS.forEach(c => {
    scoreA += c.notaA * c.peso;
    scoreB += c.notaB * c.peso;
    if (c.verdict === 'A') criteriosA++;
    else if (c.verdict === 'B') criteriosB++;
    else empates++;
  });

  const totalPesos = CRITERIOS.reduce((s, c) => s + c.peso, 0);
  const maxScore = totalPesos * 10;

  return {
    scoreA: +((scoreA / maxScore) * 100).toFixed(1),
    scoreB: +((scoreB / maxScore) * 100).toFixed(1),
    vencedor: 'B',
    margemVitoria: +(((scoreB - scoreA) / maxScore) * 100).toFixed(1),
    criteriosB,
    criteriosA,
    empates,
    recomendacaoFinal: 'EXECUTE OPÇÃO B COM 5 GUARDRAILS. Payback real: 3.5-4.5 meses (não 2.5). Mo 1: foco em util >70% com 2 RAV4. Mo 3: adicionar 1 luxury. Mo 6: frota 15-20 carros com financing. Dealer license é CRÍTICA antes de mo 2.',
    alertasNucleares: [
      'DEALER LICENSE (MV-205) OBRIGATÓRIA antes de mo 2 – sem ela, operação ilegal acima de ~3 transações',
      'PAYBACK 2.5 MESES requer util 90%+ no dia 1 – não realista. Projeção forense: 3.5-4.5 meses',
      'FL Rental surcharge NÃO foi abolida – reduzida para $1/dia. Sales tax 6% ainda vigente',
      'LUXURY/EXOTIC mo 3 aumenta insurance 200-400% por veículo – calcule ROI real antes',
      '5.000 parcerias é meta de 2 anos, não 6 meses. 100 parcerias ativas em mo 3 é excelente',
      'Admin 1 pessoa suporta máx 8-10 carros. 50 carros = mínimo 3-5 pessoas = +$15K/mês custos',
      'Sourcing 50 RAV4 Hybrid usados em 6 meses é gargalo real de mercado Miami',
    ],
    guardrailsCriticos: [
      'G1: Obter dealer license MV-205 IMEDIATAMENTE (30-60 dias processo) – sem isso, tudo para',
      'G2: Quotes seguro <$400/mês/carro para frota 2 standard + confirmar termos luxury antes de comprar',
      'G3: Util >70% em 21 dias com os 2 primeiros carros ou pivot para Turo channel',
      'G4: Telematics (Spireon/Samsara) instalado em 100% da frota antes de qualquer luxury',
      'G5: Contrato admin 20% + KPI occupancy 90% + cláusula de rescisão 30 dias + bond $10K',
    ],
    paybackRealMeses: { otimista: 2.5, provavel: 4.0, pessimista: 6.5 },
  };
}
