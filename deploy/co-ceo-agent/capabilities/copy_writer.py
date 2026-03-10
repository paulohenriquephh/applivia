"""Marketing copy writer using Claude Opus for persuasive content."""

from typing import Any


class CopyWriter:
    """Writes marketing copy, emails, ads, and persuasive content."""

    def __init__(self, router: Any):
        self.router = router

    async def write(self, brief: str, copy_type: str = "email",
                    tone: str = "professional", audience: str = "business owners") -> dict:
        """Generate marketing copy based on a brief."""
        type_instructions = {
            "email": (
                "Write a complete email. Include: subject line (A/B variants), "
                "preview text, body with clear CTA. Under 300 words."
            ),
            "landing_page": (
                "Write landing page copy: headline, subheadline, 3 benefit blocks, "
                "social proof section, FAQ (3 questions), and CTA."
            ),
            "ad": (
                "Write ad copy for Google Ads and Meta Ads. Include: "
                "3 headline variants (30 char max), 2 descriptions (90 char max), "
                "display URL suggestion, and 3 CTA variants."
            ),
            "social": (
                "Write social media posts for LinkedIn, Twitter/X, and Instagram. "
                "Respect platform character limits. Include hashtags."
            ),
            "sales_page": (
                "Write a long-form sales page: attention-grabbing headline, "
                "problem-agitation-solution flow, testimonial sections, "
                "guarantee section, pricing justification, and urgency CTA."
            ),
            "press_release": (
                "Write a press release: headline, dateline, lead paragraph, "
                "body (3 paragraphs), quote from spokesperson, boilerplate."
            ),
        }

        prompt = (
            f"You are a world-class copywriter. Write the following:\n\n"
            f"Type: {copy_type}\n"
            f"Brief: {brief}\n"
            f"Tone: {tone}\n"
            f"Target audience: {audience}\n\n"
            f"Instructions: {type_instructions.get(copy_type, type_instructions['email'])}\n\n"
            f"Output as JSON with keys: copy (the main content), variants (alternative versions), "
            f"notes (strategic reasoning behind your choices)."
        )

        result = await self.router.call(
            prompt,
            task_type="marketing_copy",
            system_prompt="You write copy that converts. Every word earns its place. Be persuasive, specific, and clear.",
        )

        return {
            "copy_type": copy_type,
            "brief": brief,
            "result": result["text"],
            "model": result["model"],
            "cost": result.get("cost", 0),
        }
