"""Social Media Crew — Content Creator + Post Scheduler + Engagement Analyst."""

from typing import Any

from crews.base import BaseCrew


class SocialMediaCrew(BaseCrew):
    DESCRIPTION = "Creates social content, schedules posts, and analyzes engagement"
    AGENT_NAMES = ["Content Creator", "Post Scheduler", "Engagement Analyst"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        brand = inputs.get("brand", "AI Agent Factory")
        platforms = inputs.get("platforms", ["twitter", "linkedin", "instagram"])
        topics = inputs.get("topics", ["AI automation", "productivity", "business growth"])
        tone = inputs.get("tone", "authoritative yet approachable")
        posts_per_week = inputs.get("posts_per_week", 5)

        # Agent 1: Content Creator
        creator_prompt = (
            f"You are a Social Media Content Creator for {brand}.\n"
            f"Platforms: {', '.join(platforms)}\n"
            f"Topics: {', '.join(topics)}\n"
            f"Tone: {tone}\n"
            f"Posts per week: {posts_per_week}\n\n"
            f"Create a 1-week content calendar with {posts_per_week} posts.\n"
            f"For each post:\n"
            f"1. Platform-specific copy (respect character limits)\n"
            f"2. Hashtags (5-10 per post)\n"
            f"3. Visual description (what image/video to create)\n"
            f"4. Content type (educational, entertaining, promotional, engaging)\n"
            f"Output as JSON: {{\"week_content\": [{{\"day\": ..., \"platform\": ..., "
            f"\"copy\": ..., \"hashtags\": [...], \"visual\": ..., \"type\": ...}}]}}"
        )
        content_result = self._llm_call(
            creator_prompt,
            system_prompt="You create viral social media content. Every post drives engagement.",
        )

        # Agent 2: Post Scheduler
        scheduler_prompt = (
            f"You are a Post Scheduler. Optimize posting times.\n\n"
            f"Content plan:\n{content_result['text'][:2500]}\n\n"
            f"Platforms: {', '.join(platforms)}\n\n"
            f"Determine:\n"
            f"1. Optimal posting time per platform per day (in UTC)\n"
            f"2. Best days of week per platform\n"
            f"3. Posting frequency limits (avoid spamming)\n"
            f"4. Cross-posting strategy (what to adapt vs share directly)\n"
            f"5. Queue structure for the week\n"
            f"Output as JSON: {{\"optimal_times\": {{\"<platform>\": {{\"<day>\": ...}}}}, "
            f"\"frequency_limits\": {{...}}, \"cross_post_rules\": [...], "
            f"\"weekly_queue\": [{{\"datetime_utc\": ..., \"platform\": ..., \"post_id\": ...}}]}}"
        )
        schedule_result = self._llm_call(
            scheduler_prompt,
            system_prompt="You optimize social media scheduling based on platform algorithms.",
        )

        # Agent 3: Engagement Analyst
        analyst_prompt = (
            f"You are an Engagement Analyst. Set benchmarks and KPIs.\n\n"
            f"Content plan:\n{content_result['text'][:1500]}\n"
            f"Schedule:\n{schedule_result['text'][:1500]}\n\n"
            f"Provide:\n"
            f"1. Expected engagement rates per platform\n"
            f"2. KPIs to track (impressions, engagement, clicks, follows)\n"
            f"3. Competitor benchmarks for these platforms\n"
            f"4. Content optimization suggestions based on trends\n"
            f"5. Engagement response templates (replies to comments)\n"
            f"Output as JSON: {{\"benchmarks\": {{...}}, \"kpis\": [...], "
            f"\"competitor_comparison\": {{...}}, \"optimizations\": [...], "
            f"\"response_templates\": {{\"positive\": ..., \"negative\": ..., \"question\": ...}}}}"
        )
        analyst_result = self._llm_call(
            analyst_prompt,
            system_prompt="You analyze social media metrics and optimize for growth.",
        )

        total_cost = content_result.get("cost", 0) + schedule_result.get("cost", 0) + analyst_result.get("cost", 0)

        return {
            "crew": "social_media",
            "brand": brand,
            "content_plan": content_result["text"],
            "schedule": schedule_result["text"],
            "engagement_analysis": analyst_result["text"],
            "cost": total_cost,
            "model": analyst_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
