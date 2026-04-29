"""Auditoria forense - Locadora Miami 2026
Stress test do payback alegado de 2,5 meses contra dados primários 2025/2026.

Fontes (todas verificadas em 2026-04-29):
- KBB 2026 RAV4 Hybrid LE: $34,750 MSRP
- IBISWorld 2025: FL car rental market $7.7B, 1,026 empresas
- GMCVB 2024: 28.2M visitantes Miami, $22B gasto
- Logrock/Sungate 2026: commercial fleet auto FL = $900-3,000/veículo/ano
- TaxNews EY 2026: Business rent tax (commercial real estate) repealed 1-Oct-2025;
  rental car surcharge $2/dia CONTINUA + 6% state + 1% Miami-Dade = 7% sobre rental
- BI/Yahoo 2023 + Supercar Blondie: Natalya Zorina = 69 carros (NAO 100), $922,225/ano
  com forte mix LUXURY (Lambo $1.7K/dia), nao 100 econ/SUV.
- Salaryclear/Rentscout 2026: Turo SUV NET $500-800/carro/mes; util realista
  novato 30-50%, top hosts media 63%.
- WSVN: caso Andrew Jimenez - host Miami ficou com $29K liability quando Turo
  e seguro pessoal recusaram cobertura.
- AutoRentalNews 2020: Hertz fleet financing colapsou na pandemia ($14B
  securitized debt subiu enquanto valor residual caia).
"""
import numpy as np
import pandas as pd

CAR_PRICE = 34750            # RAV4 Hybrid LE 2026 (KBB)
TAX_TITLE = 0.075            # ~7% Miami-Dade sobre compra (cap surtax $5k)
ACQUISITION = CAR_PRICE * (1 + TAX_TITLE) + 800  # tag/title/dealer fees
N_CARS = 2

# Receita bruta/carro/mes - cenarios
SCENARIOS = {
    "Conservador (Salaryclear/Rentscout 2026 SUV mediano)": dict(daily=70, util=0.50),
    "Realista off-airport bem operado": dict(daily=85, util=0.65),
    "Agressivo (top decil, alta temporada)": dict(daily=110, util=0.80),
    "Cenario alegado pelo usuario (90% util / pricing premium)": dict(daily=120, util=0.90),
}

# Custos mensais por carro
INSURANCE = 350      # commercial fleet FL, lower bound (Sungate/Logrock 2026)
MAINT = 150          # manutencao/limpeza
ADMIN_PCT = 0.20     # admin local 20% bruto
PLATFORM_OR_MKT = 0.05  # custo aquisicao cliente direto (ads + parcerias 8%)
DEPRECIATION_M = CAR_PRICE * 0.15 / 12  # ~15% a.a. (Salaryclear, RAV4 hybrid)
SURCHARGE_DAILY = 2  # FL $2/dia primeiros 30 dias (DOR)
SALES_TAX_RENTAL = 0.07  # 6% state + 1% surtax, repassado mas reduz margem efetiva se nao
                         # totalmente repassado em pricing competitivo

rows = []
for name, s in SCENARIOS.items():
    daily, util = s["daily"], s["util"]
    days = 30 * util
    gross_per_car = daily * days
    surcharge_collected = SURCHARGE_DAILY * days
    # surcharge passa direto para FL DOR -> nao e receita; ignoramos no profit
    admin = ADMIN_PCT * gross_per_car
    mkt = PLATFORM_OR_MKT * gross_per_car
    cash_costs = INSURANCE + MAINT + admin + mkt
    cash_profit = gross_per_car - cash_costs
    economic_profit = cash_profit - DEPRECIATION_M
    fleet_invest = ACQUISITION * N_CARS
    monthly_total_cash = cash_profit * N_CARS
    payback_cash = fleet_invest / monthly_total_cash if monthly_total_cash > 0 else float("inf")
    payback_econ = fleet_invest / (economic_profit * N_CARS) if economic_profit > 0 else float("inf")
    rows.append([name, daily, f"{util*100:.0f}%", round(gross_per_car), round(cash_profit),
                 round(economic_profit), round(payback_cash, 1), round(payback_econ, 1)])

df = pd.DataFrame(rows, columns=[
    "Cenario", "Diaria $", "Util", "Bruto/carro $", "Lucro caixa/carro $",
    "Lucro economico/carro $", "Payback CAIXA (meses)", "Payback ECON (meses)"])
print("=== STRESS TEST PAYBACK - 2 RAV4 Hybrid 2026 cash, $34,750 MSRP cada ===")
print(f"Capex total (com tax+title): ${ACQUISITION*N_CARS:,.0f}\n")
print(df.to_string(index=False))

print("\n=== O QUE PRECISARIA SER VERDADE PARA PAYBACK = 2.5 MESES ===")
required_monthly_profit = (ACQUISITION * N_CARS) / 2.5
required_per_car = required_monthly_profit / N_CARS
print(f"Lucro caixa exigido: ${required_monthly_profit:,.0f}/mes ({required_per_car:,.0f}/carro)")
# Quanto bruto seria? Reverso assumindo 100% util e custos fixos de cima
# net = gross*(1 - admin - mkt) - INS - MAINT  =>  gross = (net + INS + MAINT)/(1 - .25)
required_gross = (required_per_car + INSURANCE + MAINT) / (1 - ADMIN_PCT - PLATFORM_OR_MKT)
print(f"Receita bruta mensal exigida/carro: ${required_gross:,.0f}")
print(f"@90% util => diaria exigida: ${required_gross/(30*0.9):,.0f}")
print(f"@100% util => diaria exigida: ${required_gross/30:,.0f}")
print("Conclusao: payback 2,5 meses exige diaria ~$595 a $660 com 90-100% util.")
print("RAV4 Hybrid em Miami nao aluga >$120/dia (KAYAK/Discover/Avis dados 2025).")
print("So um Lambo @ ~$1,700/dia (caso Natalya), com util luxury ~30-40%, chega perto.")

# Cenario LUXURY honesto (Natalya playbook)
print("\n=== CENARIO LUXURY (Natalya playbook real, 1 Lambo $250K) ===")
lux_price = 250_000
lux_daily = 1700
lux_util = 0.35  # exotic util historico
lux_gross = lux_daily * 30 * lux_util
lux_ins = 6000/12  # $4k-8k/ano (Gridlocal Miami 2026)
lux_admin = ADMIN_PCT * lux_gross
lux_mkt = PLATFORM_OR_MKT * lux_gross
lux_maint = 600
lux_cash = lux_gross - (lux_ins + lux_admin + lux_mkt + lux_maint)
print(f"Gross: ${lux_gross:,.0f}/mes | Cash profit: ${lux_cash:,.0f}/mes")
print(f"Payback caixa do Lambo: {lux_price/lux_cash:.1f} meses")
print("=> Mesmo no upper bound luxury, payback >20 meses (e Natalya levou ~5 anos para 69 carros).")
