"""Ads Crew — Ad Copywriter + Media Planner + ROI Analyst."""

from typing import Any

from crews.base import BaseCrew


class AdsCrew(BaseCrew):
    DESCRIPTION = "Creates ad copy, plans media buying, and analyzes campaign ROI"
    AGENT_NAMES = ["Ad Copywriter", "Media Planner", "ROI Analyst"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        product = inputs.get("product", "AI automation platform")
        target_audience = inputs.get("target_audience", "SMB owners 30-55")
        platforms = inputs.get("platforms", ["google_ads", "meta_ads", "linkedin_ads"])
        monthly_budget = inputs.get("monthly_budget", 2000)
        goal = inputs.get("goal", "lead_generation")

        # Agent 1: Ad Copywriter
        copy_prompt = (
            f"You are an Ad Copywriter. Create ad variations for: {product}\n"
            f"Target audience: {target_audience}\n"
            f"Platforms: {', '.join(platforms)}\n"
            f"Campaign goal: {goal}\n\n"
            f"For each platform, create:\n"
            f"- 3 headline variations (max 30 chars for Google, 40 for Meta)\n"
            f"- 2 description variations\n"
            f"- 1 CTA\n"
            f"- Suggested imagery/creative direction\n"
            f"Output as JSON: {{\"platforms\": {{\"<platform>\": {{\"headlines\": [...], "
            f"\"descriptions\": [...], \"cta\": ..., \"creative_direction\": ...}}}}}}"
        )
        copy_result = self._llm_call(
            copy_prompt,
            system_prompt="You write high-converting ad copy. Every word counts.",
        )

        # Agent 2: Media Planner
        media_prompt = (
            f"You are a Media Planner. Create a media buying strategy.\n\n"
            f"Ad copy:\n{copy_result['text'][:2000]}\n\n"
            f"Monthly budget: ${monthly_budget}\n"
            f"Platforms: {', '.join(platforms)}\n"
            f"Goal: {goal}\n\n"
            f"Plan:\n"
            f"1. Budget allocation per platform (% and $)\n"
            f"2. Targeting parameters per platform\n"
            f"3. Bid strategy recommendations\n"
            f"4. A/B test plan (what to test, duration, sample size)\n"
            f"5. Schedule (best days/hours per platform)\n"
            f"Output as JSON: {{\"allocation\": {{...}}, \"targeting\": {{...}}, "
            f"\"bid_strategy\": {{...}}, \"ab_tests\": [...], \"schedule\": {{...}}}}"
        )
        media_result = self._llm_call(
            media_prompt,
            system_prompt="You are a data-driven media planner optimizing for ROAS.",
        )

        # Agent 3: ROI Analyst
        roi_prompt = (
            f"You are an ROI Analyst. Project campaign performance.\n\n"
            f"Media plan:\n{media_result['text'][:2000]}\n\n"
            f"Monthly budget: ${monthly_budget}\n"
            f"Goal: {goal}\n\n"
            f"Provide:\n"
            f"1. Expected CPL/CPA by platform\n"
            f"2. Projected leads/conversions per month\n"
            f"3. Expected ROAS\n"
            f"4. Break-even analysis\n"
            f"5. 3-month projection with optimization curve\n"
            f"6. KPIs to track weekly\n"
            f"Output as JSON: {{\"cpl_by_platform\": {{...}}, \"projected_leads\": ..., "
            f"\"roas\": ..., \"break_even_month\": ..., \"projections\": [...], \"kpis\": [...]}}"
        )
        roi_result = self._llm_call(
            roi_prompt,
            system_prompt="You forecast ad performance with precision. Use industry benchmarks.",
        )

        total_cost = copy_result.get("cost", 0) + media_result.get("cost", 0) + roi_result.get("cost", 0)

        return {
            "crew": "ads",
            "product": product,
            "ad_copy": copy_result["text"],
            "media_plan": media_result["text"],
            "roi_projections": roi_result["text"],
            "cost": total_cost,
            "model": roi_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
