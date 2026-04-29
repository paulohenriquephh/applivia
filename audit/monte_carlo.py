"""Monte Carlo 10.000 runs - 2 RAV4 Hybrid Miami, 18 meses
Distribuicoes baseadas nas faixas observadas em fontes primarias 2025/2026.
Reporta P5/P50/P95 de payback, P(payback<=2.5 meses), P(falencia caixa).
"""
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
N = 10_000

CAR_PRICE = 34_750
ACQ = CAR_PRICE * 1.075 + 800
N_CARS = 2
CAPEX = ACQ * N_CARS

# Distribuicoes empiricas (fontes nas linhas)
# Diaria SUV mid Miami (KAYAK/Discover 2025): low $26, avg $57-105, high $120
daily = rng.triangular(40, 75, 130, N)
# Util Turo SUV Miami top hosts: 30-50% novato, ate 85% pico (Salaryclear 2026)
util = np.clip(rng.normal(0.55, 0.15, N), 0.20, 0.90)
# Insurance commercial fleet FL (Sungate 2026: $900-3000/ano = $75-250/mes/carro
# em fleet baixo risco; rental specialty geralmente puxa $300-500)
insurance = rng.uniform(280, 520, N)
# Custo claims / grandes sinistros (eventos raros mas pesados - WSVN Jimenez)
big_claim_prob = 0.08  # ~1 sinistro grande/carro/ano (FL theft +6% Mesa 2026)
big_claim = rng.binomial(1, big_claim_prob, N) * rng.uniform(2000, 12000, N)
# Manutencao + claims pequenos
maint = rng.uniform(80, 250, N)
# Admin + marketing
admin_pct = 0.20
mkt_pct = rng.uniform(0.04, 0.10, N)

gross = daily * 30 * util
cash_profit = (gross * (1 - admin_pct - mkt_pct)) - insurance - maint - (big_claim/12)
monthly_total = cash_profit * N_CARS

# Payback (caixa) assumindo lucro estavel e reinvestimento ZERO
payback = np.where(monthly_total > 0, CAPEX / monthly_total, np.inf)

print(f"Capex investido: ${CAPEX:,.0f}\n")
print("=== Distribuicao do PAYBACK em meses (10.000 simulacoes) ===")
for q in [5, 25, 50, 75, 95]:
    print(f"  P{q:>2}: {np.percentile(payback, q):>6.1f} meses")

p_le_25 = (payback <= 2.5).mean() * 100
p_le_6  = (payback <= 6).mean() * 100
p_le_12 = (payback <= 12).mean() * 100
p_neg   = (monthly_total <= 0).mean() * 100
print(f"\nP(payback <= 2,5 meses, alegado pelo usuario): {p_le_25:.2f}%")
print(f"P(payback <= 6 meses, alegado original):       {p_le_6:.2f}%")
print(f"P(payback <= 12 meses):                        {p_le_12:.2f}%")
print(f"P(operacao queima caixa, lucro mensal <= 0):   {p_neg:.2f}%")

# Receita mensal media e percentis
print(f"\nLucro caixa mensal P50: ${np.percentile(monthly_total,50):,.0f}")
print(f"Lucro caixa mensal P5/P95: ${np.percentile(monthly_total,5):,.0f} / ${np.percentile(monthly_total,95):,.0f}")
