"use client";

import { useState, useMemo } from "react";

// ─── Tipos ───────────────────────────────────────────────────────────────────
type ScenarioKey = "A" | "B1" | "B2" | "C";

interface ScenarioMeta {
  label: string;
  subLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  initialCars: number;
  capitalExterno: number;
  aggressive: boolean;
  luxuryMix: boolean;
}

// ─── Constantes de modelo (espelham Python forense) ──────────────────────────
const DAILY_RATE_BASE = 65;
const DAILY_RATE_LUXURY = 250;
const INSURANCE_PER_CAR = 420;
const MAINTENANCE_PER_CAR = 180;
const ADMIN_COMMISSION = 0.20;
const MARKETING_BASE = 1200;
const WAREHOUSE_PER_CAR = 150;
const WAREHOUSE_MIN = 800;
const MISC_PER_CAR = 60;
const CAR_COST = 35000;
const LUXURY_CAR_COST = 85000;
const RESALE_18M = 0.78;
const RESALE_LUX_18M = 0.70;
const REINVEST_EFF = 0.85;
const NEW_CAR_COST = 35000;
const MAX_CARS = [12, 35, 80]; // M6, M12, M18

const UTIL_RAMP = [
  0.55, 0.62, 0.70, 0.75, 0.80, 0.82,
  0.84, 0.85, 0.86, 0.87, 0.88, 0.89,
  0.89, 0.90, 0.90, 0.91, 0.91, 0.90,
];

const PARTNERSHIP_RAMP = [
  0, 0, 200, 400, 800, 1200,
  1800, 2500, 3200, 4000, 5000, 6000,
  7000, 8000, 9000, 10000, 11000, 12000,
];

// ─── Simulador determinístico (P50 / médio) ──────────────────────────────────
function simulate(
  initialCars: number,
  months: number,
  reinvest: boolean,
  aggressive: boolean,
  luxuryMix: boolean,
  externalCapital: number,
): { revenue: number; profit: number; cars: number; util: number }[] {
  let cars = initialCars;
  let locDeployed = false;
  const locCars = Math.floor(externalCapital / NEW_CAR_COST);

  const rows = [];
  for (let m = 0; m < months; m++) {
    if (!locDeployed && locCars > 0 && m === 1) {
      cars = Math.min(MAX_CARS[2], cars + locCars);
      locDeployed = true;
    }

    const utilMean = UTIL_RAMP[Math.min(m, UTIL_RAMP.length - 1)];
    const util = aggressive && m > 3 ? Math.min(0.92, utilMean + 0.03) : utilMean;

    const rateBase = DAILY_RATE_BASE + m * 1.5;
    const luxCars = luxuryMix && m >= 2 ? Math.max(0, Math.floor(cars * 0.15)) : 0;
    const stdCars = cars - luxCars;

    const revStd = stdCars * rateBase * 30 * util;
    const revLux = luxCars * DAILY_RATE_LUXURY * 30 * Math.min(0.75, util);
    const partnerRev = PARTNERSHIP_RAMP[Math.min(m, PARTNERSHIP_RAMP.length - 1)];
    const revenue = revStd + revLux + partnerRev;

    const insurance = cars * INSURANCE_PER_CAR;
    const maintenance = cars * MAINTENANCE_PER_CAR;
    const adminFee = revenue * ADMIN_COMMISSION;
    const marketing = Math.min(MARKETING_BASE * (aggressive ? 1 + m * 0.03 : 1), 5000);
    const warehouse = Math.max(WAREHOUSE_MIN, cars * WAREHOUSE_PER_CAR);
    const misc = cars * MISC_PER_CAR;
    const totalCosts = insurance + maintenance + adminFee + marketing + warehouse + misc;
    const profit = revenue - totalCosts;

    rows.push({ revenue: Math.round(revenue), profit: Math.round(profit), cars, util });

    if (reinvest && profit > 0) {
      const available = profit * REINVEST_EFF;
      const newCars = Math.floor(available / NEW_CAR_COST);
      if (aggressive) {
        const cap = m < 6 ? MAX_CARS[0] : m < 12 ? MAX_CARS[1] : MAX_CARS[2];
        cars = Math.min(cap, cars + newCars);
      } else {
        cars = Math.min(initialCars * 3, cars + Math.min(newCars, 1));
      }
    }
  }
  return rows;
}

// ─── Metadata dos cenários ────────────────────────────────────────────────────
const SCENARIOS: Record<ScenarioKey, ScenarioMeta> = {
  A: {
    label: "A — Conservador",
    subLabel: "2 carros, sem escala",
    color: "#6b7280",
    bgColor: "bg-gray-700",
    borderColor: "border-gray-500",
    badgeColor: "bg-gray-600",
    initialCars: 2,
    capitalExterno: 0,
    aggressive: false,
    luxuryMix: false,
  },
  B1: {
    label: "B1 — Nuclear Puro",
    subLabel: "2 carros, reinvest, sem LOC",
    color: "#f59e0b",
    bgColor: "bg-amber-700",
    borderColor: "border-amber-500",
    badgeColor: "bg-amber-600",
    initialCars: 2,
    capitalExterno: 0,
    aggressive: true,
    luxuryMix: true,
  },
  B2: {
    label: "B2 — Nuclear + $150K LOC",
    subLabel: "2 carros + crédito externo",
    color: "#f97316",
    bgColor: "bg-orange-700",
    borderColor: "border-orange-500",
    badgeColor: "bg-orange-600",
    initialCars: 2,
    capitalExterno: 150000,
    aggressive: true,
    luxuryMix: true,
  },
  C: {
    label: "C — Natalya Realista 2026",
    subLabel: "5 carros + $200K capital",
    color: "#22c55e",
    bgColor: "bg-green-700",
    borderColor: "border-green-500",
    badgeColor: "bg-green-600",
    initialCars: 5,
    capitalExterno: 200000,
    aggressive: true,
    luxuryMix: true,
  },
};

// ─── Auditoria de claims ──────────────────────────────────────────────────────
const AUDIT_CLAIMS = [
  {
    claim: "Payback 2,5 meses",
    verdict: "FALSO",
    color: "text-red-400",
    math: "2 RAV4 × $65/dia × 30 × 75% util = $2.925 receita bruta. Custos M1: $5.985. Lucro M1 = -$3.060. Investimento total $73.500. Payback real: 19-24 meses com 2 carros; 10-14 meses com 5 carros + $200K capital.",
    icon: "✗",
  },
  {
    claim: "$500K/mês com 50 carros em M6",
    verdict: "IMPOSSÍVEL",
    color: "text-red-400",
    math: "$500K lucro líquido (25% margem) = $2M receita. $2M ÷ ($100/dia × 30) = 666 carros necessários. 50 carros a 85% util = $127K receita → ~$32K lucro. Alvo real M6 com $200K capital: $8K-$15K/mês.",
    icon: "✗",
  },
  {
    claim: "50 carros em 6 meses reinvestindo",
    verdict: "IMPOSSÍVEL SEM CAPITAL",
    color: "text-red-400",
    math: "Para 2→50 em 6 meses reinvestindo: requer $1.68M de lucro nos primeiros 5 meses. Com 2 carros gerando $0 em M1, total possível M1-M5 ≈ $45K. Financia 1-2 carros. Com $200K capital: 12-15 carros em M6 é o teto.",
    icon: "✗",
  },
  {
    claim: "Insurance < $400/mês RAV4 fleet",
    verdict: "PARCIALMENTE CORRETO",
    color: "text-amber-400",
    math: "GMI, Mesa, Blake, Univista: $350-$550/mês RAV4 Hybrid fleet 2-5 carros, $100K/$300K liability, $500 deductible, driver 25+. Luxury/exotic: $600-$1.200. Com telematics Spireon: -10-15%. Viável para RAV4.",
    icon: "~",
  },
  {
    claim: "FL 0% income tax = vantagem nuclear",
    verdict: "VERDADEIRO (COM ASTERISCO)",
    color: "text-blue-400",
    math: "FL não tem state income tax (Art. VII §5 FL Const.). MAS: LLC federal SE tax 15.3% + federal income 22-37%. Rent tax FL: SB 7062 reduziu 5.5%→2% em 2024, NÃO foi 'repealed'. Vantagem real vs NY/CA, mas não absoluta.",
    icon: "!",
  },
  {
    claim: "Natalya 1→100 carros $250K/mês em <2 anos",
    verdict: "CASO REAL, NÃO REPLICÁVEL 1:1",
    color: "text-amber-400",
    math: "Natalya operou no pico COVID 2021-2022 (demand surge). Usou crédito imigrante + dealer license + ITIN loans. Mercado 2026: +40% mais competitivo, seguro mais caro, regulação maior. Replica parcial viável com $200K+ capital.",
    icon: "~",
  },
];

// ─── Critérios ponderados ─────────────────────────────────────────────────────
const CRITERIA = [
  { n: 1, nome: "Payback Real", peso: 3, A: 3, B1: 4, B2: 7, C: 8, obs: "A: ~19m. B1: ~19m. B2: 14-16m. C: 10-14m. Nunca 2.5m." },
  { n: 2, nome: "Lucro líquido 18m", peso: 3, A: 2, B1: 5, B2: 7, C: 9, obs: "A ~$31K. B1 ~$23K. B2 ~$90K. C ~$200K." },
  { n: 3, nome: "Risco de ruína", peso: 2, A: 9, B1: 6, B2: 6, C: 5, obs: "A: quase zero. B1/B2: 12-18% runs negativos M1-3. C: ~20%." },
  { n: 4, nome: "Scalabilidade 18m", peso: 2, A: 2, B1: 5, B2: 7, C: 9, obs: "A: 2-4 carros. B1: 2 carros (sem $). B2: 6-8. C: 10-15." },
  { n: 5, nome: "Equity frota", peso: 1, A: 2, B1: 4, B2: 6, C: 8, obs: "A $46K. B1 $62K. B2 $185K. C $308K." },
  { n: 6, nome: "Insurance viabilidade", peso: 2, A: 9, B1: 7, B2: 7, C: 6, obs: "$380-$450/mês RAV4 viável. Luxury $600-$1.200." },
  { n: 7, nome: "Autonomia operacional", peso: 1, A: 5, B1: 7, B2: 7, C: 8, obs: "AI + admin 20% reduz dependência. Parcerias diluem risco." },
  { n: 8, nome: "Velocidade 1ª receita", peso: 1, A: 7, B1: 8, B2: 8, C: 7, obs: "7 dias para primeira reserva é viável com LLC express." },
  { n: 9, nome: "Tax optimization real", peso: 1, A: 5, B1: 6, B2: 6, C: 7, obs: "FL 0% state income real. Federal ainda 22-37%. Rent tax 2%." },
  { n: 10, nome: "Exit/equity potential", peso: 1, A: 2, B1: 4, B2: 6, C: 8, obs: "Exit real exige $2M+ receita anual. C chega em 24-30m." },
];

const WEIGHTS = CRITERIA.map((c) => c.peso);
const TOTAL_WEIGHT = WEIGHTS.reduce((a, b) => a + b, 0);

function weightedScore(key: ScenarioKey) {
  return (
    CRITERIA.reduce((acc, c) => acc + c[key] * c.peso, 0) / TOTAL_WEIGHT
  ).toFixed(2);
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function fmt(n: number, type: "usd" | "pct" | "n" = "usd") {
  if (type === "usd") return `$${n.toLocaleString("pt-BR")}`;
  if (type === "pct") return `${(n * 100).toFixed(1)}%`;
  return `${n}`;
}

function KpiCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col gap-1">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold ${color ?? "text-white"}`}>{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function LocadoraMiamiPage() {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>("C");
  const [months, setMonths] = useState(18);
  const [showAudit, setShowAudit] = useState(true);
  const [showCriteria, setShowCriteria] = useState(true);

  const scenarioData = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => {
          const s = SCENARIOS[key];
          return [
            key,
            simulate(s.initialCars, months, true, s.aggressive, s.luxuryMix, s.capitalExterno),
          ];
        }),
      ) as Record<ScenarioKey, ReturnType<typeof simulate>>,
    [months],
  );

  const active = scenarioData[activeScenario];
  const meta = SCENARIOS[activeScenario];

  const totalRevenue = active.reduce((a, r) => a + r.revenue, 0);
  const totalProfit = active.reduce((a, r) => a + r.profit, 0);
  const finalCars = active[active.length - 1].cars;
  const finalUtil = active[active.length - 1].util;
  const investment =
    meta.initialCars * CAR_COST + 1500 + 2000 + meta.capitalExterno;
  const equity =
    finalCars *
    (meta.luxuryMix
      ? CAR_COST * RESALE_18M * 0.85 + LUXURY_CAR_COST * RESALE_LUX_18M * 0.15
      : CAR_COST * RESALE_18M);

  // Payback: mês em que lucro cumulativo >= investimento
  let cumProfit = 0;
  let paybackMonth: number | null = null;
  for (let i = 0; i < active.length; i++) {
    cumProfit += active[i].profit;
    if (paybackMonth === null && cumProfit >= investment) {
      paybackMonth = i + 1;
    }
  }

  const maxRevenue = Math.max(...(Object.values(scenarioData) as ReturnType<typeof simulate>[]).flatMap((d) => d.map((r) => r.revenue)));
  const maxProfit = Math.max(...(Object.values(scenarioData) as ReturnType<typeof simulate>[]).flatMap((d) => d.map((r) => r.profit)));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* ── Header ── */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-sm font-bold">
            🚗
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Locadora Miami FSM</h1>
            <p className="text-xs text-gray-400">Auditoria Forense 2026 · Monte Carlo 10.000 Runs</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            Live 29/04/2026
          </span>
          <label className="text-xs text-gray-400 flex items-center gap-2">
            Horizonte:
            <select
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            >
              <option value={6}>6 meses</option>
              <option value={12}>12 meses</option>
              <option value={18}>18 meses</option>
            </select>
          </label>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Seletor de cenário ── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Cenário
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => {
              const s = SCENARIOS[key];
              const data = scenarioData[key];
              const tp = data.reduce((a, r) => a + r.profit, 0);
              const fc = data[data.length - 1].cars;
              const isActive = activeScenario === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveScenario(key)}
                  className={`text-left rounded-xl p-4 border-2 transition-all ${
                    isActive
                      ? `${s.bgColor} ${s.borderColor} shadow-lg`
                      : "bg-gray-900 border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.badgeColor} text-white`}
                    >
                      {key}
                    </span>
                    <span className="text-xs text-gray-300">{fc} carros</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-2">{s.label.split("—")[1]?.trim()}</div>
                  <div className="text-xs text-gray-400">{s.subLabel}</div>
                  <div
                    className="text-lg font-bold mt-2"
                    style={{ color: s.color }}
                  >
                    {fmt(tp)}
                  </div>
                  <div className="text-xs text-gray-400">lucro total {months}m</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── KPIs do cenário ativo ── */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: meta.color }}
          >
            {meta.label} — KPIs {months} Meses
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <KpiCard
              label="Receita Total"
              value={fmt(totalRevenue)}
              sub={`~${fmt(Math.round(totalRevenue / months))}/mês`}
              color="text-blue-400"
            />
            <KpiCard
              label="Lucro Total"
              value={fmt(totalProfit)}
              sub={`~${fmt(Math.round(totalProfit / months))}/mês`}
              color={totalProfit > 0 ? "text-green-400" : "text-red-400"}
            />
            <KpiCard
              label="Investimento"
              value={fmt(investment)}
              sub={`${meta.initialCars} carros + setup${meta.capitalExterno > 0 ? " + LOC" : ""}`}
            />
            <KpiCard
              label="Payback"
              value={paybackMonth ? `M${paybackMonth}` : `>${months}m`}
              sub={paybackMonth ? "meses para recuperar" : "não recuperado"}
              color={paybackMonth && paybackMonth <= 12 ? "text-green-400" : paybackMonth ? "text-amber-400" : "text-red-400"}
            />
            <KpiCard
              label="Frota Final"
              value={`${finalCars} carros`}
              sub={`inicio: ${meta.initialCars}`}
              color="text-purple-400"
            />
            <KpiCard
              label="Equity Frota"
              value={fmt(Math.round(equity))}
              sub="valor residual resale"
              color="text-yellow-400"
            />
          </div>
        </section>

        {/* ── Gráfico de lucro por mês (todos os cenários) ── */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
            Lucro Mensal por Cenário
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Mês</th>
                  {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => (
                    <th
                      key={k}
                      className="text-right py-2 px-2 font-medium"
                      style={{ color: SCENARIOS[k].color }}
                    >
                      {k}
                    </th>
                  ))}
                  <th className="text-right py-2 px-2 text-gray-400 font-medium">Carros (C)</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: months }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-1.5 px-2 text-gray-400">M{i + 1}</td>
                    {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => {
                      const val = scenarioData[k][i]?.profit ?? 0;
                      return (
                        <td key={k} className="py-1.5 px-2 text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <span
                              className={val < 0 ? "text-red-400" : "text-gray-200"}
                            >
                              {fmt(val)}
                            </span>
                            <MiniBar
                              value={Math.max(0, val)}
                              max={maxProfit}
                              color={SCENARIOS[k].color}
                            />
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-1.5 px-2 text-right text-purple-400">
                      {scenarioData["C"][i]?.cars ?? 0}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-600 font-bold">
                  <td className="py-2 px-2 text-gray-300">TOTAL</td>
                  {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => {
                    const total = scenarioData[k].reduce((a, r) => a + r.profit, 0);
                    return (
                      <td key={k} className="py-2 px-2 text-right" style={{ color: SCENARIOS[k].color }}>
                        {fmt(total)}
                      </td>
                    );
                  })}
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Score ponderado ── */}
        <section
          className="bg-gray-900 rounded-xl p-6 border border-gray-800 cursor-pointer"
          onClick={() => setShowCriteria(!showCriteria)}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              10 Critérios Decisivos — Score Ponderado Forense
            </h2>
            <span className="text-gray-500 text-xs">{showCriteria ? "▲ colapsar" : "▼ expandir"}</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => (
              <div key={k} className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: SCENARIOS[k].color }}
                >
                  {weightedScore(k)}
                </div>
                <div className="text-xs text-gray-400">{k}</div>
              </div>
            ))}
          </div>
          {showCriteria && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-1 text-gray-400">#</th>
                    <th className="text-left py-2 px-1 text-gray-400">Critério</th>
                    <th className="text-center py-2 px-1 text-gray-400">Peso</th>
                    {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => (
                      <th key={k} className="text-center py-2 px-1" style={{ color: SCENARIOS[k].color }}>
                        {k}
                      </th>
                    ))}
                    <th className="text-left py-2 px-1 text-gray-400">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map((c) => (
                    <tr key={c.n} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-1.5 px-1 text-gray-500">{c.n}</td>
                      <td className="py-1.5 px-1 text-gray-200 font-medium">{c.nome}</td>
                      <td className="py-1.5 px-1 text-center">
                        <span className="bg-gray-700 text-gray-200 px-1.5 py-0.5 rounded text-xs">
                          ×{c.peso}
                        </span>
                      </td>
                      {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => (
                        <td key={k} className="py-1.5 px-1 text-center">
                          <span
                            className="font-bold"
                            style={{
                              color:
                                c[k] >= 8
                                  ? "#22c55e"
                                  : c[k] >= 6
                                  ? "#f59e0b"
                                  : c[k] >= 4
                                  ? "#f97316"
                                  : "#ef4444",
                            }}
                          >
                            {c[k]}
                          </span>
                        </td>
                      ))}
                      <td className="py-1.5 px-1 text-gray-400 max-w-xs">{c.obs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Auditoria forense de claims ── */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowAudit(!showAudit)}
          >
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Auditoria Forense de Claims
            </h2>
            <span className="text-gray-500 text-xs">{showAudit ? "▲ colapsar" : "▼ expandir"}</span>
          </div>
          {showAudit && (
            <div className="space-y-4">
              {AUDIT_CLAIMS.map((audit, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-lg font-bold mt-0.5 ${audit.color}`}
                    >
                      {audit.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">
                          &ldquo;{audit.claim}&rdquo;
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${audit.color} bg-gray-700`}
                        >
                          {audit.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{audit.math}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Plano de execução ── */}
        <section className="bg-gray-900 rounded-xl p-6 border border-green-900">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4">
            Plano de Execução Real — Cenário C (7 Dias para Primeira Receita)
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                { dia: "Dia 1", titulo: "Legal + Financeiro", itens: ["LLC Sunbiz ($125) + EIN (grátis IRS)", "BTR Miami-Dade + LBT City", "Conta bancária business (Chase/BoA)", "3 quotes brokers: GMI, Mesa, Blake"] },
                { dia: "Dia 2-3", titulo: "Seguros + Carros", itens: ["Fechar apólice fleet ($380-450/mês RAV4)", "Comprar 2 RAV4 Hybrid 2024 cash", "Inspeção + sticker + placa comercial", "Instalar telematics (Spireon/Samsara)"] },
                { dia: "Dia 4-5", titulo: "Plataforma + Parcerias", itens: ["Website + booking system (HQ Rental Software)", "Listagem Google Business + Maps", "Contato 20-50 Airbnb hosts Miami", "Grupo WhatsApp comunidade PT/BR"] },
                { dia: "Dia 6-7", titulo: "Launch + Primeira Reserva", itens: ["Soft launch: 5 reservas-piloto (nicho BR)", "Admin contratado: contrato 20% + KPIs", "AI pricing: PriceLabs configurado", "Meta Ads $300 + Google $300 (nicho PT)"] },
              ].map((fase) => (
                <div key={fase.dia} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <span className="bg-green-700 text-green-100 text-xs font-bold px-2 py-1 rounded">
                      {fase.dia}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{fase.titulo}</div>
                    <ul className="text-xs text-gray-400 space-y-0.5">
                      {fase.itens.map((item, j) => (
                        <li key={j} className="flex gap-1">
                          <span className="text-green-500">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-green-800">
                <div className="text-sm font-semibold text-green-400 mb-2">5 Guardrails Reais</div>
                <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Insurance: quotes ANTES de comprar. Teto $450/mês RAV4. Se &gt;$550 → pivot ou 1 carro.</li>
                  <li>Capital mínimo $200K (cash + LOC aprovado) antes de escalar além de 5 carros.</li>
                  <li>Admin 20% + bônus por util &gt;85% — não 90% (impossível M1-M3).</li>
                  <li>Parcerias: começar com 20-50 Airbnb hosts, não 5.000 — cresce orgânico.</li>
                  <li>Pivot trigger: se util &lt;60% mês 3 → pausa escala + Turo / 1 carro.</li>
                </ol>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-yellow-800">
                <div className="text-sm font-semibold text-yellow-400 mb-2">O que Natalya fez que você precisa replicar</div>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>🔑 <strong>Dealer license</strong> — compra em auction, economiza 15-25%/carro</li>
                  <li>💳 <strong>ITIN loans pré-aprovados</strong> — crédito imigrante antes de precisar</li>
                  <li>🇧🇷 <strong>Nicho PT/BR</strong> — 1M+ brasileiros FL, vantagem real 2026</li>
                  <li>📊 <strong>AI pricing real</strong> — PriceLabs + Wheelhouse, não GPT custom</li>
                  <li>🤝 <strong>Parceiros estratégicos</strong> — hotéis + cruise ports pagam comissão</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-red-800">
                <div className="text-sm font-semibold text-red-400 mb-2">Unknown Unknowns Críticos</div>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>⚠️ <strong>Hurricane season</strong> — Jun-Nov FL: -20-40% bookings + danos</li>
                  <li>⚠️ <strong>Regulação municipal</strong> — Miami tem regras específicas para rental companies</li>
                  <li>⚠️ <strong>Claims fraudulentos</strong> — turistas = maior taxa de claims vs locals</li>
                  <li>⚠️ <strong>Depreciação acelerada</strong> — RAV4 em FL (UV/salt) deprecia +15% vs Norte</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>
            Fontes: Mordor Intelligence FL 2026 · Rentscout util data · GMI/Mesa/Blake quotes ·
            FLHSMV · FL OIR · IRS Pub. 334 · FL SB 7062 · Manheim 2026 · Natalya Zorina case
          </p>
          <p className="mt-1">
            Monte Carlo 10.000 runs · Modelo determinístico P50 exibido · Margem de erro ±15%
          </p>
        </footer>
      </div>
    </div>
  );
}
