"""Support Crew — Issue Triager + Problem Solver + CSAT Monitor."""

from typing import Any

from crews.base import BaseCrew


class SupportCrew(BaseCrew):
    DESCRIPTION = "Triages issues, resolves problems, and monitors satisfaction"
    AGENT_NAMES = ["Issue Triager", "Problem Solver", "CSAT Monitor"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        issue = inputs.get("issue", "Customer reports feature not working")
        customer_id = inputs.get("customer_id", "unknown")
        channel = inputs.get("channel", "email")
        priority_hint = inputs.get("priority", "medium")
        history = inputs.get("history", "")

        # Agent 1: Issue Triager
        triage_prompt = (
            f"You are an Issue Triager. Classify and prioritize this support ticket.\n\n"
            f"Issue: {issue}\n"
            f"Customer ID: {customer_id}\n"
            f"Channel: {channel}\n"
            f"Suggested priority: {priority_hint}\n"
            f"History: {history[:500] if history else 'No prior history'}\n\n"
            f"Determine:\n"
            f"1. Category (bug, feature_request, billing, account, how_to, outage)\n"
            f"2. Priority (critical, high, medium, low)\n"
            f"3. Estimated resolution time\n"
            f"4. Required team (engineering, billing, account_management, self_service)\n"
            f"5. Sentiment analysis of the customer message\n"
            f"Output as JSON: {{\"category\": ..., \"priority\": ..., \"eta_hours\": ..., "
            f"\"team\": ..., \"sentiment\": ..., \"escalate\": true/false, \"tags\": [...]}}"
        )
        triage_result = self._llm_call(
            triage_prompt,
            system_prompt="You are an expert at support ticket triage. Be fast and accurate.",
        )

        # Agent 2: Problem Solver
        solver_prompt = (
            f"You are a Problem Solver. Resolve this support issue.\n\n"
            f"Issue: {issue}\n"
            f"Triage result:\n{triage_result['text'][:1500]}\n\n"
            f"Provide:\n"
            f"1. Root cause analysis (most likely cause)\n"
            f"2. Step-by-step resolution\n"
            f"3. Customer-facing response (empathetic, clear, actionable)\n"
            f"4. Internal notes for the team\n"
            f"5. Preventive measures to avoid recurrence\n"
            f"Output as JSON: {{\"root_cause\": ..., \"resolution_steps\": [...], "
            f"\"customer_response\": ..., \"internal_notes\": ..., \"prevention\": [...]}}"
        )
        solver_result = self._llm_call(
            solver_prompt,
            system_prompt="You resolve support issues with empathy and technical skill.",
        )

        # Agent 3: CSAT Monitor
        csat_prompt = (
            f"You are a CSAT Monitor. Evaluate the quality of this support interaction.\n\n"
            f"Original issue: {issue}\n"
            f"Resolution:\n{solver_result['text'][:2000]}\n\n"
            f"Assess:\n"
            f"1. Predicted CSAT score (1-5)\n"
            f"2. Response quality score (1-100)\n"
            f"3. Empathy score (1-100)\n"
            f"4. Resolution completeness (1-100)\n"
            f"5. Follow-up needed? What and when?\n"
            f"6. Improvement suggestions for the response\n"
            f"Output as JSON: {{\"predicted_csat\": ..., \"quality_score\": ..., "
            f"\"empathy_score\": ..., \"completeness\": ..., \"follow_up\": {{\"needed\": ..., "
            f"\"action\": ..., \"when\": ...}}, \"improvements\": [...]}}"
        )
        csat_result = self._llm_call(
            csat_prompt,
            system_prompt="You ensure every customer interaction exceeds expectations.",
        )

        total_cost = triage_result.get("cost", 0) + solver_result.get("cost", 0) + csat_result.get("cost", 0)

        return {
            "crew": "support",
            "issue": issue,
            "triage": triage_result["text"],
            "resolution": solver_result["text"],
            "csat_assessment": csat_result["text"],
            "cost": total_cost,
            "model": csat_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
