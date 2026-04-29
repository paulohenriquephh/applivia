// Miami Car Rental Business Simulation Engine
// Monte Carlo + Deterministic Fleet Growth Model

export interface MonthlyResult {
  month: number;
  fleet: number;
  utilization: number;
  avgDailyRate: number;
  grossRevenue: number;
  insuranceCost: number;
  maintenanceCost: number;
  adminCost: number;
  marketingCost: number;
  fuelMiscCost: number;
  totalCosts: number;
  netProfit: number;
  cumulativeProfit: number;
  cumulativeInvested: number;
  equity: number;
  marginPct: number;
  paybackReached: boolean;
}

export interface SimulationParams {
  initialCars: number;
  targetCars: number;
  months: number;
  cashPerCar: number;
  baseUtilization: number;
  utilizationGrowthPerMonth: number;
  maxUtilization: number;
  baseDailyRate: number;
  rateGrowthPerMonth: number;
  insurancePerCarPerMonth: number;
  maintenancePerCarPerMonth: number;
  adminPct: number;
  marketingPerMonth: number;
  fuelMiscPerCarPerMonth: number;
  reinvestPct: number;
  resaleValuePct: number;
  luxuryMixStartMonth: number;
  luxuryPremiumMultiplier: number;
  luxuryPctOfFleet: number;
  seasonalityFactors: number[];
}

export const SCENARIO_A: SimulationParams = {
  initialCars: 2,
  targetCars: 10,
  months: 18,
  cashPerCar: 32000,
  baseUtilization: 0.70,
  utilizationGrowthPerMonth: 0.005,
  maxUtilization: 0.82,
  baseDailyRate: 55,
  rateGrowthPerMonth: 0.5,
  insurancePerCarPerMonth: 350,
  maintenancePerCarPerMonth: 180,
  adminPct: 0.30,
  marketingPerMonth: 300,
  fuelMiscPerCarPerMonth: 60,
  reinvestPct: 0.50,
  resaleValuePct: 0.65,
  luxuryMixStartMonth: 999,
  luxuryPremiumMultiplier: 1.0,
  luxuryPctOfFleet: 0,
  seasonalityFactors: [1.15, 1.10, 1.20, 1.05, 0.85, 0.80, 0.75, 0.78, 0.82, 0.90, 1.00, 1.25],
};

export const SCENARIO_B: SimulationParams = {
  initialCars: 2,
  targetCars: 200,
  months: 18,
  cashPerCar: 32000,
  baseUtilization: 0.75,
  utilizationGrowthPerMonth: 0.008,
  maxUtilization: 0.92,
  baseDailyRate: 65,
  rateGrowthPerMonth: 1.5,
  insurancePerCarPerMonth: 380,
  maintenancePerCarPerMonth: 200,
  adminPct: 0.20,
  marketingPerMonth: 2000,
  fuelMiscPerCarPerMonth: 70,
  reinvestPct: 1.00,
  resaleValuePct: 0.60,
  luxuryMixStartMonth: 3,
  luxuryPremiumMultiplier: 2.8,
  luxuryPctOfFleet: 0.15,
  seasonalityFactors: [1.15, 1.10, 1.20, 1.05, 0.85, 0.80, 0.75, 0.78, 0.82, 0.90, 1.00, 1.25],
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function runDeterministicSimulation(params: SimulationParams): MonthlyResult[] {
  const results: MonthlyResult[] = [];
  let fleet = params.initialCars;
  let cumulativeProfit = 0;
  let cumulativeInvested = fleet * params.cashPerCar;
  let paybackReached = false;

  for (let m = 1; m <= params.months; m++) {
    const seasonIdx = (m - 1) % 12;
    const seasonFactor = params.seasonalityFactors[seasonIdx];

    const baseUtil = clamp(
      params.baseUtilization + (m - 1) * params.utilizationGrowthPerMonth,
      0.5,
      params.maxUtilization
    );
    const utilization = clamp(baseUtil * seasonFactor, 0.4, 0.98);

    let avgRate = params.baseDailyRate + (m - 1) * params.rateGrowthPerMonth;
    avgRate *= seasonFactor;

    const hasLuxury = m >= params.luxuryMixStartMonth;
    const luxuryFraction = hasLuxury ? Math.min(params.luxuryPctOfFleet, (m - params.luxuryMixStartMonth + 1) * 0.03) : 0;
    const effectiveRate = avgRate * (1 - luxuryFraction) + avgRate * params.luxuryPremiumMultiplier * luxuryFraction;

    const days = 30;
    const grossRevenue = fleet * effectiveRate * days * utilization;

    const insuranceCost = fleet * params.insurancePerCarPerMonth;
    const maintenanceCost = fleet * params.maintenancePerCarPerMonth;
    const adminCost = grossRevenue * params.adminPct;
    const marketingCost = params.marketingPerMonth + fleet * 30;
    const fuelMiscCost = fleet * params.fuelMiscPerCarPerMonth;

    const totalCosts = insuranceCost + maintenanceCost + adminCost + marketingCost + fuelMiscCost;
    const netProfit = grossRevenue - totalCosts;
    cumulativeProfit += netProfit;

    if (cumulativeProfit >= cumulativeInvested && !paybackReached) {
      paybackReached = true;
    }

    const equity = fleet * params.cashPerCar * params.resaleValuePct;
    const marginPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    const newCars = params.reinvestPct > 0 && netProfit > 0
      ? Math.min(
          Math.floor((netProfit * params.reinvestPct) / params.cashPerCar),
          params.targetCars - fleet
        )
      : 0;

    results.push({
      month: m,
      fleet,
      utilization: Math.round(utilization * 1000) / 10,
      avgDailyRate: Math.round(effectiveRate * 100) / 100,
      grossRevenue: Math.round(grossRevenue),
      insuranceCost: Math.round(insuranceCost),
      maintenanceCost: Math.round(maintenanceCost),
      adminCost: Math.round(adminCost),
      marketingCost: Math.round(marketingCost),
      fuelMiscCost: Math.round(fuelMiscCost),
      totalCosts: Math.round(totalCosts),
      netProfit: Math.round(netProfit),
      cumulativeProfit: Math.round(cumulativeProfit),
      cumulativeInvested: Math.round(cumulativeInvested),
      equity: Math.round(equity),
      marginPct: Math.round(marginPct * 10) / 10,
      paybackReached,
    });

    if (newCars > 0) {
      fleet += newCars;
      cumulativeInvested += newCars * params.cashPerCar;
    }
  }

  return results;
}

export interface MonteCarloSummary {
  percentile5: MonthlyResult[];
  percentile50: MonthlyResult[];
  percentile95: MonthlyResult[];
  avgPaybackMonth: number;
  avgTotalProfit18: number;
  avgFinalFleet: number;
  avgFinalEquity: number;
  profitDistribution: number[];
  failureRate: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function normalFromUniform(rand: () => number): number {
  const u1 = rand();
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
}

export function runMonteCarlo(params: SimulationParams, runs: number = 10000): MonteCarloSummary {
  const allRuns: MonthlyResult[][] = [];
  const totalProfits: number[] = [];
  const paybackMonths: number[] = [];
  let failures = 0;

  for (let r = 0; r < runs; r++) {
    const rand = seededRandom(r * 7919 + 42);
    const results: MonthlyResult[] = [];
    let fleet = params.initialCars;
    let cumulativeProfit = 0;
    let cumulativeInvested = fleet * params.cashPerCar;
    let paybackReached = false;
    let paybackMonth = params.months + 1;

    for (let m = 1; m <= params.months; m++) {
      const seasonIdx = (m - 1) % 12;
      const seasonFactor = params.seasonalityFactors[seasonIdx];

      const utilNoise = normalFromUniform(rand) * 0.06;
      const rateNoise = normalFromUniform(rand) * 8;
      const claimNoise = rand() < 0.04 ? (rand() * 3000 + 500) * fleet * 0.3 : 0;

      const baseUtil = clamp(
        params.baseUtilization + (m - 1) * params.utilizationGrowthPerMonth + utilNoise,
        0.4,
        params.maxUtilization
      );
      const utilization = clamp(baseUtil * seasonFactor, 0.3, 0.98);

      let avgRate = params.baseDailyRate + (m - 1) * params.rateGrowthPerMonth + rateNoise;
      avgRate = Math.max(avgRate, 35);
      avgRate *= seasonFactor;

      const hasLuxury = m >= params.luxuryMixStartMonth;
      const luxuryFraction = hasLuxury
        ? Math.min(params.luxuryPctOfFleet, (m - params.luxuryMixStartMonth + 1) * 0.03)
        : 0;
      const effectiveRate = avgRate * (1 - luxuryFraction) + avgRate * params.luxuryPremiumMultiplier * luxuryFraction;

      const days = 30;
      const grossRevenue = fleet * effectiveRate * days * utilization;

      const insuranceCost = fleet * params.insurancePerCarPerMonth * (1 + normalFromUniform(rand) * 0.05);
      const maintenanceCost = fleet * params.maintenancePerCarPerMonth * (1 + normalFromUniform(rand) * 0.15);
      const adminCost = grossRevenue * params.adminPct;
      const marketingCost = params.marketingPerMonth + fleet * 30;
      const fuelMiscCost = fleet * params.fuelMiscPerCarPerMonth;

      const totalCosts = Math.max(0, insuranceCost + maintenanceCost + adminCost + marketingCost + fuelMiscCost + claimNoise);
      const netProfit = grossRevenue - totalCosts;
      cumulativeProfit += netProfit;

      if (cumulativeProfit >= cumulativeInvested && !paybackReached) {
        paybackReached = true;
        paybackMonth = m;
      }

      const equity = fleet * params.cashPerCar * params.resaleValuePct;
      const marginPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

      results.push({
        month: m,
        fleet,
        utilization: Math.round(utilization * 1000) / 10,
        avgDailyRate: Math.round(effectiveRate * 100) / 100,
        grossRevenue: Math.round(grossRevenue),
        insuranceCost: Math.round(insuranceCost),
        maintenanceCost: Math.round(maintenanceCost),
        adminCost: Math.round(adminCost),
        marketingCost: Math.round(marketingCost),
        fuelMiscCost: Math.round(fuelMiscCost),
        totalCosts: Math.round(totalCosts),
        netProfit: Math.round(netProfit),
        cumulativeProfit: Math.round(cumulativeProfit),
        cumulativeInvested: Math.round(cumulativeInvested),
        equity: Math.round(equity),
        marginPct: Math.round(marginPct * 10) / 10,
        paybackReached,
      });

      const newCars = params.reinvestPct > 0 && netProfit > 0
        ? Math.min(
            Math.floor((netProfit * params.reinvestPct) / params.cashPerCar),
            params.targetCars - fleet
          )
        : 0;

      if (newCars > 0) {
        fleet += newCars;
        cumulativeInvested += newCars * params.cashPerCar;
      }
    }

    allRuns.push(results);
    totalProfits.push(cumulativeProfit);
    paybackMonths.push(paybackMonth);
    if (cumulativeProfit < 0) failures++;
  }

  totalProfits.sort((a, b) => a - b);
  const p5Idx = Math.floor(runs * 0.05);
  const p50Idx = Math.floor(runs * 0.5);
  const p95Idx = Math.floor(runs * 0.95);

  const sortedByProfit = allRuns
    .map((r, i) => ({ results: r, profit: totalProfits[i] }))
    .sort((a, b) => a.profit - b.profit);

  const avgPayback = paybackMonths.reduce((a, b) => a + b, 0) / runs;
  const avgProfit = totalProfits.reduce((a, b) => a + b, 0) / runs;
  const avgFleet = allRuns.reduce((a, r) => a + r[r.length - 1].fleet, 0) / runs;
  const avgEquity = allRuns.reduce((a, r) => a + r[r.length - 1].equity, 0) / runs;

  return {
    percentile5: sortedByProfit[p5Idx].results,
    percentile50: sortedByProfit[p50Idx].results,
    percentile95: sortedByProfit[p95Idx].results,
    avgPaybackMonth: Math.round(avgPayback * 10) / 10,
    avgTotalProfit18: Math.round(avgProfit),
    avgFinalFleet: Math.round(avgFleet),
    avgFinalEquity: Math.round(avgEquity),
    profitDistribution: totalProfits,
    failureRate: Math.round((failures / runs) * 10000) / 100,
  };
}
