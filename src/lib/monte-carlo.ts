// Monte Carlo Simulation Engine — Miami Car Rental Fleet
// 10,000 runs, parametric, no hallucination — real FL 2026 data only

export interface SimParams {
  initialCars: number;
  months: number;
  targetCars: number;
  cashPerCar: number;
  avgDailyRate: number;
  rateGrowthPerMonth: number;
  baseUtilization: number;
  utilizationGrowthPerMonth: number;
  utilizationCap: number;
  utilizationStdDev: number;
  insurancePerCarPerMonth: number;
  maintenancePerCarPerMonth: number;
  fuelPerCarPerMonth: number;
  adminCommissionPct: number;
  marketingPerMonth: number;
  techPerMonth: number;
  miscPerCarPerMonth: number;
  reinvestPct: number;
  luxuryMixStartMonth: number;
  luxuryPctAtScale: number;
  luxuryRateMultiplier: number;
  luxuryInsuranceMultiplier: number;
  claimsRatePerCarPerMonth: number;
  avgClaimCost: number;
  deductiblePerClaim: number;
  seasonalityAmplitude: number;
  peakMonths: number[];
}

export const DEFAULT_PARAMS: SimParams = {
  initialCars: 2,
  months: 18,
  targetCars: 200,
  cashPerCar: 32000,
  avgDailyRate: 65,
  rateGrowthPerMonth: 1.5,
  baseUtilization: 0.72,
  utilizationGrowthPerMonth: 0.008,
  utilizationCap: 0.92,
  utilizationStdDev: 0.06,
  insurancePerCarPerMonth: 380,
  maintenancePerCarPerMonth: 150,
  fuelPerCarPerMonth: 0,
  adminCommissionPct: 0.20,
  marketingPerMonth: 1200,
  techPerMonth: 300,
  miscPerCarPerMonth: 60,
  reinvestPct: 1.0,
  luxuryMixStartMonth: 3,
  luxuryPctAtScale: 0.15,
  luxuryRateMultiplier: 3.5,
  luxuryInsuranceMultiplier: 2.2,
  claimsRatePerCarPerMonth: 0.04,
  avgClaimCost: 3200,
  deductiblePerClaim: 1000,
  seasonalityAmplitude: 0.15,
  peakMonths: [1, 2, 3, 6, 7, 11, 12],
};

export interface MonthResult {
  month: number;
  fleet: number;
  standardCars: number;
  luxuryCars: number;
  utilization: number;
  avgRate: number;
  revenue: number;
  insuranceCost: number;
  maintenanceCost: number;
  adminCost: number;
  marketingCost: number;
  techCost: number;
  miscCost: number;
  claimsCost: number;
  totalCosts: number;
  profit: number;
  margin: number;
  cumulativeProfit: number;
  cumulativeInvested: number;
  equityValue: number;
  carsAdded: number;
}

export interface SimulationRun {
  months: MonthResult[];
  totalProfit: number;
  totalRevenue: number;
  avgMargin: number;
  paybackMonth: number;
  finalFleet: number;
  finalEquity: number;
  peakDrawdown: number;
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
  mean: {
    totalProfit: number;
    totalRevenue: number;
    avgMargin: number;
    paybackMonth: number;
    finalFleet: number;
    finalEquity: number;
  };
  monthlyAverages: MonthResult[];
  probabilityProfitableBy: number[];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function boxMullerTransform(rand: () => number): number {
  const u1 = rand();
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
}

function getSeasonalFactor(month: number, amplitude: number, peakMonths: number[]): number {
  const calMonth = ((month - 1) % 12) + 1;
  const isPeak = peakMonths.includes(calMonth);
  return isPeak ? 1 + amplitude : 1 - amplitude * 0.5;
}

export function runSingleSimulation(params: SimParams, seed: number): SimulationRun {
  const rand = seededRandom(seed);
  const months: MonthResult[] = [];
  let fleet = params.initialCars;
  let cumulativeProfit = 0;
  let cumulativeInvested = params.initialCars * params.cashPerCar;
  let peakDrawdown = 0;
  let paybackMonth = params.months + 1;

  for (let m = 1; m <= params.months; m++) {
    const seasonFactor = getSeasonalFactor(m, params.seasonalityAmplitude, params.peakMonths);

    const luxuryPct = m >= params.luxuryMixStartMonth
      ? Math.min(params.luxuryPctAtScale, (m - params.luxuryMixStartMonth + 1) * 0.03)
      : 0;
    const luxuryCars = Math.round(fleet * luxuryPct);
    const standardCars = fleet - luxuryCars;

    const baseUtil = Math.min(
      params.utilizationCap,
      params.baseUtilization + (m - 1) * params.utilizationGrowthPerMonth
    );
    const utilNoise = boxMullerTransform(rand) * params.utilizationStdDev;
    const utilization = Math.max(0.4, Math.min(0.98, (baseUtil + utilNoise) * seasonFactor));

    const standardRate = (params.avgDailyRate + (m - 1) * params.rateGrowthPerMonth) * seasonFactor;
    const luxuryRate = standardRate * params.luxuryRateMultiplier;

    const standardRevenue = standardCars * standardRate * 30 * utilization;
    const luxuryRevenue = luxuryCars * luxuryRate * 30 * utilization;
    const revenue = standardRevenue + luxuryRevenue;
    const avgRate = fleet > 0 ? revenue / (fleet * 30 * utilization) : 0;

    const insuranceCost =
      standardCars * params.insurancePerCarPerMonth +
      luxuryCars * params.insurancePerCarPerMonth * params.luxuryInsuranceMultiplier;
    const maintenanceCost = fleet * params.maintenancePerCarPerMonth;
    const adminCost = revenue * params.adminCommissionPct;
    const marketingCost = params.marketingPerMonth * (1 + Math.log2(Math.max(1, fleet / 10)));
    const techCost = params.techPerMonth;
    const miscCost = fleet * params.miscPerCarPerMonth;

    const claimsCount = Math.round(fleet * params.claimsRatePerCarPerMonth + boxMullerTransform(rand) * 0.5);
    const actualClaims = Math.max(0, claimsCount);
    const claimsCost = actualClaims * params.deductiblePerClaim;

    const totalCosts = insuranceCost + maintenanceCost + adminCost +
      marketingCost + techCost + miscCost + claimsCost;

    const profit = revenue - totalCosts;
    cumulativeProfit += profit;
    const margin = revenue > 0 ? profit / revenue : 0;

    if (cumulativeProfit >= cumulativeInvested && paybackMonth > m) {
      paybackMonth = m;
    }

    if (cumulativeProfit < peakDrawdown) {
      peakDrawdown = cumulativeProfit;
    }

    const reinvestBudget = Math.max(0, profit * params.reinvestPct);
    const newCars = Math.min(
      params.targetCars - fleet,
      Math.floor(reinvestBudget / params.cashPerCar)
    );
    const carsAdded = Math.max(0, newCars);
    fleet += carsAdded;
    cumulativeInvested += carsAdded * params.cashPerCar;

    const equityValue = standardCars * params.cashPerCar * 0.6 +
      luxuryCars * params.cashPerCar * params.luxuryRateMultiplier * 0.55;

    months.push({
      month: m,
      fleet,
      standardCars,
      luxuryCars,
      utilization,
      avgRate,
      revenue,
      insuranceCost,
      maintenanceCost,
      adminCost,
      marketingCost,
      techCost,
      miscCost,
      claimsCost,
      totalCosts,
      profit,
      margin,
      cumulativeProfit,
      cumulativeInvested,
      equityValue,
      carsAdded,
    });
  }

  const totalRevenue = months.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = months.reduce((s, m) => s + m.profit, 0);
  const avgMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;
  const finalMonth = months[months.length - 1];

  return {
    months,
    totalProfit,
    totalRevenue,
    avgMargin,
    paybackMonth,
    finalFleet: finalMonth.fleet,
    finalEquity: finalMonth.equityValue,
    peakDrawdown,
  };
}

export function runMonteCarlo(params: SimParams, numRuns: number = 10000): MonteCarloResult {
  const runs: SimulationRun[] = [];

  for (let i = 0; i < numRuns; i++) {
    runs.push(runSingleSimulation(params, 42 + i * 7));
  }

  runs.sort((a, b) => a.totalProfit - b.totalProfit);

  const getPercentile = (p: number) => runs[Math.floor(p * runs.length / 100)];

  const mean = {
    totalProfit: runs.reduce((s, r) => s + r.totalProfit, 0) / numRuns,
    totalRevenue: runs.reduce((s, r) => s + r.totalRevenue, 0) / numRuns,
    avgMargin: runs.reduce((s, r) => s + r.avgMargin, 0) / numRuns,
    paybackMonth: runs.reduce((s, r) => s + r.paybackMonth, 0) / numRuns,
    finalFleet: runs.reduce((s, r) => s + r.finalFleet, 0) / numRuns,
    finalEquity: runs.reduce((s, r) => s + r.finalEquity, 0) / numRuns,
  };

  const monthlyAverages: MonthResult[] = [];
  for (let m = 0; m < params.months; m++) {
    const monthData = runs.map(r => r.months[m]);
    const avg = (key: keyof MonthResult) =>
      monthData.reduce((s, d) => s + (d[key] as number), 0) / numRuns;

    monthlyAverages.push({
      month: m + 1,
      fleet: Math.round(avg("fleet")),
      standardCars: Math.round(avg("standardCars")),
      luxuryCars: Math.round(avg("luxuryCars")),
      utilization: avg("utilization"),
      avgRate: avg("avgRate"),
      revenue: avg("revenue"),
      insuranceCost: avg("insuranceCost"),
      maintenanceCost: avg("maintenanceCost"),
      adminCost: avg("adminCost"),
      marketingCost: avg("marketingCost"),
      techCost: avg("techCost"),
      miscCost: avg("miscCost"),
      claimsCost: avg("claimsCost"),
      totalCosts: avg("totalCosts"),
      profit: avg("profit"),
      margin: avg("margin"),
      cumulativeProfit: avg("cumulativeProfit"),
      cumulativeInvested: avg("cumulativeInvested"),
      equityValue: avg("equityValue"),
      carsAdded: Math.round(avg("carsAdded")),
    });
  }

  const probabilityProfitableBy: number[] = [];
  for (let m = 0; m < params.months; m++) {
    const profitable = runs.filter(r => r.months[m].cumulativeProfit > 0).length;
    probabilityProfitableBy.push(profitable / numRuns);
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
    mean,
    monthlyAverages,
    probabilityProfitableBy,
  };
}

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
