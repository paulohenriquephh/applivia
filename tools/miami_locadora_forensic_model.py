from __future__ import annotations


RAV4_HYBRID_MSRP = 32_850
INITIAL_CARS = 2
TARGET_PAYBACK_MONTHS = 2.5


CRITERIA_WEIGHTS = {
    "unit_economics": 18,
    "insurance_claims": 16,
    "demand_capture": 14,
    "compliance_friction": 10,
    "operator_load": 10,
    "capital_efficiency": 10,
    "scalability_after_proof": 8,
    "channel_resilience": 6,
    "equity_optionality": 4,
    "strategic_optionality": 4,
}


OPTION_SCORES = {
    "A_conservador": {
        "unit_economics": 5,
        "insurance_claims": 7,
        "demand_capture": 5,
        "compliance_friction": 8,
        "operator_load": 4,
        "capital_efficiency": 7,
        "scalability_after_proof": 3,
        "channel_resilience": 4,
        "equity_optionality": 6,
        "strategic_optionality": 4,
    },
    "B_blitzscale": {
        "unit_economics": 2,
        "insurance_claims": 3,
        "demand_capture": 8,
        "compliance_friction": 3,
        "operator_load": 3,
        "capital_efficiency": 2,
        "scalability_after_proof": 10,
        "channel_resilience": 8,
        "equity_optionality": 7,
        "strategic_optionality": 8,
    },
    "C_beachhead_agressivo": {
        "unit_economics": 8,
        "insurance_claims": 7,
        "demand_capture": 7,
        "compliance_friction": 8,
        "operator_load": 6,
        "capital_efficiency": 8,
        "scalability_after_proof": 7,
        "channel_resilience": 7,
        "equity_optionality": 6,
        "strategic_optionality": 8,
    },
}


def required_free_cash(capex: float, payback_months: float) -> float:
    return capex / payback_months


def format_money(value: float) -> str:
    return f"${value:,.2f}"


def payback_diagnostics() -> list[str]:
    capex = INITIAL_CARS * RAV4_HYBRID_MSRP
    required_monthly_free_cash = required_free_cash(capex, TARGET_PAYBACK_MONTHS)
    calendar_day_required = required_monthly_free_cash / (INITIAL_CARS * 30)
    rented_day_required_90_util = required_monthly_free_cash / (INITIAL_CARS * 30 * 0.90)
    implied_gross_rate_90_util = rented_day_required_90_util

    lines = [
        "=== TESTE FORENSE DE PAYBACK ===",
        f"Capex minimo (2 x MSRP oficial do RAV4 Hybrid): {format_money(capex)}",
        f"Payback-alvo: {TARGET_PAYBACK_MONTHS:.1f} meses",
        f"Free cash mensal exigido: {format_money(required_monthly_free_cash)}",
        f"Free cash por carro por dia-calendario: {format_money(calendar_day_required)}",
        f"Free cash por carro por dia alugado a 90% de utilizacao: {format_money(rented_day_required_90_util)}",
        f"Diaria bruta implicita minima a 90% de utilizacao e sem nenhum custo: {format_money(implied_gross_rate_90_util)}",
        "",
        "Cenarios de teto de receita bruta mensal com 2 carros:",
    ]

    scenarios = [
        ("Benchmark Hertz RPD Americas Q1 2024", 56.92, 0.77),
        ("Direto Miami agressivo", 100.00, 0.90),
        ("Hipotese muito agressiva", 150.00, 0.90),
        ("Hipotese absurda e favoravel", 200.00, 1.00),
    ]

    for label, daily_rate, utilization in scenarios:
        monthly_gross = INITIAL_CARS * 30 * utilization * daily_rate
        payback_gap = daily_rate - implied_gross_rate_90_util
        lines.append(
            f"- {label}: diaria {format_money(daily_rate)}, utilizacao {utilization:.0%}, "
            f"receita bruta mensal {format_money(monthly_gross)}, "
            f"gap vs diaria implicita {format_money(payback_gap)}"
        )

    lines.extend(
        [
            "",
            "Conclusao: com 2 RAV4 cash, o payback de 2,5 meses nao fecha como payback do capital total.",
            "Para ser verdadeiro, 'payback' teria de significar outra coisa: recuperar entrada, marketing inicial, ou working capital.",
        ]
    )

    return lines


def weighted_score(scores: dict[str, int]) -> float:
    total = 0.0
    for criterion, weight in CRITERIA_WEIGHTS.items():
        total += scores[criterion] * weight
    return total / 10.0


def ranking_lines() -> list[str]:
    scored = [
        (name, weighted_score(scores))
        for name, scores in OPTION_SCORES.items()
    ]
    scored.sort(key=lambda item: item[1], reverse=True)

    lines = ["=== RANKING PONDERADO ==="]
    for position, (name, score) in enumerate(scored, start=1):
        lines.append(f"{position}. {name}: {score:.1f}/100")
    return lines


def main() -> None:
    output = []
    output.extend(payback_diagnostics())
    output.append("")
    output.extend(ranking_lines())
    print("\n".join(output))


if __name__ == "__main__":
    main()
