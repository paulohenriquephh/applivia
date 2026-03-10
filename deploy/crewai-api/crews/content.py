"""Content Crew — Content Writer + SEO Editor + Quality Checker."""

from typing import Any

from crews.base import BaseCrew


class ContentCrew(BaseCrew):
    DESCRIPTION = "Creates, optimizes, and quality-checks content for any platform"
    AGENT_NAMES = ["Content Writer", "SEO Editor", "Quality Checker"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        topic = inputs.get("topic", "AI automation for business")
        content_type = inputs.get("content_type", "blog_post")
        target_audience = inputs.get("target_audience", "business owners")
        keywords = inputs.get("keywords", [])
        word_count = inputs.get("word_count", 1500)
        tone = inputs.get("tone", "professional yet approachable")

        keyword_str = ", ".join(keywords) if keywords else topic

        # Agent 1: Content Writer — create the draft
        writer_prompt = (
            f"You are an expert Content Writer. Write a {content_type} about: {topic}\n"
            f"Target audience: {target_audience}\n"
            f"Tone: {tone}\n"
            f"Target word count: {word_count}\n"
            f"Primary keywords: {keyword_str}\n\n"
            f"Structure with: compelling headline, introduction hook, "
            f"3-5 main sections with subheadings, conclusion with CTA.\n"
            f"Output as JSON: {{\"title\": ..., \"meta_description\": ..., "
            f"\"sections\": [{{\"heading\": ..., \"content\": ...}}], \"cta\": ...}}"
        )
        draft = self._llm_call(
            writer_prompt,
            system_prompt=f"You write engaging {content_type}s that convert. Use data and examples.",
        )

        # Agent 2: SEO Editor — optimize for search
        seo_prompt = (
            f"You are an SEO Editor. Optimize this content for search engines.\n\n"
            f"Draft:\n{draft['text'][:3000]}\n\n"
            f"Target keywords: {keyword_str}\n"
            f"Tasks:\n"
            f"1. Ensure primary keyword appears in title, first paragraph, and 2-3 subheadings\n"
            f"2. Add internal linking suggestions (3-5)\n"
            f"3. Optimize meta description (under 160 chars)\n"
            f"4. Add schema markup suggestions\n"
            f"5. Suggest 5 related long-tail keywords\n"
            f"Output as JSON: {{\"optimized_content\": ..., \"seo_score\": 0-100, "
            f"\"keyword_density\": ..., \"internal_links\": [...], "
            f"\"long_tail_keywords\": [...], \"schema_type\": ...}}"
        )
        seo_result = self._llm_call(
            seo_prompt,
            system_prompt="You are an SEO specialist. Optimize without compromising readability.",
        )

        # Agent 3: Quality Checker — final review
        qa_prompt = (
            f"You are a Quality Checker. Review this content for publication readiness.\n\n"
            f"Content:\n{seo_result['text'][:3000]}\n\n"
            f"Check for:\n"
            f"1. Grammar and spelling errors\n"
            f"2. Factual accuracy (flag any claims needing verification)\n"
            f"3. Readability score (Flesch-Kincaid)\n"
            f"4. Brand voice consistency with tone: {tone}\n"
            f"5. CTA effectiveness\n"
            f"Output as JSON: {{\"approved\": true/false, \"quality_score\": 0-100, "
            f"\"readability_score\": ..., \"issues\": [...], \"suggestions\": [...]}}"
        )
        qa_result = self._llm_call(
            qa_prompt,
            system_prompt="You are a meticulous content quality reviewer.",
        )

        total_cost = draft.get("cost", 0) + seo_result.get("cost", 0) + qa_result.get("cost", 0)

        return {
            "crew": "content",
            "topic": topic,
            "content_type": content_type,
            "draft": draft["text"],
            "seo_optimized": seo_result["text"],
            "quality_review": qa_result["text"],
            "cost": total_cost,
            "model": qa_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
