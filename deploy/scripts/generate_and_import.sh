#!/usr/bin/env bash
# Generate 1000 workflows and bulk-import them via n8n REST API
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
WORKFLOW_DIR="${DEPLOY_DIR}/n8n/workflows"
N8N_URL="${N8N_API_URL:-http://localhost:5678}"
API_KEY="${N8N_API_KEY:-}"

log() { echo "[$(date '+%H:%M:%S')] $*"; }

# Step 1: Generate workflows
log "Step 1: Generating workflows..."
python3 "${SCRIPT_DIR}/generate_workflows.py"
TOTAL=$(find "$WORKFLOW_DIR" -name "*.json" | wc -l)
log "Generated $TOTAL workflow files."

# Step 2: Wait for n8n
log "Step 2: Waiting for n8n to be healthy..."
MAX_WAIT=120
ELAPSED=0
while [ $ELAPSED -lt $MAX_WAIT ]; do
    if curl -sf "${N8N_URL}/healthz" >/dev/null 2>&1; then
        log "n8n is healthy."
        break
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done
if [ $ELAPSED -ge $MAX_WAIT ]; then
    log "ERROR: n8n not ready after ${MAX_WAIT}s"
    exit 1
fi

# Step 3: Check API key
if [ -z "$API_KEY" ]; then
    log "WARNING: N8N_API_KEY not set. Set it to enable import."
    log "Workflows are saved to $WORKFLOW_DIR for manual import."
    exit 0
fi

# Step 4: Import workflows
log "Step 3: Importing $TOTAL workflows..."
IMPORTED=0
FAILED=0
ACTIVATED=0

for wf_file in "$WORKFLOW_DIR"/*.json; do
    [ -f "$wf_file" ] || continue
    WF_NAME=$(basename "$wf_file" .json)

    RESPONSE=$(curl -sf -X POST "${N8N_URL}/api/v1/workflows" \
        -H "X-N8N-API-KEY: ${API_KEY}" \
        -H "Content-Type: application/json" \
        -d @"$wf_file" 2>&1) || true

    WF_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

    if [ -n "$WF_ID" ]; then
        IMPORTED=$((IMPORTED + 1))

        # Activate the workflow
        ACTIVATE=$(curl -sf -X PATCH "${N8N_URL}/api/v1/workflows/${WF_ID}" \
            -H "X-N8N-API-KEY: ${API_KEY}" \
            -H "Content-Type: application/json" \
            -d '{"active": true}' 2>&1) || true

        IS_ACTIVE=$(echo "$ACTIVATE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('active',False))" 2>/dev/null || echo "false")
        if [ "$IS_ACTIVE" = "True" ]; then
            ACTIVATED=$((ACTIVATED + 1))
        fi
    else
        FAILED=$((FAILED + 1))
    fi

    # Progress every 100
    DONE=$((IMPORTED + FAILED))
    if [ $((DONE % 100)) -eq 0 ] && [ $DONE -gt 0 ]; then
        log "  Progress: $DONE / $TOTAL (imported: $IMPORTED, failed: $FAILED)"
    fi
done

log "=== Import Summary ==="
log "Total files: $TOTAL"
log "Imported: $IMPORTED"
log "Activated: $ACTIVATED"
log "Failed: $FAILED"
