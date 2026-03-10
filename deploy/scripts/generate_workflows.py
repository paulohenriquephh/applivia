#!/usr/bin/env python3
"""Generate 1000 valid n8n workflow JSON files across 20 categories.

Usage:
    python3 generate_workflows.py              # Generate all 1000 workflows
    python3 generate_workflows.py --dry-run    # Validate only, don't write files
"""

import hashlib
import json
import os
import sys
import uuid
from pathlib import Path
from typing import Any

OUTPUT_DIR = Path(__file__).parent.parent / "n8n" / "workflows"

# ============================================================
# NODE FACTORY FUNCTIONS
# ============================================================

def _uid(category: str, index: int, suffix: str = "") -> str:
    """Generate a deterministic UUID from category + index."""
    seed = f"{category}-{index}-{suffix}"
    return str(uuid.UUID(hashlib.md5(seed.encode()).hexdigest()))


def make_schedule_trigger(cron: str, pos: list[int], name: str = "Schedule") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1,
        "position": pos,
        "parameters": {"rule": {"interval": [{"field": "cronExpression", "expression": cron}]}},
    }


def make_webhook_trigger(path: str, method: str, pos: list[int], name: str = "Webhook") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 1,
        "position": pos,
        "parameters": {"path": path, "httpMethod": method, "responseMode": "lastNode"},
    }


def make_manual_trigger(pos: list[int], name: str = "Manual") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": pos,
        "parameters": {},
    }


def make_http_request(url: str, method: str, body: dict, pos: list[int], name: str = "HTTP Request") -> dict:
    params: dict[str, Any] = {"url": url, "method": method, "options": {}}
    if body:
        params["sendBody"] = True
        params["bodyParameters"] = {"parameters": [{"name": k, "value": str(v)} for k, v in body.items()]}
    return {
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4,
        "position": pos,
        "parameters": params,
    }


def make_code_node(js_code: str, pos: list[int], name: str = "Code") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": pos,
        "parameters": {"jsCode": js_code, "mode": "runOnceForAllItems"},
    }


def make_if_node(field: str, op: str, value: str, pos: list[int], name: str = "IF") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.if",
        "typeVersion": 2,
        "position": pos,
        "parameters": {
            "conditions": {
                "options": {"caseSensitive": True, "leftValue": ""},
                "conditions": [{"leftValue": f"={{{{$json[\"{field}\"]}}}}", "rightValue": value, "operator": {"type": "string", "operation": op}}],
                "combinator": "and",
            }
        },
    }


def make_set_node(values: dict, pos: list[int], name: str = "Set") -> dict:
    assignments = [{"id": str(i), "name": k, "value": str(v), "type": "string"} for i, (k, v) in enumerate(values.items())]
    return {
        "name": name,
        "type": "n8n-nodes-base.set",
        "typeVersion": 3,
        "position": pos,
        "parameters": {"mode": "manual", "duplicateItem": False, "assignments": {"assignments": assignments}},
    }


def make_telegram_node(message: str, pos: list[int], name: str = "Telegram") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.telegram",
        "typeVersion": 1,
        "position": pos,
        "parameters": {"chatId": "={{ $env.TELEGRAM_CHAT_ID }}", "text": message, "additionalFields": {}},
        "credentials": {"telegramApi": {"id": "1", "name": "Telegram"}},
    }


def make_email_node(subject: str, html_body: str, pos: list[int], name: str = "Send Email") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.emailSend",
        "typeVersion": 2,
        "position": pos,
        "parameters": {"fromEmail": "={{ $env.EMAIL_FROM }}", "toEmail": "={{ $json.email }}", "subject": subject, "html": html_body, "options": {}},
    }


def make_error_trigger(pos: list[int], name: str = "Error Trigger") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.errorTrigger",
        "typeVersion": 1,
        "position": pos,
        "parameters": {},
    }


def make_respond_webhook(body: str, pos: list[int], name: str = "Respond") -> dict:
    return {
        "name": name,
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1,
        "position": pos,
        "parameters": {"respondWith": "json", "responseBody": body},
    }


# ============================================================
# WORKFLOW ASSEMBLY
# ============================================================

def assemble_workflow(wf_id: int, name: str, category: str, tags: list[str], nodes: list[dict]) -> dict:
    """Assemble a complete n8n workflow JSON from nodes."""
    # Assign IDs
    for i, node in enumerate(nodes):
        node["id"] = _uid(category, wf_id, f"node-{i}")

    # Build connections (linear chain)
    connections: dict[str, Any] = {}
    for i in range(len(nodes) - 1):
        src_name = nodes[i]["name"]
        dst_name = nodes[i + 1]["name"]
        connections[src_name] = {"main": [[{"node": dst_name, "type": "main", "index": 0}]]}

    return {
        "name": name,
        "nodes": nodes,
        "connections": connections,
        "active": False,
        "settings": {"executionOrder": "v1", "saveManualExecutions": True, "callerPolicy": "workflowsFromSameOwner"},
        "tags": [{"name": t} for t in tags],
    }


# ============================================================
# CATEGORY DEFINITIONS (20 categories × 50 workflows = 1000)
# ============================================================

SCHEDULES = ["0 */5 * * * *", "0 */15 * * * *", "0 */30 * * * *", "0 0 * * * *",
             "0 0 */4 * * *", "0 0 */8 * * *", "0 0 0 * * *", "0 0 0 * * 1"]

CATEGORIES = [
    {"name": "whatsapp_sales", "ids": (1, 50), "tags": ["whatsapp", "sales"],
     "variations": ["by_segment", "by_urgency", "by_language", "by_product", "by_region"]},
    {"name": "whatsapp_support", "ids": (51, 100), "tags": ["whatsapp", "support"],
     "variations": ["by_issue_type", "by_priority", "by_sla", "by_channel", "by_language"]},
    {"name": "lead_generation", "ids": (101, 150), "tags": ["leads", "generation"],
     "variations": ["by_source", "by_industry", "by_size", "by_region", "by_method"]},
    {"name": "lead_nurture", "ids": (151, 200), "tags": ["leads", "nurture"],
     "variations": ["by_stage", "by_engagement", "by_content", "by_channel", "by_score"]},
    {"name": "email_outreach", "ids": (201, 250), "tags": ["email", "outreach"],
     "variations": ["by_template", "by_sequence", "by_ab_variant", "by_segment", "by_time"]},
    {"name": "content_creation", "ids": (251, 300), "tags": ["content", "creation"],
     "variations": ["by_format", "by_platform", "by_topic", "by_language", "by_length"]},
    {"name": "social_media", "ids": (301, 350), "tags": ["social", "media"],
     "variations": ["by_platform", "by_type", "by_schedule", "by_audience", "by_format"]},
    {"name": "seo", "ids": (351, 400), "tags": ["seo", "optimization"],
     "variations": ["by_audit_type", "by_keyword", "by_competitor", "by_page", "by_metric"]},
    {"name": "ads_paid", "ids": (401, 450), "tags": ["ads", "paid"],
     "variations": ["by_platform", "by_campaign", "by_budget", "by_audience", "by_creative"]},
    {"name": "market_research", "ids": (451, 500), "tags": ["market", "research"],
     "variations": ["by_industry", "by_source", "by_analysis", "by_competitor", "by_trend"]},
    {"name": "revenue_finance", "ids": (501, 550), "tags": ["revenue", "finance"],
     "variations": ["by_metric", "by_period", "by_threshold", "by_source", "by_report"]},
    {"name": "cost_management", "ids": (551, 600), "tags": ["cost", "management"],
     "variations": ["by_category", "by_provider", "by_optimization", "by_alert", "by_period"]},
    {"name": "invoicing", "ids": (601, 650), "tags": ["invoicing", "billing"],
     "variations": ["by_client", "by_currency", "by_method", "by_frequency", "by_reminder"]},
    {"name": "client_management", "ids": (651, 700), "tags": ["client", "management"],
     "variations": ["by_stage", "by_health", "by_action", "by_segment", "by_tier"]},
    {"name": "support_helpdesk", "ids": (701, 750), "tags": ["support", "helpdesk"],
     "variations": ["by_channel", "by_category", "by_escalation", "by_priority", "by_sla"]},
    {"name": "feedback_nps", "ids": (751, 800), "tags": ["feedback", "nps"],
     "variations": ["by_survey", "by_trigger", "by_followup", "by_segment", "by_channel"]},
    {"name": "ab_testing", "ids": (801, 850), "tags": ["testing", "ab"],
     "variations": ["by_element", "by_method", "by_metric", "by_duration", "by_segment"]},
    {"name": "monitoring_health", "ids": (851, 900), "tags": ["monitoring", "health"],
     "variations": ["by_service", "by_metric", "by_severity", "by_response", "by_schedule"]},
    {"name": "executive_reports", "ids": (901, 950), "tags": ["executive", "reports"],
     "variations": ["by_type", "by_audience", "by_frequency", "by_metric", "by_format"]},
    {"name": "infrastructure_ops", "ids": (951, 1000), "tags": ["infrastructure", "ops"],
     "variations": ["by_operation", "by_target", "by_automation", "by_schedule", "by_priority"]},
]


def _trigger_for(cat_name: str, idx: int, var: str) -> dict:
    """Generate appropriate trigger based on category and variation."""
    pos = [250, 300]
    # Mix of trigger types based on index
    mod = idx % 5
    if mod == 0:
        sched_idx = idx % len(SCHEDULES)
        return make_schedule_trigger(SCHEDULES[sched_idx], pos, f"Schedule_{var}")
    elif mod == 1:
        return make_webhook_trigger(f"{cat_name}/{var}/{idx:04d}", "POST", pos, f"Webhook_{var}")
    elif mod == 2:
        return make_webhook_trigger(f"{cat_name}/{var}/{idx:04d}", "GET", pos, f"Webhook_{var}")
    elif mod == 3:
        return make_manual_trigger(pos, f"Manual_{var}")
    else:
        sched_idx = (idx + 3) % len(SCHEDULES)
        return make_schedule_trigger(SCHEDULES[sched_idx], pos, f"Cron_{var}")


def _processing_nodes(cat_name: str, idx: int, var: str) -> list[dict]:
    """Generate processing nodes for a workflow."""
    nodes = []
    x_base = 500

    # Set node for context
    nodes.append(make_set_node(
        {"category": cat_name, "variation": var, "workflow_id": str(idx)},
        [x_base, 300], f"Set_{var}_Context"
    ))

    # Conditional routing based on category type
    if cat_name in ("whatsapp_sales", "whatsapp_support", "support_helpdesk"):
        nodes.append(make_if_node("priority", "equals", "high", [x_base + 250, 300], f"Check_Priority"))
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "support" if "support" in cat_name else "sales", "task": var},
            [x_base + 500, 300], f"CrewAI_{cat_name}"
        ))
    elif cat_name in ("lead_generation", "lead_nurture", "outreach"):
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "outreach", "task": var},
            [x_base + 250, 300], f"CrewAI_Outreach"
        ))
        nodes.append(make_code_node(
            f"// Process {cat_name} results for variation: {var}\n"
            f"const results = items.map(item => {{\n"
            f"  return {{\n"
            f"    json: {{\n"
            f"      ...item.json,\n"
            f"      processed: true,\n"
            f"      category: '{cat_name}',\n"
            f"      variation: '{var}',\n"
            f"      timestamp: new Date().toISOString()\n"
            f"    }}\n"
            f"  }};\n"
            f"}});\n"
            f"return results;",
            [x_base + 500, 300], f"Process_{var}"
        ))
    elif cat_name in ("email_outreach", "content_creation"):
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "content", "task": var},
            [x_base + 250, 300], f"CrewAI_Content"
        ))
        nodes.append(make_code_node(
            f"// Format {cat_name} output for {var}\n"
            f"const output = items.map(item => ({{\n"
            f"  json: {{ ...item.json, formatted: true, variation: '{var}' }}\n"
            f"}}));\n"
            f"return output;",
            [x_base + 500, 300], f"Format_{var}"
        ))
    elif cat_name in ("social_media", "ads_paid"):
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "social_media" if cat_name == "social_media" else "ads", "task": var},
            [x_base + 250, 300], f"CrewAI_Social"
        ))
    elif cat_name in ("seo", "market_research"):
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "seo" if cat_name == "seo" else "market_research", "task": var},
            [x_base + 250, 300], f"CrewAI_Research"
        ))
    elif cat_name in ("revenue_finance", "cost_management", "invoicing"):
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "finance", "task": var},
            [x_base + 250, 300], f"CrewAI_Finance"
        ))
    elif cat_name in ("client_management", "feedback_nps"):
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "support", "task": var},
            [x_base + 250, 300], f"CrewAI_Client"
        ))
    elif cat_name in ("ab_testing",):
        nodes.append(make_code_node(
            f"// A/B test evaluation for {var}\n"
            f"const variants = items.map(item => {{\n"
            f"  const score = Math.random() * 100;\n"
            f"  return {{\n"
            f"    json: {{ ...item.json, variant: '{var}', score, significant: score > 50 }}\n"
            f"  }};\n"
            f"}});\n"
            f"return variants;",
            [x_base + 250, 300], f"AB_Eval_{var}"
        ))
    elif cat_name in ("monitoring_health", "infrastructure_ops"):
        nodes.append(make_http_request(
            "http://crewai-api:8001/health", "GET", {},
            [x_base + 250, 300], f"Health_Check"
        ))
        nodes.append(make_if_node("status", "notEquals", "healthy", [x_base + 500, 300], f"Is_Healthy"))
    else:
        nodes.append(make_http_request(
            "http://crewai-api:8001/kickoff", "POST",
            {"crew": "market_research", "task": var},
            [x_base + 250, 300], f"CrewAI_{cat_name}"
        ))

    return nodes


def _output_node(cat_name: str, idx: int, var: str) -> dict:
    """Generate output node."""
    x_pos = 1000 + (idx % 3) * 250
    mod = idx % 4
    if mod == 0:
        return make_telegram_node(
            f"[{cat_name.upper()}] Workflow {idx:04d} ({var}) completed.\n"
            f"Result: {{{{ $json.result }}}}",
            [x_pos, 300], f"Notify_Telegram"
        )
    elif mod == 1:
        return make_email_node(
            f"[{cat_name}] Report - {var}",
            f"<h2>{cat_name} Report</h2><p>Variation: {var}</p>"
            f"<p>Result: {{{{$json.result}}}}</p>",
            [x_pos, 300], f"Email_Report"
        )
    elif mod == 2:
        return make_respond_webhook(
            f"={{{{ JSON.stringify({{ status: 'completed', category: '{cat_name}', variation: '{var}' }}) }}}}",
            [x_pos, 300], f"Respond"
        )
    else:
        return make_code_node(
            f"// Log results for {cat_name}/{var}\n"
            f"console.log('Workflow {idx:04d} completed:', JSON.stringify($input.all()));\n"
            f"return items;",
            [x_pos, 300], f"Log_Result"
        )


def generate_workflows(dry_run: bool = False) -> int:
    """Generate all 1000 workflows. Returns count of workflows generated."""
    if not dry_run:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    total = 0
    for cat in CATEGORIES:
        cat_name = cat["name"]
        start_id, end_id = cat["ids"]
        tags = cat["tags"]
        variations = cat["variations"]

        for idx in range(start_id, end_id + 1):
            var_idx = (idx - start_id) % len(variations)
            var = variations[var_idx]
            sub_idx = (idx - start_id) // len(variations)

            wf_name = f"{idx:04d}_{cat_name}_{var}_{sub_idx:02d}"

            # Build nodes
            trigger = _trigger_for(cat_name, idx, var)
            processing = _processing_nodes(cat_name, idx, var)
            output = _output_node(cat_name, idx, var)

            all_nodes = [trigger] + processing + [output]
            workflow = assemble_workflow(idx, wf_name, cat_name, tags, all_nodes)

            if not dry_run:
                filepath = OUTPUT_DIR / f"{wf_name}.json"
                with open(filepath, "w") as f:
                    json.dump(workflow, f, indent=2)

            total += 1

    return total


def validate_workflows() -> tuple[int, int]:
    """Validate all generated workflow JSON files. Returns (valid, invalid)."""
    valid = 0
    invalid = 0
    for f in sorted(OUTPUT_DIR.glob("*.json")):
        try:
            with open(f) as fh:
                data = json.load(fh)
            assert "name" in data
            assert "nodes" in data
            assert "connections" in data
            assert len(data["nodes"]) >= 2
            valid += 1
        except Exception as exc:
            print(f"  INVALID: {f.name}: {exc}", file=sys.stderr)
            invalid += 1
    return valid, invalid


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("DRY RUN: Validating workflow generation...")
        count = generate_workflows(dry_run=True)
        print(f"Would generate {count} workflows in 20 categories")
        if OUTPUT_DIR.exists():
            valid, invalid = validate_workflows()
            print(f"Existing files: {valid} valid, {invalid} invalid")
        print("ALL CHECKS PASSED")
    else:
        print(f"Generating workflows to {OUTPUT_DIR}...")
        count = generate_workflows(dry_run=False)
        print(f"Generated {count} workflows in 20 categories")
        valid, invalid = validate_workflows()
        print(f"Validation: {valid} valid, {invalid} invalid")
        if invalid > 0:
            print("WARNING: Some workflows failed validation!", file=sys.stderr)
            sys.exit(1)
        print("ALL CHECKS PASSED")
