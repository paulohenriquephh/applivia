"""
MAESTRO AI ENGINE v3 - Tools
Ferramentas customizadas para os agentes CrewAI
"""

from crewai.tools import Tool

# Import all tools from agents
from ..agents.orchestrator import (
    create_task_tool,
    get_agent_status_tool,
    list_active_agents_tool,
    route_request_tool,
)

from ..agents.import_agent import (
    search_suppliers_tool,
    validate_supplier_tool,
    calculate_import_costs_tool,
    negotiate_price_tool,
    track_shipment_tool,
)

from ..agents.advertising_agent import (
    create_campaign_tool,
    optimize_campaign_tool,
    generate_ad_copy_tool,
    analyze_performance_tool,
    set_budget_tool,
)

from ..agents.luxury_watch_agent import (
    analyze_watch_tool,
    verify_authenticity_tool,
    price_lookup_tool,
    compare_models_tool,
    market_intel_tool,
)

from ..agents.whatsapp_sdr_agent import (
    send_message_tool,
    qualify_lead_tool,
    send_proposal_tool,
    schedule_followup_tool,
    handle_objection_tool,
)

from ..agents.tiktok_growth_agent import (
    generate_content_ideas_tool,
    analyze_trends_tool,
    schedule_post_tool,
    optimize_hashtags_tool,
    analyze_performance_tool as analyze_tiktok_tool,
)

from ..agents.knowledge_sync_agent import (
    sync_qdrant_tool,
    update_prices_tool,
    run_cron_tool,
    backup_knowledge_tool,
    search_knowledge_tool,
)

__all__ = [
    # Orchestrator tools
    "create_task_tool",
    "get_agent_status_tool",
    "list_active_agents_tool",
    "route_request_tool",
    # Import tools
    "search_suppliers_tool",
    "validate_supplier_tool",
    "calculate_import_costs_tool",
    "negotiate_price_tool",
    "track_shipment_tool",
    # Advertising tools
    "create_campaign_tool",
    "optimize_campaign_tool",
    "generate_ad_copy_tool",
    "analyze_performance_tool",
    "set_budget_tool",
    # Luxury Watch tools
    "analyze_watch_tool",
    "verify_authenticity_tool",
    "price_lookup_tool",
    "compare_models_tool",
    "market_intel_tool",
    # WhatsApp SDR tools
    "send_message_tool",
    "qualify_lead_tool",
    "send_proposal_tool",
    "schedule_followup_tool",
    "handle_objection_tool",
    # TikTok Growth tools
    "generate_content_ideas_tool",
    "analyze_trends_tool",
    "schedule_post_tool",
    "optimize_hashtags_tool",
    "analyze_tiktok_tool",
    # Knowledge Sync tools
    "sync_qdrant_tool",
    "update_prices_tool",
    "run_cron_tool",
    "backup_knowledge_tool",
    "search_knowledge_tool",
]
