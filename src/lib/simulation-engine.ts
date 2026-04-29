/**
 * Monte Carlo Simulation Engine — Locadora Miami 2026
 * 
 * Parâmetros baseados em dados reais:
 * - Mordor Intelligence FL car rental market $7.2B 2026
 * - Natalya Zorina case study: 1→100 carros, $250K/mês
 * - Rentscout off-airport utilization benchmarks 70-85%
 * - FL tax: 0% state income tax, rent tax repealed
 * - Insurance specialty brokers (GMI/Mesa/Blake): $300-500/mês/veículo
 * - RAV4 Hybrid 2024-2025 MSRP: $30,000-$33,000 cash
 * - Luxury/exotic daily rates $500-$2,000+ (Art Basel, Miami GP peaks)
 */

export interface SimulationParams {
  initialCars: number;
  months: number;
  targetCars: number;
  scenarioName: string;
  dailyRateBase: number;
  dailyRateGrowth: number;
  utilFloor: number;
  utilCeiling: number;
  utilGrowthPerMonth: number;
  insurancePerCar: number;
  insuranceBaseFixed: number;
  adminCutPct: number;
  maintenancePerCar: number;
  marketingPerCar: number;
  carCostCash: number;
  luxuryCarsStartMonth: number;
  luxuryCarCount: number;
  luxuryDailyRate: number;
  luxuryCarCost: number;
  luxuryInsurance: number;
  partnershipCommissionPct: number;
  partnershipBookingsPct: number;
  reinvestPct: number;
  aiPricingUplift: number;
  telematicsCostPerCar: number;
  seasonalityAmplitude: number;
  claimsRatePerCarPerMonth: number;
  avgClaimCost: number;
  deductible: number;
  paybackTargetMonths: number;
}

export interface MonthResult {
  month: number;
  fleet: number;
  luxuryFleet: number;
  totalFleet: number;
  utilization: number;
  dailyRate: number;
  revenue: number;
  costs: number;
  profit: number;
  cumulativeProfit: number;
  cumulativeInvestment: number;
  equity: number;
  margin: number;
  roi: number;
  paybackReached: boolean;
  claimsCost: number;
  insuranceCost: number;
  adminCost: number;
  marketingCost: number;
  maintenanceCost: number;
  partnershipRevenue: number;
  luxuryRevenue: number;
  standardRevenue: number;
}

export interface SimulationRun {
  params: SimulationParams;
  months: MonthResult[];
  totalRevenue: number;
  totalProfit: number;
  totalEquity: number;
  paybackMonth: number | null;
  finalMargin: number;
  finalROI: number;
  maxDrawdown: number;
}

export interface MonteCarloResult {
  runs: SimulationRun[];
  percentiles: {
    p5: SimulationRun;
    p25: SimulationRun;
    p50: SimulationRun;
    p75: SimulationRun;
    p95: SimulationRun;
  };
  stats: {
    meanProfit: number;
    stdProfit: number;
    meanPayback: number;
    meanEquity: number;
    meanMargin: number;
    profitableRunsPct: number;
    paybackWithin6MonthsPct: number;
    meanROI: number;
  };
  monthlyAverages: MonthResult[];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function boxMullerRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
}

function seasonalMultiplier(month: number, amplitude: number): number {
  const monthOfYear = ((month - 1) % 12) + 1;
  const peakMonths = [1, 2, 3, 11, 12]; // winter season + Art Basel (Dec)
  const offPeak = [5, 6, 9, 10];
  if (peakMonths.includes(monthOfYear)) return 1 + amplitude;
  if (offPeak.includes(monthOfYear)) return 1 - amplitude * 0.5;
  return 1;
}

export function runSingleSimulation(
  params: SimulationParams,
  seed: number
): SimulationRun {
  const rng = seededRandom(seed);
  const months: MonthResult[] = [];
  let cars = params.initialCars;
  let luxuryCars = 0;
  let cumulativeProfit = 0;
  const initialInvestment = params.initialCars * params.carCostCash;
  let cumulativeInvestment = initialInvestment;
  let paybackMonth: number | null = null;
  let maxDrawdown = 0;
  let peakProfit = 0;

  for (let m = 1; m <= params.months; m++) {
    const utilNoise = boxMullerRandom(rng) * 0.06;
    const rawUtil = params.utilFloor + (m - 1) * params.utilGrowthPerMonth + utilNoise;
    const seasonal = seasonalMultiplier(m, params.seasonalityAmplitude);
    const util = Math.max(0.4, Math.min(params.utilCeiling, rawUtil * seasonal));

    const priceNoise = boxMullerRandom(rng) * 5;
    const aiUplift = 1 + params.aiPricingUplift;
    const dailyRate = (params.dailyRateBase + (m - 1) * params.dailyRateGrowth + priceNoise) * aiUplift * seasonal;

    if (m >= params.luxuryCarsStartMonth && luxuryCars < params.luxuryCarCount) {
      const toAdd = Math.min(
        Math.max(1, Math.floor((m - params.luxuryCarsStartMonth + 1) / 2)),
        params.luxuryCarCount - luxuryCars
      );
      luxuryCars += toAdd;
      cumulativeInvestment += toAdd * params.luxuryCarCost;
    }

    const standardDays = cars * 30 * util;
    const luxuryDays = luxuryCars * 30 * Math.min(util + 0.05, 0.95);
    const standardRev = standardDays * dailyRate;
    const luxuryRev = luxuryDays * params.luxuryDailyRate * seasonal;
    const directRevenue = standardRev + luxuryRev;

    const partnershipRev = directRevenue * params.partnershipBookingsPct * params.partnershipCommissionPct;
    const totalRevenue = directRevenue + partnershipRev;

    const totalFleet = cars + luxuryCars;
    const insuranceCost = params.insuranceBaseFixed + totalFleet * params.insurancePerCar +
      luxuryCars * (params.luxuryInsurance - params.insurancePerCar);
    const adminCost = totalRevenue * params.adminCutPct;
    const maintenanceCost = totalFleet * params.maintenancePerCar;
    const marketingCost = totalFleet * params.marketingPerCar;
    const telematicsCost = totalFleet * params.telematicsCostPerCar;

    const claimsNoise = Math.max(0, boxMullerRandom(rng));
    const claimsCount = Math.floor(totalFleet * params.claimsRatePerCarPerMonth * (1 + claimsNoise * 0.3));
    const claimsCost = claimsCount * Math.max(0, params.avgClaimCost - params.deductible);

    const totalCosts = insuranceCost + adminCost + maintenanceCost + marketingCost + telematicsCost + claimsCost;
    const profit = totalRevenue - totalCosts;
    cumulativeProfit += profit;

    if (cumulativeProfit > peakProfit) peakProfit = cumulativeProfit;
    const drawdown = peakProfit > 0 ? (peakProfit - cumulativeProfit) / peakProfit : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    if (paybackMonth === null && cumulativeProfit >= initialInvestment) {
      paybackMonth = m;
    }

    const depreciationRate = 0.85;
    const standardEquity = cars * params.carCostCash * Math.pow(depreciationRate, m / 12);
    const luxuryEquity = luxuryCars * params.luxuryCarCost * Math.pow(0.80, m / 12);
    const equity = standardEquity + luxuryEquity;

    const margin = totalRevenue > 0 ? profit / totalRevenue : 0;
    const roi = cumulativeInvestment > 0 ? cumulativeProfit / cumulativeInvestment : 0;

    months.push({
      month: m,
      fleet: cars,
      luxuryFleet: luxuryCars,
      totalFleet,
      utilization: util,
      dailyRate,
      revenue: totalRevenue,
      costs: totalCosts,
      profit,
      cumulativeProfit,
      cumulativeInvestment,
      equity,
      margin,
      roi,
      paybackReached: paybackMonth !== null && m >= paybackMonth,
      claimsCost,
      insuranceCost,
      adminCost,
      marketingCost,
      maintenanceCost,
      partnershipRevenue: partnershipRev,
      luxuryRevenue: luxuryRev,
      standardRevenue: standardRev,
    });

    if (params.reinvestPct > 0 && profit > 0) {
      const reinvestBudget = profit * params.reinvestPct;
      const newCars = Math.floor(reinvestBudget / params.carCostCash);
      if (newCars > 0 && cars + luxuryCars + newCars <= params.targetCars) {
        cars += newCars;
        cumulativeInvestment += newCars * params.carCostCash;
      }
    }
  }

  const last = months[months.length - 1];
  return {
    params,
    months,
    totalRevenue: months.reduce((s, m) => s + m.revenue, 0),
    totalProfit: months.reduce((s, m) => s + m.profit, 0),
    totalEquity: last.equity,
    paybackMonth,
    finalMargin: last.margin,
    finalROI: last.roi,
    maxDrawdown,
  };
}

export function runMonteCarlo(
  params: SimulationParams,
  numRuns: number = 1000
): MonteCarloResult {
  const runs: SimulationRun[] = [];
  for (let i = 0; i < numRuns; i++) {
    runs.push(runSingleSimulation(params, 42 + i * 7919));
  }

  runs.sort((a, b) => a.totalProfit - b.totalProfit);

  const getPercentile = (p: number) => runs[Math.floor(runs.length * p / 100)];

  const profits = runs.map(r => r.totalProfit);
  const meanProfit = profits.reduce((a, b) => a + b, 0) / profits.length;
  const stdProfit = Math.sqrt(
    profits.reduce((s, p) => s + (p - meanProfit) ** 2, 0) / profits.length
  );

  const paybackMonths = runs.filter(r => r.paybackMonth !== null).map(r => r.paybackMonth!);
  const meanPayback = paybackMonths.length > 0
    ? paybackMonths.reduce((a, b) => a + b, 0) / paybackMonths.length
    : Infinity;

  const monthlyAverages: MonthResult[] = [];
  const numMonths = params.months;
  for (let m = 0; m < numMonths; m++) {
    const monthData = runs.map(r => r.months[m]);
    const avg = (fn: (d: MonthResult) => number) =>
      monthData.reduce((s, d) => s + fn(d), 0) / monthData.length;

    monthlyAverages.push({
      month: m + 1,
      fleet: Math.round(avg(d => d.fleet)),
      luxuryFleet: Math.round(avg(d => d.luxuryFleet)),
      totalFleet: Math.round(avg(d => d.totalFleet)),
      utilization: avg(d => d.utilization),
      dailyRate: avg(d => d.dailyRate),
      revenue: avg(d => d.revenue),
      costs: avg(d => d.costs),
      profit: avg(d => d.profit),
      cumulativeProfit: avg(d => d.cumulativeProfit),
      cumulativeInvestment: avg(d => d.cumulativeInvestment),
      equity: avg(d => d.equity),
      margin: avg(d => d.margin),
      roi: avg(d => d.roi),
      paybackReached: avg(d => d.paybackReached ? 1 : 0) > 0.5,
      claimsCost: avg(d => d.claimsCost),
      insuranceCost: avg(d => d.insuranceCost),
      adminCost: avg(d => d.adminCost),
      marketingCost: avg(d => d.marketingCost),
      maintenanceCost: avg(d => d.maintenanceCost),
      partnershipRevenue: avg(d => d.partnershipRevenue),
      luxuryRevenue: avg(d => d.luxuryRevenue),
      standardRevenue: avg(d => d.standardRevenue),
    });
  }

  return {
    runs,
    percentiles: {
      p5: getPercentile(5),
      p25: getPercentile(25),
      p50: getPercentile(50),
      p75: getPercentile(75),
      p95: getPercentile(95),
    },
    stats: {
      meanProfit,
      stdProfit,
      meanPayback,
      meanEquity: runs.reduce((s, r) => s + r.totalEquity, 0) / runs.length,
      meanMargin: runs.reduce((s, r) => s + r.finalMargin, 0) / runs.length,
      profitableRunsPct: runs.filter(r => r.totalProfit > 0).length / runs.length * 100,
      paybackWithin6MonthsPct: runs.filter(r => r.paybackMonth !== null && r.paybackMonth <= 6).length / runs.length * 100,
      meanROI: runs.reduce((s, r) => s + r.finalROI, 0) / runs.length,
    },
    monthlyAverages,
  };
}

export const SCENARIO_A: SimulationParams = {
  scenarioName: "A — Conservador (2 carros steady)",
  initialCars: 2,
  months: 18,
  targetCars: 8,
  dailyRateBase: 55,
  dailyRateGrowth: 1,
  utilFloor: 0.65,
  utilCeiling: 0.82,
  utilGrowthPerMonth: 0.008,
  insurancePerCar: 350,
  insuranceBaseFixed: 100,
  adminCutPct: 0.30,
  maintenancePerCar: 120,
  marketingPerCar: 30,
  carCostCash: 31000,
  luxuryCarsStartMonth: 99,
  luxuryCarCount: 0,
  luxuryDailyRate: 0,
  luxuryCarCost: 0,
  luxuryInsurance: 0,
  partnershipCommissionPct: 0,
  partnershipBookingsPct: 0,
  reinvestPct: 0.5,
  aiPricingUplift: 0,
  telematicsCostPerCar: 0,
  seasonalityAmplitude: 0.10,
  claimsRatePerCarPerMonth: 0.03,
  avgClaimCost: 3000,
  deductible: 1000,
  paybackTargetMonths: 24,
};

export const SCENARIO_B: SimulationParams = {
  scenarioName: "B — Nuclear Natalya 2.0",
  initialCars: 2,
  months: 18,
  targetCars: 200,
  dailyRateBase: 65,
  dailyRateGrowth: 2,
  utilFloor: 0.75,
  utilCeiling: 0.92,
  utilGrowthPerMonth: 0.01,
  insurancePerCar: 380,
  insuranceBaseFixed: 100,
  adminCutPct: 0.20,
  maintenancePerCar: 150,
  marketingPerCar: 50,
  carCostCash: 31000,
  luxuryCarsStartMonth: 3,
  luxuryCarCount: 20,
  luxuryDailyRate: 450,
  luxuryCarCost: 85000,
  luxuryInsurance: 650,
  partnershipCommissionPct: 0.08,
  partnershipBookingsPct: 0.35,
  reinvestPct: 1.0,
  aiPricingUplift: 0.12,
  telematicsCostPerCar: 25,
  seasonalityAmplitude: 0.18,
  claimsRatePerCarPerMonth: 0.05,
  avgClaimCost: 4500,
  deductible: 1500,
  paybackTargetMonths: 8,
};

export const SCENARIO_STRESS: SimulationParams = {
  ...SCENARIO_B,
  scenarioName: "STRESS — Pior cenário controlado",
  utilFloor: 0.55,
  utilCeiling: 0.72,
  utilGrowthPerMonth: 0.005,
  dailyRateBase: 50,
  dailyRateGrowth: 1,
  insurancePerCar: 550,
  claimsRatePerCarPerMonth: 0.08,
  avgClaimCost: 6000,
  partnershipBookingsPct: 0.15,
  reinvestPct: 0.6,
  aiPricingUplift: 0.05,
  targetCars: 50,
};
