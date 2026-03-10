"""Market Research Crew — Market Analyst + Trend Spotter + Report Writer."""

from typing import Any

from crews.base import BaseCrew


class MarketResearchCrew(BaseCrew):
    DESCRIPTION = "Analyzes markets, spots trends, and produces research reports"
    AGENT_NAMES = ["Market Analyst", "Trend Spotter", "Report Writer"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        industry = inputs.get("industry", "technology")
        focus = inputs.get("focus", "market trends and opportunities")
        num_competitors = inputs.get("num_competitors", 5)

        # Agent 1: Market Analyst — gather market data
        analyst_prompt = (
            f"You are a senior Market Analyst. Research the {industry} industry.\n"
            f"Focus on: {focus}\n"
            f"Analyze {num_competitors} top competitors.\n"
            f"Provide: market size, growth rate, key players, recent funding rounds, "
            f"and regulatory changes in the last 30 days.\n"
            f"Format as structured JSON with keys: market_size, growth_rate, "
            f"key_players (list), funding_rounds (list), regulatory_changes (list)."
        )
        search_results = self._search_web(f"{industry} market analysis {focus} 2026")
        context = "\n".join(f"- {r['title']}: {r['snippet']}" for r in search_results[:5])
        analyst_result = self._llm_call(
            f"{analyst_prompt}\n\nWeb research context:\n{context}",
            system_prompt="You are a data-driven market analyst. Always provide specific numbers and sources.",
        )

        # Agent 2: Trend Spotter — identify emerging trends
        trends_prompt = (
            f"You are a Trend Spotter specializing in {industry}.\n"
            f"Based on this market analysis:\n{analyst_result['text'][:3000]}\n\n"
            f"Identify:\n"
            f"1. Top 5 emerging trends with confidence scores (0-100)\n"
            f"2. 3 potential disruptions in the next 6-12 months\n"
            f"3. 3 opportunities with highest ROI potential\n"
            f"Format as structured JSON with keys: trends (list of {{name, confidence, description}}), "
            f"disruptions (list), opportunities (list of {{name, roi_estimate, description}})."
        )
        trends_result = self._llm_call(
            trends_prompt,
            system_prompt="You are a trend analysis expert. Be specific and quantitative.",
        )

        # Agent 3: Report Writer — compile final report
        report_prompt = (
            f"You are a professional Report Writer. Compile a comprehensive market research report.\n\n"
            f"Market Analysis:\n{analyst_result['text'][:2000]}\n\n"
            f"Trends Analysis:\n{trends_result['text'][:2000]}\n\n"
            f"Create an executive summary report with:\n"
            f"1. Executive Summary (3 bullet points)\n"
            f"2. Market Overview\n"
            f"3. Key Trends\n"
            f"4. Opportunities & Recommendations\n"
            f"5. Risk Assessment\n"
            f"Format as JSON with keys: executive_summary, market_overview, key_trends, "
            f"opportunities, risks, recommended_actions (list)."
        )
        report_result = self._llm_call(
            report_prompt,
            system_prompt="You are a concise business report writer. Focus on actionable insights.",
        )

        total_cost = (
            analyst_result.get("cost", 0) +
            trends_result.get("cost", 0) +
            report_result.get("cost", 0)
        )

        return {
            "crew": "market_research",
            "industry": industry,
            "analysis": analyst_result["text"],
            "trends": trends_result["text"],
            "report": report_result["text"],
            "cost": total_cost,
            "model": report_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
