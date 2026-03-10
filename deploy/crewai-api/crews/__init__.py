"""Auto-discover and register all crew modules."""

from typing import Any, Callable

from models import CrewListItem

_CREW_REGISTRY: dict[str, Any] = {}


def _register_crews() -> None:
    """Import and register all crew modules."""
    from crews.market_research import MarketResearchCrew
    from crews.content import ContentCrew
    from crews.sales import SalesCrew
    from crews.ads import AdsCrew
    from crews.support import SupportCrew
    from crews.finance import FinanceCrew
    from crews.outreach import OutreachCrew
    from crews.social_media import SocialMediaCrew
    from crews.seo import SEOCrew
    from crews.data_enrichment import DataEnrichmentCrew

    _CREW_REGISTRY["market_research"] = MarketResearchCrew
    _CREW_REGISTRY["content"] = ContentCrew
    _CREW_REGISTRY["sales"] = SalesCrew
    _CREW_REGISTRY["ads"] = AdsCrew
    _CREW_REGISTRY["support"] = SupportCrew
    _CREW_REGISTRY["finance"] = FinanceCrew
    _CREW_REGISTRY["outreach"] = OutreachCrew
    _CREW_REGISTRY["social_media"] = SocialMediaCrew
    _CREW_REGISTRY["seo"] = SEOCrew
    _CREW_REGISTRY["data_enrichment"] = DataEnrichmentCrew


def get_crew_runner(crew_name: str, task: str, llm_router: Any) -> Callable:
    """Get a callable that runs the specified crew."""
    if not _CREW_REGISTRY:
        _register_crews()

    crew_class = _CREW_REGISTRY.get(crew_name)
    if not crew_class:
        raise ValueError(f"Unknown crew: {crew_name}")

    def runner(inputs: dict) -> dict:
        crew_instance = crew_class(llm_router=llm_router)
        return crew_instance.kickoff(inputs)

    return runner


def list_crews() -> list[CrewListItem]:
    """List all registered crews with their metadata."""
    if not _CREW_REGISTRY:
        _register_crews()

    result = []
    for name, cls in _CREW_REGISTRY.items():
        instance = cls.__new__(cls)
        agents = getattr(cls, "AGENT_NAMES", ["agent_1", "agent_2", "agent_3"])
        description = getattr(cls, "DESCRIPTION", f"{name} crew")
        result.append(CrewListItem(name=name, agents=agents, description=description))
    return result
