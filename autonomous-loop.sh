#!/bin/bash
# autonomous-loop.sh — Roda Claude Code em loop até completar tudo

MAX_ITERATIONS=50
SESSION_NAME="singularity-v6"
PROMPT_FILE="./CODEX_SINGULARITY_V6_FINAL.md"
COMPLETION_MARKER="ALL_FILES_CREATED"
ITERATION=0

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))
    echo "[$(date)] Iteration $ITERATION / $MAX_ITERATIONS"

    # Rodar Claude Code com skip-permissions + session persistente
    OUTPUT=$(claude --dangerously-skip-permissions \
        --resume "$SESSION_NAME" \
        --max-turns 200 \
        -p "$(cat $PROMPT_FILE)

Continue from where you left off. Check which files still need
to be created. Create them. When ALL files exist and pass
verification, output exactly: $COMPLETION_MARKER" 2>&1)

    echo "$OUTPUT" >> "logs/iteration_${ITERATION}.log"

    # Checar se completou
    if echo "$OUTPUT" | grep -q "$COMPLETION_MARKER"; then
        echo "[$(date)] ✅ COMPLETED at iteration $ITERATION"
        exit 0
    fi

    echo "[$(date)] Not done yet. Continuing..."
    sleep 5
done

echo "[$(date)] ❌ Max iterations reached"
