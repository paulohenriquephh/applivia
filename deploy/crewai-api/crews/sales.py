"""Sales Crew — Lead Qualifier + Pitch Crafter + Deal Closer."""

from typing import Any

from crews.base import BaseCrew


class SalesCrew(BaseCrew):
    DESCRIPTION = "Qualifies leads, crafts pitches, and closes deals"
    AGENT_NAMES = ["Lead Qualifier", "Pitch Crafter", "Deal Closer"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        lead_name = inputs.get("lead_name", "Unknown Company")
        lead_industry = inputs.get("industry", "technology")
        lead_size = inputs.get("company_size", "50-200")
        pain_points = inputs.get("pain_points", "manual processes, scaling challenges")
        our_product = inputs.get("product", "AI automation platform")
        budget_range = inputs.get("budget_range", "$1K-$10K/mo")

        # Agent 1: Lead Qualifier
        qualifier_prompt = (
            f"You are a Lead Qualifier. Assess this lead:\n"
            f"Company: {lead_name}\n"
            f"Industry: {lead_industry}\n"
            f"Size: {lead_size} employees\n"
            f"Pain points: {pain_points}\n"
            f"Budget range: {budget_range}\n\n"
            f"Score using BANT framework (Budget, Authority, Need, Timeline).\n"
            f"Output JSON: {{\"bant_score\": 0-100, \"budget_fit\": true/false, "
            f"\"authority_level\": ..., \"need_urgency\": 1-10, \"timeline\": ..., "
            f"\"qualification\": \"hot\"/\"warm\"/\"cold\", \"next_action\": ...}}"
        )
        search_data = self._search_web(f"{lead_name} {lead_industry} company")
        context = "\n".join(f"- {r['title']}: {r['snippet']}" for r in search_data[:3])
        qual_result = self._llm_call(
            f"{qualifier_prompt}\n\nCompany research:\n{context}",
            system_prompt="You are an experienced sales qualifier. Be data-driven and honest.",
        )

        # Agent 2: Pitch Crafter
        pitch_prompt = (
            f"You are a Pitch Crafter. Create a personalized sales pitch.\n\n"
            f"Lead qualification:\n{qual_result['text'][:2000]}\n\n"
            f"Our product: {our_product}\n"
            f"Their pain points: {pain_points}\n\n"
            f"Create:\n"
            f"1. Email subject line (A/B variants)\n"
            f"2. Opening hook (personalized to their industry)\n"
            f"3. Value proposition (3 bullet points)\n"
            f"4. Social proof / case study reference\n"
            f"5. Clear CTA\n"
            f"6. Follow-up sequence (3 emails, 3 days apart)\n"
            f"Output as JSON: {{\"subject_a\": ..., \"subject_b\": ..., "
            f"\"email_body\": ..., \"value_props\": [...], \"cta\": ..., "
            f"\"follow_ups\": [{{\"day\": ..., \"subject\": ..., \"body\": ...}}]}}"
        )
        pitch_result = self._llm_call(
            pitch_prompt,
            system_prompt="You craft compelling, personalized sales pitches that convert.",
        )

        # Agent 3: Deal Closer
        closer_prompt = (
            f"You are a Deal Closer strategist. Plan the closing strategy.\n\n"
            f"Lead info:\n{qual_result['text'][:1500]}\n\n"
            f"Pitch:\n{pitch_result['text'][:1500]}\n\n"
            f"Create:\n"
            f"1. Objection handling (top 5 likely objections + responses)\n"
            f"2. Negotiation boundaries (walk-away price, ideal price, anchor price)\n"
            f"3. Closing technique recommendation\n"
            f"4. Decision timeline and next steps\n"
            f"Output as JSON: {{\"objections\": [{{\"objection\": ..., \"response\": ...}}], "
            f"\"pricing\": {{\"anchor\": ..., \"ideal\": ..., \"walkaway\": ...}}, "
            f"\"closing_technique\": ..., \"timeline\": ..., \"next_steps\": [...]}}"
        )
        closer_result = self._llm_call(
            closer_prompt,
            system_prompt="You are a master closer. Focus on win-win outcomes.",
        )

        total_cost = qual_result.get("cost", 0) + pitch_result.get("cost", 0) + closer_result.get("cost", 0)

        return {
            "crew": "sales",
            "lead": lead_name,
            "qualification": qual_result["text"],
            "pitch": pitch_result["text"],
            "closing_strategy": closer_result["text"],
            "cost": total_cost,
            "model": closer_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
