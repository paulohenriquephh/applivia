"""Business strategy analysis engine using premium models."""

from typing import Any


class StrategyEngine:
    """Performs deep business strategy analysis."""

    def __init__(self, router: Any):
        self.router = router

    async def analyze(self, topic: str, depth: str = "thorough", data: str = "") -> dict:
        """Analyze a business topic and provide strategic recommendations."""
        depth_instructions = {
            "quick": "Provide a concise 3-point analysis.",
            "thorough": "Provide a comprehensive analysis with data points, frameworks, and actionable steps.",
            "deep": "Provide an exhaustive analysis using multiple strategic frameworks (SWOT, Porter's 5 Forces, PESTEL). Include quantitative projections."
        }

        prompt = (
            f"You are a world-class business strategist. Analyze the following:\n\n"
            f"Topic: {topic}\n"
            f"Depth: {depth_instructions.get(depth, depth_instructions['thorough'])}\n"
        )
        if data:
            prompt += f"\nSupporting data:\n{data[:5000]}\n"

        prompt += (
            f"\nProvide your analysis as JSON with keys:\n"
            f"- executive_summary (3 sentences max)\n"
            f"- key_findings (list of findings with evidence)\n"
            f"- opportunities (list with estimated impact: high/medium/low)\n"
            f"- risks (list with likelihood and mitigation)\n"
            f"- recommendations (prioritized list with timeline)\n"
            f"- frameworks_used (which analytical frameworks you applied)\n"
            f"- confidence_score (0-100)"
        )

        result = await self.router.call(prompt, task_type="strategy",
                                         system_prompt="You are the CO-CEO strategic advisor. Be decisive and data-driven.")

        return {
            "topic": topic,
            "depth": depth,
            "analysis": result["text"],
            "model": result["model"],
            "cost": result.get("cost", 0),
            "latency_ms": result.get("latency_ms", 0),
        }
