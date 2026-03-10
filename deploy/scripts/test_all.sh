#!/usr/bin/env bash
# Validate the entire Singularity V6 repository
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DEPLOY_DIR"

ERRORS=0
log() { echo "[CHECK] $*"; }
fail() { echo "[FAIL] $*"; ERRORS=$((ERRORS + 1)); }
pass() { echo "[PASS] $*"; }

log "=== Singularity V6 — Full Validation ==="

# 1. Python syntax check
log "Checking Python files..."
PY_COUNT=0
PY_FAIL=0
while IFS= read -r f; do
    PY_COUNT=$((PY_COUNT + 1))
    if ! python3 -m py_compile "$f" 2>/dev/null; then
        fail "Python syntax error: $f"
        PY_FAIL=$((PY_FAIL + 1))
    fi
done < <(find . -name "*.py" -not -path "./n8n/workflows/*")
if [ $PY_FAIL -eq 0 ]; then
    pass "$PY_COUNT Python files compile OK"
fi

# 2. JSON syntax check
log "Checking JSON files..."
JSON_COUNT=0
JSON_FAIL=0
while IFS= read -r f; do
    JSON_COUNT=$((JSON_COUNT + 1))
    if ! python3 -m json.tool "$f" >/dev/null 2>&1; then
        fail "JSON parse error: $f"
        JSON_FAIL=$((JSON_FAIL + 1))
    fi
done < <(find . -name "*.json" | head -100)
if [ $JSON_FAIL -eq 0 ]; then
    pass "$JSON_COUNT JSON files parse OK (sampled)"
fi

# 3. YAML syntax check
log "Checking YAML files..."
YAML_FAIL=0
python3 -c "
import yaml, glob, sys
errors = 0
for f in glob.glob('**/*.yml', recursive=True):
    try:
        yaml.safe_load(open(f))
    except Exception as e:
        print(f'YAML error: {f}: {e}', file=sys.stderr)
        errors += 1
sys.exit(errors)
" 2>&1 || YAML_FAIL=1
if [ $YAML_FAIL -eq 0 ]; then
    pass "All YAML files parse OK"
else
    fail "YAML parse errors found"
fi

# 4. Shell script syntax
log "Checking shell scripts..."
SH_FAIL=0
while IFS= read -r f; do
    if ! bash -n "$f" 2>/dev/null; then
        fail "Shell syntax error: $f"
        SH_FAIL=$((SH_FAIL + 1))
    fi
done < <(find . -name "*.sh")
if [ $SH_FAIL -eq 0 ]; then
    pass "All shell scripts pass syntax check"
fi

# 5. No forbidden patterns
log "Checking for forbidden patterns..."
FORBIDDEN=$(grep -rn 'TODO\|FIXME\|HACK\|XXX\|placeholder\|implement later\|add logic here' \
    --include="*.py" --include="*.sh" --include="*.yml" . 2>/dev/null | grep -v "test_all.sh" | grep -v "generate_workflows.py" || true)
if [ -n "$FORBIDDEN" ]; then
    echo "$FORBIDDEN"
    fail "Forbidden patterns found (TODO/FIXME/placeholder)"
else
    pass "No forbidden patterns found"
fi

# 6. No hardcoded secrets
log "Checking for hardcoded secrets..."
SECRETS=$(grep -rn 'sk-[a-zA-Z0-9]\{20,\}\|sk-ant-[a-zA-Z0-9]\{20,\}' \
    --include="*.py" --include="*.sh" --include="*.yml" . 2>/dev/null | grep -v '.env' || true)
if [ -n "$SECRETS" ]; then
    echo "$SECRETS"
    fail "Hardcoded secrets found"
else
    pass "No hardcoded secrets found"
fi

# 7. File count check
log "Counting files..."
TOTAL_FILES=$(find . -type f -not -path "./.git/*" -not -path "./n8n/workflows/*" | wc -l)
PY_FILES=$(find . -name "*.py" -not -path "./n8n/workflows/*" | wc -l)
JSON_FILES=$(find . -name "*.json" -not -path "./n8n/workflows/*" | wc -l)
SH_FILES=$(find . -name "*.sh" | wc -l)
MD_FILES=$(find . -name "*.md" | wc -l)
echo "  Total files: $TOTAL_FILES"
echo "  Python: $PY_FILES | JSON: $JSON_FILES | Shell: $SH_FILES | Markdown: $MD_FILES"

if [ "$TOTAL_FILES" -lt 80 ]; then
    fail "Expected 84+ files, found $TOTAL_FILES"
else
    pass "File count OK ($TOTAL_FILES files)"
fi

# 8. Workflow generator check
log "Testing workflow generator (dry-run)..."
if python3 scripts/generate_workflows.py --dry-run 2>&1; then
    pass "Workflow generator dry-run OK"
else
    fail "Workflow generator dry-run failed"
fi

# Summary
echo ""
echo "=== VALIDATION SUMMARY ==="
if [ $ERRORS -eq 0 ]; then
    echo "ALL CHECKS PASSED"
    exit 0
else
    echo "FAILED: $ERRORS check(s) failed"
    exit 1
fi
