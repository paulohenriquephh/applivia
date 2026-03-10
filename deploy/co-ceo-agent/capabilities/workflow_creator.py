"""Create n8n workflows via REST API."""

import uuid
from typing import Any

import httpx


class WorkflowCreator:
    """Creates n8n workflows programmatically via the n8n REST API."""

    def __init__(self, n8n_url: str, api_key: str, router: Any):
        self.n8n_url = n8n_url.rstrip("/")
        self.api_key = api_key
        self.router = router

    async def create(self, name: str, description: str, trigger_type: str,
                     nodes: list[dict]) -> dict:
        """Generate and deploy an n8n workflow."""
        if not nodes:
            nodes = await self._generate_nodes(description, trigger_type)

        workflow_json = self._build_workflow(name, nodes)

        if self.api_key:
            deploy_result = await self._deploy(workflow_json)
        else:
            deploy_result = {"deployed": False, "reason": "No N8N_API_KEY configured"}

        return {
            "name": name,
            "description": description,
            "trigger_type": trigger_type,
            "node_count": len(workflow_json["nodes"]),
            "workflow_json": workflow_json,
            "deploy_result": deploy_result,
        }

    async def _generate_nodes(self, description: str, trigger_type: str) -> list[dict]:
        """Use LLM to generate node specifications from a description."""
        prompt = (
            f"Generate n8n workflow nodes for: {description}\n"
            f"Trigger type: {trigger_type}\n\n"
            f"Return a JSON array of node specs. Each node:\n"
            f"{{\"type\": \"n8n-nodes-base.XXX\", \"name\": \"...\", \"parameters\": {{...}}}}\n"
            f"Valid types: scheduleTrigger, webhook, httpRequest, code, if, set, "
            f"telegram, emailSend, noOp, merge, switch\n"
            f"Return ONLY the JSON array, no explanation."
        )
        result = await self.router.call(prompt, task_type="coding")

        import json
        try:
            return json.loads(result["text"])
        except (json.JSONDecodeError, KeyError):
            return [
                {"type": f"n8n-nodes-base.{trigger_type}", "name": "Trigger", "parameters": {}},
                {"type": "n8n-nodes-base.code", "name": "Process", "parameters": {"jsCode": "return items;"}},
            ]

    def _build_workflow(self, name: str, nodes: list[dict]) -> dict:
        """Build a complete n8n workflow JSON from node specs."""
        wf_nodes = []
        connections: dict[str, Any] = {}

        for i, node_spec in enumerate(nodes):
            node_id = str(uuid.uuid4())
            node = {
                "id": node_id,
                "name": node_spec.get("name", f"Node_{i}"),
                "type": node_spec.get("type", "n8n-nodes-base.noOp"),
                "typeVersion": 1,
                "position": [250 * i, 300],
                "parameters": node_spec.get("parameters", {}),
            }
            wf_nodes.append(node)

            if i > 0:
                prev_name = nodes[i - 1].get("name", f"Node_{i - 1}")
                curr_name = node_spec.get("name", f"Node_{i}")
                connections[prev_name] = {
                    "main": [[{"node": curr_name, "type": "main", "index": 0}]]
                }

        return {
            "name": name,
            "nodes": wf_nodes,
            "connections": connections,
            "active": False,
            "settings": {
                "executionOrder": "v1",
                "saveManualExecutions": True,
            },
        }

    async def _deploy(self, workflow_json: dict) -> dict:
        """Deploy workflow to n8n via REST API."""
        headers = {"X-N8N-API-KEY": self.api_key, "Content-Type": "application/json"}
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"{self.n8n_url}/api/v1/workflows",
                    headers=headers,
                    json=workflow_json,
                    timeout=30,
                )
                resp.raise_for_status()
                data = resp.json()
                wf_id = data.get("id")

                if wf_id:
                    await client.patch(
                        f"{self.n8n_url}/api/v1/workflows/{wf_id}",
                        headers=headers,
                        json={"active": True},
                        timeout=10,
                    )

                return {"deployed": True, "workflow_id": wf_id}
        except Exception as exc:
            return {"deployed": False, "error": str(exc)}
