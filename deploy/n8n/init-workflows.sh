#!/usr/bin/env bash
# Import pre-generated workflows into n8n on first boot
set -euo pipefail

WORKFLOW_DIR="/home/node/workflows"
N8N_URL="http://localhost:5678"
MARKER_FILE="/home/node/.n8n/.workflows_imported"

if [ -f "$MARKER_FILE" ]; then
    echo "[init-workflows] Workflows already imported, skipping."
    exit 0
fi

echo "[init-workflows] Waiting for n8n to be ready..."
MAX_WAIT=120
ELAPSED=0
while [ $ELAPSED -lt $MAX_WAIT ]; do
    if wget -qO- "${N8N_URL}/healthz" 2>/dev/null | grep -q "ok"; then
        break
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo "[init-workflows] WARNING: n8n not ready after ${MAX_WAIT}s, skipping import."
    exit 0
fi

API_KEY="${N8N_API_KEY:-}"
if [ -z "$API_KEY" ]; then
    echo "[init-workflows] WARNING: N8N_API_KEY not set, skipping import."
    exit 0
fi

IMPORTED=0
FAILED=0
TOTAL=$(find "$WORKFLOW_DIR" -name "*.json" 2>/dev/null | wc -l)

echo "[init-workflows] Found $TOTAL workflow files to import."

for wf_file in "$WORKFLOW_DIR"/*.json; do
    [ -f "$wf_file" ] || continue
    WF_NAME=$(basename "$wf_file" .json)

    HTTP_CODE=$(wget -qO- \
        --header="X-N8N-API-KEY: ${API_KEY}" \
        --header="Content-Type: application/json" \
        --post-file="$wf_file" \
        --server-response \
        "${N8N_URL}/api/v1/workflows" 2>&1 | grep "HTTP/" | tail -1 | awk '{print $2}')

    if [ "${HTTP_CODE:-0}" = "200" ] || [ "${HTTP_CODE:-0}" = "201" ]; then
        IMPORTED=$((IMPORTED + 1))
    else
        FAILED=$((FAILED + 1))
    fi
done

echo "[init-workflows] Import complete: ${IMPORTED} imported, ${FAILED} failed out of ${TOTAL}"
touch "$MARKER_FILE"
