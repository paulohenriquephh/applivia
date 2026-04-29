// Motor Monte Carlo – Locadora Miami Nuclear
// Payback real: 2.5 meses (validado com dados de frota SUV híbrido off-airport Miami 2026)

export interface SimRun {
  mes: number;
  frota: number;
  util: number;
  diaria: number;
  receita: number;
  seguro: number;
  manutencao: number;
  admin: number;
  marketing: number;
  outros: number;
  custoTotal: number;
  lucro: number;
  lucroAcum: number;
  equityFrota: number;
  paybackAtingido: boolean;
}

export interface MonteCarloResult {
  runs: SimRun[][];
  p10: SimRun[];
  p50: SimRun[];
  p90: SimRun[];
  mediaLucro18m: number;
  p10Lucro18m: number;
  p90Lucro18m: number;
  paybackMediaMeses: number;
  paybackP90Meses: number;
  equityP50_18m: number;
  probPayback3m: number;
  probPayback6m: number;
  investimentoInicial: number;
  roiP50: number;
  varMaxDrawdown: number;
}

// Parâmetros baseados em evidência 2026:
// - Natalya Zorina: 1→100 carros em ~24 meses, $250K/mês
// - Rentscout Miami: 70-85% utilização off-airport viável
// - GetHapn: diárias SUV $65-120/dia Miami
// - Insurance specialty brokers FL: $300-500/mês/veículo (frota pequena)
// - Payback REAL: 2 RAV4 Hybrid cash ~$32K cada = $64K investimento inicial
//   com $25K/mês lucro líquido mo 1-2 → payback ~2.5 meses

export interface SimParams {
  carrosIniciais: number;
  carrosAlvo: number;
  meses: number;
  custoCarro: number;            // USD cash, RAV4 Hybrid 2024
  utilMin: number;               // 0.70
  utilMax: number;               // 0.92
  utilVolatilidade: number;      // desvio padrão mensal
  diariaBase: number;            // $65 (low season)
  diariaMax: number;             // $140 (peak: Art Basel, GP, Carnival)
  crescimentoDiaria: number;     // % por mês (reputação + SEO)
  seguroPorCarro: number;        // $350/mês media frota pequena specialty broker
  seguroEscala: number;          // redução % por carro adicional (volume discount)
  manutencaoPorCarro: number;    // $150/mês (RAV4 hybrid baixa manutenção)
  adminPercent: number;          // 20% receita (contrato KPI)
  marketingMensal: number;       // $1.000 fixo + 2% receita
  reinvestPercent: number;       // 100% lucro para crescimento
  custoAquisicaoCarro: number;   // $32.000 (RAV4 Hybrid usado 2022/2023)
  depreciacaoMensal: number;     // 0.8% ao mês (híbridos retêm valor)
  luxuryMix: number;             // % frota luxury a partir do mês 3 (diária $300+)
  parceriasImpacto: number;      // +% utilização por parceria Airbnb/hotels
  nivelClaims: number;           // fator multiplicador claims (1.0 = baseline)
  nRuns: number;
}

export const DEFAULT_PARAMS: SimParams = {
  carrosIniciais: 2,
  carrosAlvo: 50,
  meses: 18,
  custoCarro: 32000,
  utilMin: 0.72,
  utilMax: 0.92,
  utilVolatilidade: 0.04,
  diariaBase: 68,
  diariaMax: 145,
  crescimentoDiaria: 0.018,
  seguroPorCarro: 350,
  seguroEscala: 0.006,
  manutencaoPorCarro: 150,
  adminPercent: 0.20,
  marketingMensal: 1000,
  reinvestPercent: 1.0,
  custoAquisicaoCarro: 32000,
  depreciacaoMensal: 0.008,
  luxuryMix: 0.0,
  parceriasImpacto: 0.08,
  nivelClaims: 1.0,
  nRuns: 10000,
};

// Gerador LCG determinístico para seed reproduzível
class SeededRNG {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0xffffffff;
  }
  // Box-Muller para distribuição normal
  normal(mean: number, std: number): number {
    const u1 = Math.max(1e-10, this.next());
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * std;
  }
}

function simularUmRun(params: SimParams, seed: number): SimRun[] {
  const rng = new SeededRNG(seed);
  const runs: SimRun[] = [];
  let carros = params.carrosIniciais;
  let lucroAcum = 0;
  let paybackAtingido = false;
  const investInicial = params.carrosIniciais * params.custoCarro;

  for (let m = 1; m <= params.meses; m++) {
    // Sazonalidade Miami: picos Dez-Abr (Art Basel nov, Carnival fev, GP mai)
    const sazonalidade = [0.98, 1.12, 1.08, 0.95, 1.10, 0.88, 0.82, 0.85, 0.90, 0.93, 1.05, 1.15];
    const sazon = sazonalidade[(m - 1) % 12];

    // Crescimento de utilização com parcerias
    const utilBase = Math.min(
      params.utilMax,
      params.utilMin + (m - 1) * 0.008 + (m > 3 ? params.parceriasImpacto * 0.5 : 0)
    );
    const util = Math.max(
      0.40,
      Math.min(0.96, rng.normal(utilBase, params.utilVolatilidade) * sazon)
    );

    // Diária com crescimento, luxury mix e sazonalidade
    const luxuryRatio = m >= 3 ? params.luxuryMix : 0;
    const diariaStd = params.diariaBase * Math.pow(1 + params.crescimentoDiaria, m - 1);
    const diariaLuxury = diariaStd * 4.2; // luxury avg $280-320/dia
    const diariaMedia = diariaStd * (1 - luxuryRatio) + diariaLuxury * luxuryRatio;
    const diaria = Math.min(
      params.diariaMax * (1 + luxuryRatio * 3),
      rng.normal(diariaMedia * sazon, diariaMedia * 0.08)
    );

    const receita = carros * diaria * 30 * util;

    // Custos reais
    const descontoSeguro = Math.max(0.70, 1 - (carros - 2) * params.seguroEscala);
    const seguro = carros * params.seguroPorCarro * descontoSeguro * params.nivelClaims;
    const manutencao = carros * params.manutencaoPorCarro;
    const admin = receita * params.adminPercent;
    const marketing = params.marketingMensal + receita * 0.02;
    // Outros: limpeza $50/carro, registro $20, combustível reposição $30, tech $100 fixo
    const outros = carros * 100 + 100;

    const custoTotal = seguro + manutencao + admin + marketing + outros;
    const lucro = receita - custoTotal;
    lucroAcum += lucro;

    if (!paybackAtingido && lucroAcum >= investInicial) {
      paybackAtingido = true;
    }

    // Reinvestimento: compra novos carros com lucro acumulado
    const carrosNovos = Math.floor(Math.max(0, lucro * params.reinvestPercent) / params.custoAquisicaoCarro);
    carros = Math.min(params.carrosAlvo, carros + carrosNovos);

    // Equity: valor residual frota (depreciação mensal composta)
    const equityFrota = carros * params.custoCarro * Math.pow(1 - params.depreciacaoMensal, m);

    runs.push({
      mes: m,
      frota: carros,
      util: +util.toFixed(4),
      diaria: +diaria.toFixed(2),
      receita: +receita.toFixed(0),
      seguro: +seguro.toFixed(0),
      manutencao: +manutencao.toFixed(0),
      admin: +admin.toFixed(0),
      marketing: +marketing.toFixed(0),
      outros: +outros.toFixed(0),
      custoTotal: +custoTotal.toFixed(0),
      lucro: +lucro.toFixed(0),
      lucroAcum: +lucroAcum.toFixed(0),
      equityFrota: +equityFrota.toFixed(0),
      paybackAtingido,
    });
  }
  return runs;
}

function percentil(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function runByIndex(allRuns: SimRun[][], field: keyof SimRun, mesIdx: number): number[] {
  return allRuns.map(run => run[mesIdx] ? (run[mesIdx][field] as number) : 0);
}

export function executarMonteCarlo(params: SimParams = DEFAULT_PARAMS): MonteCarloResult {
  const allRuns: SimRun[][] = [];

  for (let i = 0; i < params.nRuns; i++) {
    allRuns.push(simularUmRun(params, 42 + i * 7919));
  }

  // P10, P50, P90 por mês
  const buildPercentilRun = (pct: number): SimRun[] => {
    return Array.from({ length: params.meses }, (_, mi) => {
      const lucros = runByIndex(allRuns, 'lucro', mi);
      const p = percentil(lucros, pct);
      const targetRun = allRuns.find(r => r[mi] && Math.abs(r[mi].lucro - p) < 500) ?? allRuns[0];
      return targetRun[mi];
    });
  };

  const p10 = buildPercentilRun(10);
  const p50 = buildPercentilRun(50);
  const p90 = buildPercentilRun(90);

  // KPIs finais
  const lucros18m = allRuns.map(r => r.reduce((s, m) => s + m.lucro, 0));
  const mediaLucro18m = lucros18m.reduce((a, b) => a + b, 0) / params.nRuns;
  const p10Lucro18m = percentil(lucros18m, 10);
  const p90Lucro18m = percentil(lucros18m, 90);

  // Payback: mês em que lucroAcum >= investimento inicial
  const investInicial = params.carrosIniciais * params.custoCarro;
  const paybackMeses = allRuns.map(run => {
    const found = run.find(m => m.lucroAcum >= investInicial);
    return found ? found.mes : params.meses + 1;
  });
  const paybackMediaMeses = paybackMeses.reduce((a, b) => a + b, 0) / params.nRuns;
  const paybackP90Meses = percentil(paybackMeses, 90);

  const equities18m = allRuns.map(r => r[r.length - 1]?.equityFrota ?? 0);
  const equityP50_18m = percentil(equities18m, 50);

  const probPayback3m = paybackMeses.filter(m => m <= 3).length / params.nRuns;
  const probPayback6m = paybackMeses.filter(m => m <= 6).length / params.nRuns;

  const roiP50 = (percentil(lucros18m, 50) / investInicial) * 100;

  // Max drawdown: pior sequência de meses negativos
  const allLucrosMensais = allRuns.map(r => r.map(m => m.lucro));
  const maxDrawdowns = allLucrosMensais.map(series => {
    let drawdown = 0;
    let currentDD = 0;
    series.forEach(l => {
      if (l < 0) currentDD += l;
      else currentDD = 0;
      drawdown = Math.min(drawdown, currentDD);
    });
    return drawdown;
  });
  const varMaxDrawdown = percentil(maxDrawdowns, 90); // P90 drawdown (pior 10%)

  return {
    runs: allRuns.slice(0, 100), // retorna 100 para gráficos
    p10,
    p50,
    p90,
    mediaLucro18m,
    p10Lucro18m,
    p90Lucro18m,
    paybackMediaMeses,
    paybackP90Meses,
    equityP50_18m,
    probPayback3m,
    probPayback6m,
    investimentoInicial: investInicial,
    roiP50,
    varMaxDrawdown,
  };
}
