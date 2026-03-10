"""Outreach Crew — Prospect Finder + Email Composer + Follow-up Tracker."""

from typing import Any

from crews.base import BaseCrew


class OutreachCrew(BaseCrew):
    DESCRIPTION = "Finds prospects, composes outreach emails, and tracks follow-ups"
    AGENT_NAMES = ["Prospect Finder", "Email Composer", "Follow-up Tracker"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        target_industry = inputs.get("industry", "SaaS")
        target_role = inputs.get("role", "CEO/CTO")
        company_size = inputs.get("company_size", "10-100")
        our_offer = inputs.get("offer", "AI automation platform")
        num_prospects = inputs.get("num_prospects", 10)
        region = inputs.get("region", "US")

        # Agent 1: Prospect Finder
        finder_prompt = (
            f"You are a Prospect Finder. Identify {num_prospects} ideal prospects.\n\n"
            f"Target profile:\n"
            f"- Industry: {target_industry}\n"
            f"- Role: {target_role}\n"
            f"- Company size: {company_size} employees\n"
            f"- Region: {region}\n\n"
            f"For each prospect, provide:\n"
            f"1. Company name\n"
            f"2. Likely decision maker title\n"
            f"3. Company description (1 sentence)\n"
            f"4. Why they need {our_offer}\n"
            f"5. Personalization hook (recent news, funding, hiring)\n"
            f"Output as JSON: {{\"prospects\": [{{\"company\": ..., \"title\": ..., "
            f"\"description\": ..., \"need\": ..., \"hook\": ...}}]}}"
        )
        search_results = self._search_web(
            f"{target_industry} {company_size} employees {region} companies hiring growing 2026"
        )
        context = "\n".join(f"- {r['title']}: {r['snippet']}" for r in search_results[:5])
        finder_result = self._llm_call(
            f"{finder_prompt}\n\nResearch:\n{context}",
            system_prompt="You find high-quality prospects that match ideal customer profiles.",
        )

        # Agent 2: Email Composer
        composer_prompt = (
            f"You are an Email Composer. Write personalized outreach sequences.\n\n"
            f"Prospects:\n{finder_result['text'][:3000]}\n\n"
            f"Our offer: {our_offer}\n\n"
            f"For each prospect, create a 3-email sequence:\n"
            f"Email 1 (Day 0): Cold intro with personalization hook\n"
            f"Email 2 (Day 3): Value-add follow-up with relevant insight\n"
            f"Email 3 (Day 7): Final nudge with social proof\n\n"
            f"Each email: subject (under 50 chars), body (under 150 words), CTA.\n"
            f"Output as JSON: {{\"sequences\": [{{\"prospect\": ..., \"emails\": "
            f"[{{\"day\": ..., \"subject\": ..., \"body\": ..., \"cta\": ...}}]}}]}}"
        )
        composer_result = self._llm_call(
            composer_prompt,
            system_prompt="You write cold emails that get replies. Short, personal, valuable.",
        )

        # Agent 3: Follow-up Tracker
        tracker_prompt = (
            f"You are a Follow-up Tracker. Create a tracking and follow-up system.\n\n"
            f"Sequences:\n{composer_result['text'][:2000]}\n\n"
            f"Design:\n"
            f"1. Follow-up schedule with exact dates from today\n"
            f"2. Response handling rules (replied, opened, bounced, no response)\n"
            f"3. Escalation criteria (when to call, when to move on)\n"
            f"4. Success metrics to track (open rate, reply rate, meeting rate)\n"
            f"5. A/B test recommendations for subject lines\n"
            f"Output as JSON: {{\"schedule\": [...], \"response_rules\": {{...}}, "
            f"\"escalation\": {{...}}, \"kpis\": [...], \"ab_tests\": [...]}}"
        )
        tracker_result = self._llm_call(
            tracker_prompt,
            system_prompt="You optimize outreach campaigns for maximum reply rates.",
        )

        total_cost = finder_result.get("cost", 0) + composer_result.get("cost", 0) + tracker_result.get("cost", 0)

        return {
            "crew": "outreach",
            "prospects": finder_result["text"],
            "email_sequences": composer_result["text"],
            "tracking_plan": tracker_result["text"],
            "cost": total_cost,
            "model": tracker_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
