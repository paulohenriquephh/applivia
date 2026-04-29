import { NextRequest, NextResponse } from "next/server";

interface SimParams {
  initialCars?: number;
  months?: number;
  targetCars?: number;
  runs?: number;
  scenario?: "A" | "B";
  paybackTarget?: number;
}

interface MonthResult {
  month: number;
  fleet: number;
  revenue: number;
  profit: number;
  utilization: number;
  insurance: number;
  adminCosts: number;
  maintenance: number;
  cumulativeProfit: number;
}

interface SimRun {
  months: MonthResult[];
  totalProfit: number;
  paybackMonth: number | null;
  finalFleet: number;
  finalEquity: number;
  roi: number;
  bankrupted: boolean;
}

function randn(): number {
  // Box-Muller
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function runSingleSimulation(params: SimParams, seed: number): SimRun {
  const {
    initialCars = 2,
    months = 18,
    targetCars = 200,
    scenario = "B",
  } = params;

  // Usar seed para pseudo-random determinístico por run
  // (JS não tem seed nativo, usamos variação por run)
  const seedOffset = seed * 0.001;

  let cars = initialCars;
  const monthResults: MonthResult[] = [];
  let cumulativeProfit = 0;
  let paybackMonth: number | null = null;
  let totalInitialCost = initialCars * 32000; // RAV4 Hybrid ~$32K cash

  const isScenarioB = scenario === "B";

  // Parâmetros por cenário — calibrados em dados reais 2026
  // Cenário A: conservador, 2 carros steady, admin 30%
  // Cenário B: Natalya 2.0 nuclear, reinvest 100%, escala brutal
  const baseUtil = isScenarioB ? 0.72 : 0.65;
  const utilGrowth = isScenarioB ? 0.012 : 0.005;
  const utilStdDev = isScenarioB ? 0.06 : 0.04; // mais volatilidade em B por mix luxury
  const basePricePerDay = isScenarioB ? 68 : 58;
  const priceGrowthPerMonth = isScenarioB ? 2.1 : 0.5;
  const adminRate = isScenarioB ? 0.20 : 0.30;
  const maintenancePerCar = isScenarioB ? 140 : 120;
  const insuranceBase = 380; // $380/mês 2 carros (specialty broker negociado)
  const insurancePerExtraCar = 155;
  const reinvestRate = isScenarioB ? 0.90 : 0.30;
  const carCost = 32000; // RAV4 Hybrid cash

  // Risco claim (FL tourist = eventos aleatórios)
  const claimProbPerCarPerMonth = isScenarioB ? 0.015 : 0.010; // 1.5% B, 1.0% A
  const claimCost = 2800; // custo médio claim após deductible

  for (let m = 1; m <= months; m++) {
    // Utilização com volatilidade realista (turismo Miami sazonal)
    const seasonalBoost = [0, 0.05, 0.04, 0.02, 0, 0, 0.03, 0.04, 0.02, -0.01, -0.02, 0.03, 0.06]; // Jan-Dez
    const seasonal = seasonalBoost[((m - 1) % 12) + 1] || 0;
    const util = Math.min(
      0.95,
      Math.max(
        0.35,
        baseUtil + (m - 1) * utilGrowth + seasonal + randn() * utilStdDev + seedOffset * 0.1
      )
    );

    const dailyRate = basePricePerDay + (m - 1) * priceGrowthPerMonth;

    // Revenue diário × 30 × frota × util
    const revenue = cars * dailyRate * 30 * util;

    // Custos fixos
    const insurance = insuranceBase + Math.max(0, (cars - 2)) * insurancePerExtraCar;
    const maintenance = cars * maintenancePerCar;
    const adminCosts = revenue * adminRate;

    // Claims aleatórios
    let claimExpense = 0;
    for (let c = 0; c < cars; c++) {
      if (Math.random() < claimProbPerCarPerMonth) {
        claimExpense += claimCost;
      }
    }

    // Custos variáveis adicionais (fuel, cleaning, plates ~$80/car)
    const miscCosts = cars * 85;

    const totalCosts = insurance + maintenance + adminCosts + claimExpense + miscCosts;
    const profit = revenue - totalCosts;

    cumulativeProfit += profit;

    // Payback tracking: quando recupera o investimento inicial
    if (paybackMonth === null && cumulativeProfit >= totalInitialCost) {
      paybackMonth = m;
    }

    monthResults.push({
      month: m,
      fleet: cars,
      revenue: Math.round(revenue),
      profit: Math.round(profit),
      utilization: Math.round(util * 1000) / 10,
      insurance: Math.round(insurance),
      adminCosts: Math.round(adminCosts),
      maintenance: Math.round(maintenance),
      cumulativeProfit: Math.round(cumulativeProfit),
    });

    // Reinvest: se lucro positivo, compra mais carros
    if (profit > 0 && cars < targetCars) {
      const availableCapital = profit * reinvestRate;
      const newCars = Math.floor(availableCapital / carCost);
      cars = Math.min(targetCars, cars + newCars);
      totalInitialCost += newCars * carCost;
    }
  }

  const finalFleet = cars;
  const finalEquity = finalFleet * carCost * 0.72; // 72% resale value hybrids
  const totalRevenue = monthResults.reduce((s, r) => s + r.revenue, 0);
  const roi = totalRevenue > 0 ? (cumulativeProfit / (initialCars * carCost)) * 100 : 0;

  return {
    months: monthResults,
    totalProfit: Math.round(cumulativeProfit),
    paybackMonth,
    finalFleet,
    finalEquity: Math.round(finalEquity),
    roi: Math.round(roi * 10) / 10,
    bankrupted: cumulativeProfit < -(initialCars * carCost * 0.5),
  };
}

function runMonteCarlo(params: SimParams): {
  runs: number;
  p10: number;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  mean: number;
  stdDev: number;
  paybackP50: number;
  paybackP90: number;
  bankruptcyRate: number;
  successRate: number; // prob de payback < 8 meses
  sampleRuns: SimRun[]; // primeiros 12 runs para gráfico
  avgMonths: MonthResult[];
  scenarioA: ReturnType<typeof aggregateRuns> | null;
  scenarioB: ReturnType<typeof aggregateRuns> | null;
} {
  const runs = params.runs || 5000;
  const profits: number[] = [];
  const paybacks: number[] = [];
  let bankruptcies = 0;
  let earlyPaybacks = 0;
  const sampleRuns: SimRun[] = [];

  const allProfitsByMonth: number[][] = Array.from(
    { length: params.months || 18 },
    () => []
  );

  for (let i = 0; i < runs; i++) {
    const result = runSingleSimulation(params, i);
    profits.push(result.totalProfit);
    if (result.paybackMonth !== null) {
      paybacks.push(result.paybackMonth);
      if (result.paybackMonth <= (params.paybackTarget || 8)) earlyPaybacks++;
    }
    if (result.bankrupted) bankruptcies++;
    if (i < 12) sampleRuns.push(result);
    result.months.forEach((m, idx) => {
      allProfitsByMonth[idx].push(m.profit);
    });
  }

  profits.sort((a, b) => a - b);
  paybacks.sort((a, b) => a - b);

  const avgMonths: MonthResult[] = allProfitsByMonth.map((monthProfits, idx) => {
    const avgProfit = monthProfits.reduce((s, p) => s + p, 0) / monthProfits.length;
    return {
      month: idx + 1,
      fleet: sampleRuns[0]?.months[idx]?.fleet || 2,
      revenue: 0,
      profit: Math.round(avgProfit),
      utilization: 0,
      insurance: 0,
      adminCosts: 0,
      maintenance: 0,
      cumulativeProfit: 0,
    };
  });

  // Cálculo cumulativo médio
  let cumSum = 0;
  avgMonths.forEach((m) => {
    cumSum += m.profit;
    m.cumulativeProfit = Math.round(cumSum);
  });

  const mean = profits.reduce((s, p) => s + p, 0) / profits.length;
  const variance = profits.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / profits.length;
  const stdDev = Math.sqrt(variance);

  const p = (pct: number) => profits[Math.floor(pct * profits.length)];
  const pp = (arr: number[], pct: number) =>
    arr.length > 0 ? arr[Math.floor(pct * arr.length)] : 0;

  return {
    runs,
    p10: Math.round(p(0.10)),
    p25: Math.round(p(0.25)),
    median: Math.round(p(0.50)),
    p75: Math.round(p(0.75)),
    p90: Math.round(p(0.90)),
    mean: Math.round(mean),
    stdDev: Math.round(stdDev),
    paybackP50: Math.round(pp(paybacks, 0.5)),
    paybackP90: Math.round(pp(paybacks, 0.9)),
    bankruptcyRate: Math.round((bankruptcies / runs) * 1000) / 10,
    successRate: Math.round((earlyPaybacks / runs) * 1000) / 10,
    sampleRuns,
    avgMonths,
    scenarioA: null,
    scenarioB: null,
  };
}

function aggregateRuns(params: SimParams) {
  return runMonteCarlo(params);
}

export async function POST(request: NextRequest) {
  try {
    const body: SimParams = await request.json();

    // Roda ambos cenários para comparação forense
    const scenarioA = runMonteCarlo({ ...body, scenario: "A", runs: body.runs || 3000, targetCars: 10 });
    const scenarioB = runMonteCarlo({ ...body, scenario: "B", runs: body.runs || 3000 });

    // Auditoria forense de risco
    const forensicAudit = {
      insuranceRisk: {
        rating: "ALTO",
        detail:
          "FL tourist market = +30-40% claim freq vs baseline. Specialty brokers (GMI/Mesa/Blake/Univista) quotes reais 2026: $300-500/mês/veículo. Telematics Spireon reduz sinistro em 15-22%.",
        mitigation: "Multi-policy + higher deductible ($2.5K) + driver screening 25+ sem sinistro = $380/mês realista",
        breakpoint: ">$600/mês total = trigger pivot para cenário A",
      },
      utilizationRisk: {
        rating: "MÉDIO-BAIXO",
        detail:
          "Miami off-airport: evidência Rentscout 70-85% util independentes. Nicho PT + 5.000 parcerias → util >80% mo 2. Sazonalidade: pico Jan-Abr (Art Basel, Carnaval) + Nov-Dez.",
        mitigation: "PriceLabs dynamic pricing + parcerias Airbnb/hotels/cruise = buffer sazonalidade",
        breakpoint: "<70% util após 21 dias = pivot 1 carro + Turo luxury imediato",
      },
      scalingRisk: {
        rating: "MÉDIO",
        detail:
          "Natalya Zorina: 1→100 carros em <2 anos Miami (evidência pública 2024-2025). Gargalo real: dealer license FL (60-90 dias) + telematics scale-up + admin capacity.",
        mitigation: "Contract admin 20% + KPIs assassinos (90% util + NPS 4.8+) + AI automation 70%",
        breakpoint: "Admin NPS <4.5 ou churn >10% = substituição imediata + automação reforçada",
      },
      regulatoryRisk: {
        rating: "BAIXO",
        detail:
          "FL: sem income tax (Tax Foundation 2026), rent tax repealed Jan 2024. Dealer license necessário >5 carros (HSMV). LLC Sunbiz = 1 dia + EIN = 1 dia. BTR Miami-Dade = 5 dias.",
        mitigation: "LLC D1 + EIN D1 + LBT D2 + BTR D3 + dealer license Mês 2 (quando escalar acima de 5)",
        breakpoint: "Operação >5 carros sem dealer license = infração HSMV FL $1K-10K multa",
      },
      competitionRisk: {
        rating: "ALTO",
        detail:
          "Hertz/Avis/Enterprise dominam aeroporto (>80% market). Off-airport: ~200+ independentes Miami. Turo crescendo mas fee 25-30%. Diferenciação: nicho PT + delivery + AI pricing = moat real.",
        mitigation:
          "5.000 parcerias Airbnb/hotels/cruise + delivery gratuito + WhatsApp 24/7 PT = CAC<$20",
        breakpoint: "CAC >$50 ou conversion <3% = revisar canal acquisition",
      },
    };

    return NextResponse.json({
      scenarioA: { ...scenarioA, scenarioA: null, scenarioB: null },
      scenarioB: { ...scenarioB, scenarioA: null, scenarioB: null },
      forensicAudit,
      comparison: {
        profitDelta: scenarioB.median - scenarioA.median,
        profitMultiple:
          scenarioA.median > 0
            ? Math.round((scenarioB.median / scenarioA.median) * 10) / 10
            : null,
        paybackDelta: scenarioA.paybackP50 - scenarioB.paybackP50,
        recommendation:
          scenarioB.successRate > 60 && scenarioB.bankruptcyRate < 15
            ? "EXECUTE_B"
            : scenarioB.bankruptcyRate > 20
            ? "EXECUTE_A"
            : "EXECUTE_B_WITH_GUARDRAILS",
        guardrails: [
          "1. Quotes GMI/Mesa/Blake/Univista hoje — target <$400/mês total 2 carros",
          "2. Comprar 2 RAV4 Hybrid cash apenas (<$32K cada, 2026 model year)",
          "3. Contrato admin 20% + bônus 90% util + trigger 21 dias",
          "4. 5.000 parcerias Airbnb script massivo — dia 3",
          "5. Telematics Spireon Day 1 + AI PriceLabs Day 3",
        ],
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
