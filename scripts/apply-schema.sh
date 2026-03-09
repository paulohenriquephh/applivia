#!/bin/bash
# Applivia — Apply Database Schema
# Applies sql/schema.sql to the PostgreSQL database

set -euo pipefail

DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-maestroapp}"
DB_USER="${POSTGRES_USER:-maestro}"

echo "=== Applying Schema ==="
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_FILE="$SCRIPT_DIR/../sql/schema.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
    echo "ERROR: Schema file not found at $SCHEMA_FILE"
    exit 1
fi

echo "Applying $SCHEMA_FILE..."
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE"

echo ""
echo "=== Schema Applied Successfully ==="

# Verify tables
echo ""
echo "=== Verifying Tables ==="
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
"

echo ""
echo "=== Verifying Views ==="
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;
"
