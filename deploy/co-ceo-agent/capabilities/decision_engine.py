"""Decision-making engine with audit trail using multiple premium models."""

import json
from datetime import datetime, timezone
from typing import Any


class DecisionEngine:
    """Makes business decisions with full audit trail and multi-model cross-reference."""

    def __init__(self, router: Any):
        self.router = router

    async def make_decision(self, situation: str, options: list[str],
                            constraints: str, urgency: str) -> dict:
        """Analyze a situation and make a recommended decision."""
        options_text = "\n".join(f"  {i+1}. {opt}" for i, opt in enumerate(options)) if options else "  (Open-ended — suggest options)"

        # Primary analysis with GPT-5.4
        primary_prompt = (
            f"You are a CO-CEO making a critical business decision.\n\n"
            f"SITUATION: {situation}\n\n"
            f"OPTIONS:\n{options_text}\n\n"
            f"CONSTRAINTS: {constraints if constraints else 'None specified'}\n"
            f"URGENCY: {urgency}\n\n"
            f"Analyze:\n"
            f"1. Pros and cons of each option (or generate 3 options if none given)\n"
            f"2. Risk assessment for each option\n"
            f"3. Expected outcome and confidence level\n"
            f"4. Reversibility of each option\n"
            f"5. Your recommended decision with clear reasoning\n\n"
            f"Output as JSON:\n"
            f"{{\n"
            f'  "recommended_option": "...",\n'
            f'  "confidence": 0-100,\n'
            f'  "reasoning": "...",\n'
            f'  "options_analysis": [{{"option": "...", "pros": [...], "cons": [...], "risk": "low/medium/high", "reversible": true/false}}],\n'
            f'  "expected_outcome": "...",\n'
            f'  "alternative_if_fails": "...",\n'
            f'  "timeline": "..."\n'
            f"}}"
        )

        primary_result = await self.router.call(
            primary_prompt,
            task_type="strategy",
            system_prompt="You are a decisive CEO. Analyze thoroughly but commit to a clear recommendation.",
        )

        # Cross-reference with a fast real-time model for market context
        cross_ref_prompt = (
            f"Quick validation check on this business decision:\n"
            f"Situation: {situation}\n"
            f"Preliminary recommendation:\n{primary_result['text'][:2000]}\n\n"
            f"Are there any critical blind spots, recent market changes, or "
            f"risks not considered? Reply concisely in JSON:\n"
            f"{{\"validation\": \"agree/disagree/partial\", \"blind_spots\": [...], \"additional_context\": \"...\"}}"
        )

        cross_ref_result = await self.router.call(
            cross_ref_prompt,
            task_type="real_time_data",
            system_prompt="You validate business decisions with real-time market awareness.",
        )

        total_cost = primary_result.get("cost", 0) + cross_ref_result.get("cost", 0)

        audit_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "situation": situation,
            "options": options,
            "constraints": constraints,
            "urgency": urgency,
            "primary_analysis": primary_result["text"],
            "primary_model": primary_result["model"],
            "cross_reference": cross_ref_result["text"],
            "cross_ref_model": cross_ref_result["model"],
            "total_cost": total_cost,
        }

        return {
            "decision": primary_result["text"],
            "cross_reference": cross_ref_result["text"],
            "models_used": [primary_result["model"], cross_ref_result["model"]],
            "cost": total_cost,
            "audit_trail": audit_entry,
        }
