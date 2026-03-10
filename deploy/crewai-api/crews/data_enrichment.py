"""Data Enrichment Crew — Data Scraper + Data Cleaner + Data Enricher."""

from typing import Any

from crews.base import BaseCrew


class DataEnrichmentCrew(BaseCrew):
    DESCRIPTION = "Scrapes, cleans, and enriches data from multiple sources"
    AGENT_NAMES = ["Data Scraper", "Data Cleaner", "Data Enricher"]

    def kickoff(self, inputs: dict[str, Any]) -> dict[str, Any]:
        data_source = inputs.get("source", "web")
        query = inputs.get("query", "AI companies in SaaS")
        fields_needed = inputs.get("fields", ["company_name", "website", "industry", "size", "location"])
        num_records = inputs.get("num_records", 20)
        enrichment_type = inputs.get("enrichment", "company_profile")

        # Agent 1: Data Scraper
        scraper_prompt = (
            f"You are a Data Scraper. Find data matching this query: {query}\n"
            f"Source: {data_source}\n"
            f"Fields needed: {', '.join(fields_needed)}\n"
            f"Target records: {num_records}\n\n"
            f"Provide:\n"
            f"1. {num_records} records with the requested fields\n"
            f"2. Data source for each record\n"
            f"3. Confidence score for each record (0-100)\n"
            f"4. Timestamp of data collection\n"
            f"Output as JSON: {{\"records\": [{{<fields>: ..., \"source\": ..., "
            f"\"confidence\": ..., \"collected_at\": ...}}], \"total_found\": ...}}"
        )
        search_results = self._search_web(query)
        context = "\n".join(f"- {r['title']}: {r['snippet']} ({r['link']})" for r in search_results[:8])
        scraper_result = self._llm_call(
            f"{scraper_prompt}\n\nWeb research:\n{context}",
            system_prompt="You extract structured data from unstructured sources with high accuracy.",
        )

        # Agent 2: Data Cleaner
        cleaner_prompt = (
            f"You are a Data Cleaner. Clean and normalize this dataset.\n\n"
            f"Raw data:\n{scraper_result['text'][:3000]}\n\n"
            f"Cleaning tasks:\n"
            f"1. Remove duplicates\n"
            f"2. Standardize formats (names, URLs, locations)\n"
            f"3. Fill missing fields where possible\n"
            f"4. Flag records with low confidence (<60)\n"
            f"5. Validate URLs and email formats\n"
            f"6. Produce data quality report\n"
            f"Output as JSON: {{\"cleaned_records\": [...], \"removed_duplicates\": ..., "
            f"\"filled_fields\": ..., \"flagged_records\": [...], "
            f"\"quality_report\": {{\"total\": ..., \"clean\": ..., \"issues\": ...}}}}"
        )
        cleaner_result = self._llm_call(
            cleaner_prompt,
            system_prompt="You ensure data quality. Every record must be accurate and normalized.",
        )

        # Agent 3: Data Enricher
        enricher_prompt = (
            f"You are a Data Enricher. Enrich the cleaned data with additional context.\n\n"
            f"Cleaned data:\n{cleaner_result['text'][:3000]}\n"
            f"Enrichment type: {enrichment_type}\n\n"
            f"For each record, add:\n"
            f"1. Company description (1-2 sentences)\n"
            f"2. Estimated revenue range\n"
            f"3. Technology stack (if available)\n"
            f"4. Recent news or events\n"
            f"5. Social media presence\n"
            f"6. Lead score (0-100) based on fit with our ideal customer\n"
            f"Output as JSON: {{\"enriched_records\": [{{...original fields..., "
            f"\"description\": ..., \"est_revenue\": ..., \"tech_stack\": [...], "
            f"\"recent_news\": ..., \"social_links\": {{...}}, \"lead_score\": ...}}], "
            f"\"enrichment_summary\": {{\"records_enriched\": ..., \"avg_lead_score\": ...}}}}"
        )
        enricher_result = self._llm_call(
            enricher_prompt,
            system_prompt="You enrich data with actionable business intelligence.",
        )

        total_cost = scraper_result.get("cost", 0) + cleaner_result.get("cost", 0) + enricher_result.get("cost", 0)

        return {
            "crew": "data_enrichment",
            "query": query,
            "raw_data": scraper_result["text"],
            "cleaned_data": cleaner_result["text"],
            "enriched_data": enricher_result["text"],
            "cost": total_cost,
            "model": enricher_result.get("model", "unknown"),
            "agents_used": self.AGENT_NAMES,
        }
