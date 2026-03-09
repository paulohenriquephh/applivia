#!/bin/bash
# Applivia — Smoke Test Script
# Validates core functionality end-to-end

set -euo pipefail

HOST="${HOST:-localhost}"
PASS=0
FAIL=0

run_test() {
    local name=$1
    local cmd=$2
    local expect=$3

    echo -n "Testing: $name... "
    if result=$(eval "$cmd" 2>/dev/null); then
        if echo "$result" | grep -q "$expect"; then
            echo "PASS"
            PASS=$((PASS + 1))
        else
            echo "FAIL (unexpected response)"
            echo "  Expected to contain: $expect"
            echo "  Got: ${result:0:200}"
            FAIL=$((FAIL + 1))
        fi
    else
        echo "FAIL (command failed)"
        FAIL=$((FAIL + 1))
    fi
}

echo "=== Applivia Smoke Tests ==="
echo "Host: $HOST"
echo "Time: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# 1. Brain API health
run_test "Brain API health" \
    "curl -s http://$HOST:8000/health" \
    "healthy"

# 2. OpenAI Worker health
run_test "OpenAI Worker health" \
    "curl -s http://$HOST:8010/health" \
    "openai-spine"

# 3. Claude Review health
run_test "Claude Review health" \
    "curl -s http://$HOST:8011/health" \
    "claude-review"

# 4. Dashboard API health
run_test "Dashboard API health" \
    "curl -s http://$HOST:3002/health" \
    "healthy"

# 5. Dashboard API overview
run_test "Dashboard API overview" \
    "curl -s http://$HOST:3002/api/overview" \
    "runs_24h"

# 6. LiteLLM health
run_test "LiteLLM health" \
    "curl -s http://$HOST:4000/health" \
    "healthy"

# 7. n8n health
run_test "n8n health" \
    "curl -s http://$HOST:5678/healthz" \
    "ok"

# 8. Langfuse health
run_test "Langfuse health" \
    "curl -s http://$HOST:3100/api/public/health" \
    "ok"

# 9. OpenAI Worker agent list
run_test "OpenAI agents list" \
    "curl -s http://$HOST:8010/agents" \
    "orchestrator"

# 10. Claude Review types
run_test "Claude review types" \
    "curl -s http://$HOST:8011/review-types" \
    "adversarial"

# 11. Dashboard API runs endpoint
run_test "Dashboard runs endpoint" \
    "curl -s http://$HOST:3002/api/runs" \
    "total"

# 12. Dashboard API costs endpoint
run_test "Dashboard costs endpoint" \
    "curl -s http://$HOST:3002/api/costs" \
    "total_cost_usd"

echo ""
echo "=== Results ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo "Total:  $((PASS + FAIL))"

if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo "SMOKE TEST: SOME FAILURES"
    exit 1
fi
echo ""
echo "SMOKE TEST: ALL PASSED"
exit 0
