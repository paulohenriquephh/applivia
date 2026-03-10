"""Finance Crew — Bookkeeper + Forecaster + Expense Auditor."""

from typing import Any

from crews.base import BaseCrew


class FinanceCrew(BaseCrew):
    DESCRIPTION = "Manages bookkeeping, financial forecasting, and expense auditing"
    AGENT_NAMES = ["Bookkeeper", "Forecaster", "Expense Auditor"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        period = inputs.get("period", "2026-03")
        revenue = inputs.get("revenue", 0)
        expenses = inputs.get("expenses", {})
        clients = inputs.get("active_clients", 0)
        mrr = inputs.get("mrr", 0)
        historical = inputs.get("historical_data", "")

        # Agent 1: Bookkeeper
        bookkeeper_prompt = (
            f"You are a Bookkeeper. Organize the financial data for {period}.\n\n"
            f"Revenue: ${revenue}\n"
            f"MRR: ${mrr}\n"
            f"Active clients: {clients}\n"
            f"Expenses: {expenses}\n"
            f"Historical context: {historical[:500] if historical else 'First period'}\n\n"
            f"Produce:\n"
            f"1. Income statement summary\n"
            f"2. Cash flow statement\n"
            f"3. Expense categorization (fixed vs variable)\n"
            f"4. Key financial ratios (gross margin, net margin, burn rate)\n"
            f"Output as JSON: {{\"income_statement\": {{\"revenue\": ..., \"cogs\": ..., "
            f"\"gross_profit\": ..., \"operating_expenses\": ..., \"net_income\": ...}}, "
            f"\"cash_flow\": {{...}}, \"expense_categories\": {{\"fixed\": [...], \"variable\": [...]}}, "
            f"\"ratios\": {{\"gross_margin\": ..., \"net_margin\": ..., \"burn_rate\": ...}}}}"
        )
        books_result = self._llm_call(
            bookkeeper_prompt,
            system_prompt="You are a meticulous bookkeeper. Every number must balance.",
        )

        # Agent 2: Forecaster
        forecast_prompt = (
            f"You are a Financial Forecaster. Project the next 6 months.\n\n"
            f"Current financials:\n{books_result['text'][:2000]}\n\n"
            f"Current MRR: ${mrr}\n"
            f"Active clients: {clients}\n\n"
            f"Provide:\n"
            f"1. 6-month revenue projection (3 scenarios: conservative, base, optimistic)\n"
            f"2. Expected expense growth\n"
            f"3. Break-even analysis\n"
            f"4. Cash runway (months until zero at current burn)\n"
            f"5. Key growth levers\n"
            f"Output as JSON: {{\"projections\": {{\"conservative\": [...], \"base\": [...], "
            f"\"optimistic\": [...]}}, \"expense_growth\": ..., \"break_even_month\": ..., "
            f"\"runway_months\": ..., \"growth_levers\": [...]}}"
        )
        forecast_result = self._llm_call(
            forecast_prompt,
            system_prompt="You forecast financials with conservative rigor. Show your assumptions.",
        )

        # Agent 3: Expense Auditor
        audit_prompt = (
            f"You are an Expense Auditor. Review expenses for optimization.\n\n"
            f"Expenses: {expenses}\n"
            f"Financials:\n{books_result['text'][:1500]}\n\n"
            f"Audit:\n"
            f"1. Flag any unusual or excessive expenses\n"
            f"2. Identify cost-saving opportunities (with estimated savings)\n"
            f"3. Benchmark against industry standards\n"
            f"4. Prioritized list of cuts if budget tightening needed\n"
            f"5. Tax optimization suggestions\n"
            f"Output as JSON: {{\"flags\": [...], \"savings_opportunities\": "
            f"[{{\"area\": ..., \"current\": ..., \"suggested\": ..., \"savings\": ...}}], "
            f"\"benchmarks\": {{...}}, \"cut_priority\": [...], \"tax_tips\": [...]}}"
        )
        audit_result = self._llm_call(
            audit_prompt,
            system_prompt="You audit with an eye for waste. Find every dollar that can be saved.",
        )

        total_cost = books_result.get("cost", 0) + forecast_result.get("cost", 0) + audit_result.get("cost", 0)

        return {
            "crew": "finance",
            "period": period,
            "books": books_result["text"],
            "forecast": forecast_result["text"],
            "audit": audit_result["text"],
            "cost": total_cost,
            "model": audit_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
