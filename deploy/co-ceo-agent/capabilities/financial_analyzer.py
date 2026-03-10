"""Financial analysis using reasoning-optimized models."""

from typing import Any


class FinancialAnalyzer:
    """Performs financial calculations, projections, and ROI analysis."""

    def __init__(self, router: Any):
        self.router = router

    async def analyze(self, data: dict, analysis_type: str = "general") -> dict:
        """Run financial analysis on provided data."""
        type_prompts = {
            "roi": "Calculate ROI, payback period, and NPV. Show all calculations.",
            "forecast": "Create 6-month and 12-month financial forecasts with 3 scenarios.",
            "cost_optimization": "Identify cost-saving opportunities. Quantify each saving.",
            "revenue_analysis": "Analyze revenue streams, growth rates, and unit economics.",
            "general": "Provide a comprehensive financial overview with key metrics.",
        }

        prompt = (
            f"You are a CFO-level financial analyst. Perform the following analysis:\n\n"
            f"Analysis type: {analysis_type}\n"
            f"Instructions: {type_prompts.get(analysis_type, type_prompts['general'])}\n\n"
            f"Financial data:\n{str(data)[:5000]}\n\n"
            f"Output as JSON with keys:\n"
            f"- summary (executive summary)\n"
            f"- metrics (dict of calculated financial metrics)\n"
            f"- calculations (show your work)\n"
            f"- projections (if applicable)\n"
            f"- recommendations (prioritized list)\n"
            f"- confidence (0-100)\n"
            f"- assumptions (list any assumptions made)"
        )

        result = await self.router.call(prompt, task_type="financial_analysis",
                                         system_prompt="You are a precise financial analyst. Every number must be justified.")

        return {
            "analysis_type": analysis_type,
            "result": result["text"],
            "model": result["model"],
            "cost": result.get("cost", 0),
        }
