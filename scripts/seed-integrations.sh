#!/bin/bash
# Applivia — Seed integrations registry
# Registers known integrations in the database

set -euo pipefail

DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-maestroapp}"
DB_USER="${POSTGRES_USER:-maestro}"

echo "=== Seeding Integrations ==="

PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << 'SQL'
INSERT INTO integrations (name, integration_type, status, endpoint) VALUES
  ('OpenAI', 'llm_provider', 'configured', 'https://api.openai.com/v1'),
  ('Anthropic', 'llm_provider', 'configured', 'https://api.anthropic.com'),
  ('DeepSeek', 'llm_provider', 'configured', 'https://api.deepseek.com'),
  ('OpenRouter', 'llm_provider', 'configured', 'https://openrouter.ai/api'),
  ('LiteLLM', 'llm_proxy', 'active', 'http://maestro-litellm:4000'),
  ('Langfuse', 'observability', 'active', 'http://maestro-langfuse:3100'),
  ('n8n', 'automation', 'active', 'http://maestro-n8n:5678'),
  ('PostgreSQL', 'database', 'active', 'maestro-postgres:5432'),
  ('Redis', 'cache', 'active', 'maestro-redis:6379'),
  ('Qdrant', 'vector_db', 'active', 'http://maestro-qdrant:6333'),
  ('Evolution API', 'whatsapp', 'configured', 'http://maestro-evolution:8080'),
  ('Telegram', 'messaging', 'configured', 'https://api.telegram.org'),
  ('Stripe', 'billing', 'configured', 'https://api.stripe.com'),
  ('Resend', 'email', 'configured', 'https://api.resend.com'),
  ('ElevenLabs', 'tts', 'configured', 'https://api.elevenlabs.io'),
  ('Cloudflare', 'cdn_dns', 'configured', 'https://api.cloudflare.com'),
  ('Vercel', 'deployment', 'configured', 'https://api.vercel.com'),
  ('Supabase', 'database', 'configured', 'https://uwjpgjquewwsltczhgnd.supabase.co'),
  ('Zapier MCP', 'automation', 'configured', 'https://mcp.zapier.com/api/mcp/a/22795915/mcp')
ON CONFLICT (name) DO UPDATE SET
  integration_type = EXCLUDED.integration_type,
  status = EXCLUDED.status,
  endpoint = EXCLUDED.endpoint,
  updated_at = NOW();
SQL

echo "Done. Seeded integrations."
