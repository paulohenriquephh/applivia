"""SEO Crew — Technical Auditor + Link Builder + Content Optimizer."""

from typing import Any

from crews.base import BaseCrew


class SEOCrew(BaseCrew):
    DESCRIPTION = "Audits technical SEO, builds link strategies, and optimizes content"
    AGENT_NAMES = ["Technical Auditor", "Link Builder", "Content Optimizer"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        domain = inputs.get("domain", "example.com")
        target_keywords = inputs.get("keywords", ["AI automation", "business AI"])
        competitors = inputs.get("competitors", [])
        current_rank = inputs.get("current_rank", "not ranking")

        # Agent 1: Technical Auditor
        auditor_prompt = (
            f"You are a Technical SEO Auditor. Audit the site: {domain}\n"
            f"Target keywords: {', '.join(target_keywords)}\n"
            f"Current ranking: {current_rank}\n\n"
            f"Audit these areas:\n"
            f"1. Site speed (estimate based on common issues)\n"
            f"2. Mobile-friendliness checklist\n"
            f"3. Crawlability (robots.txt, sitemap, canonical tags)\n"
            f"4. Schema markup recommendations\n"
            f"5. Core Web Vitals optimization tips\n"
            f"6. Common technical issues to check\n"
            f"Output as JSON: {{\"speed_issues\": [...], \"mobile_checklist\": [...], "
            f"\"crawlability\": {{...}}, \"schema_recommendations\": [...], "
            f"\"core_web_vitals\": {{...}}, \"issues_found\": [...], \"score\": 0-100}}"
        )
        search_data = self._search_web(f"site:{domain}")
        context = "\n".join(f"- {r['title']}: {r['snippet']}" for r in search_data[:3])
        audit_result = self._llm_call(
            f"{auditor_prompt}\n\nSite data:\n{context}",
            system_prompt="You are a technical SEO expert. Be thorough and actionable.",
        )

        # Agent 2: Link Builder
        link_prompt = (
            f"You are a Link Building Strategist for {domain}.\n"
            f"Keywords: {', '.join(target_keywords)}\n"
            f"Competitors: {', '.join(competitors) if competitors else 'Unknown'}\n\n"
            f"Create a link building strategy:\n"
            f"1. 10 link building tactics ranked by ROI\n"
            f"2. Prospect types (blogs, directories, partnerships, HARO)\n"
            f"3. Outreach templates (guest post pitch, resource page, broken link)\n"
            f"4. Competitor backlink gaps to exploit\n"
            f"5. Monthly link building targets\n"
            f"Output as JSON: {{\"tactics\": [{{\"name\": ..., \"roi\": ..., \"difficulty\": ...}}], "
            f"\"prospect_types\": [...], \"templates\": {{...}}, "
            f"\"competitor_gaps\": [...], \"monthly_targets\": {{...}}}}"
        )
        link_result = self._llm_call(
            link_prompt,
            system_prompt="You build high-quality backlinks that move rankings.",
        )

        # Agent 3: Content Optimizer
        optimizer_prompt = (
            f"You are an SEO Content Optimizer for {domain}.\n"
            f"Keywords: {', '.join(target_keywords)}\n"
            f"Technical audit:\n{audit_result['text'][:1500]}\n\n"
            f"Provide:\n"
            f"1. Content gap analysis (what competitors rank for that we don't)\n"
            f"2. Top 10 content ideas with search volume estimates\n"
            f"3. On-page optimization checklist for existing pages\n"
            f"4. Internal linking strategy\n"
            f"5. Content refresh priorities (which old content to update)\n"
            f"Output as JSON: {{\"content_gaps\": [...], \"content_ideas\": "
            f"[{{\"topic\": ..., \"est_volume\": ..., \"difficulty\": ..., \"priority\": ...}}], "
            f"\"onpage_checklist\": [...], \"internal_linking\": {{...}}, \"refresh_priorities\": [...]}}"
        )
        optimizer_result = self._llm_call(
            optimizer_prompt,
            system_prompt="You optimize content for search visibility and user intent.",
        )

        total_cost = audit_result.get("cost", 0) + link_result.get("cost", 0) + optimizer_result.get("cost", 0)

        return {
            "crew": "seo",
            "domain": domain,
            "technical_audit": audit_result["text"],
            "link_strategy": link_result["text"],
            "content_optimization": optimizer_result["text"],
            "cost": total_cost,
            "model": optimizer_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
