-- ============================================
-- APPLIVIA / MAESTRO AI ENGINE v3
-- Authoritative Ledger Schema
-- Supabase/Postgres
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- JOBS: Defined work units
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    job_type VARCHAR(50) NOT NULL DEFAULT 'agent_task',
    schedule VARCHAR(100), -- cron expression or null for on-demand
    config JSONB DEFAULT '{}',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RUNS: Execution instances of jobs
-- ============================================
CREATE TABLE IF NOT EXISTS runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    agent VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    action VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    duration_ms INTEGER,
    input_summary TEXT,
    output_summary TEXT,
    error_summary TEXT,
    cost_usd NUMERIC(10, 6),
    tokens_input INTEGER,
    tokens_output INTEGER,
    rollback_ref VARCHAR(255),
    evidence_ref VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_runs_job_id ON runs(job_id);
CREATE INDEX IF NOT EXISTS idx_runs_agent ON runs(agent);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at DESC);

-- ============================================
-- EVENTS: System events
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info',
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- ============================================
-- APPROVALS: Human-in-the-loop gates
-- ============================================
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES runs(id) ON DELETE SET NULL,
    request_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    requested_by VARCHAR(100),
    approved_by VARCHAR(100),
    decided_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);

-- ============================================
-- COST_TRACKING: LLM and service costs
-- ============================================
CREATE TABLE IF NOT EXISTS cost_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES runs(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    cost_usd NUMERIC(10, 6) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cost_provider ON cost_tracking(provider);
CREATE INDEX IF NOT EXISTS idx_cost_created_at ON cost_tracking(created_at DESC);

-- ============================================
-- ERRORS: Error log
-- ============================================
CREATE TABLE IF NOT EXISTS errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES runs(id) ON DELETE SET NULL,
    error_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    severity VARCHAR(20) DEFAULT 'error',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolution TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_errors_resolved ON errors(resolved);
CREATE INDEX IF NOT EXISTS idx_errors_created_at ON errors(created_at DESC);

-- ============================================
-- INTEGRATIONS: External service registry
-- ============================================
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    integration_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'unknown',
    endpoint VARCHAR(500),
    last_health_check TIMESTAMPTZ,
    last_health_status VARCHAR(20),
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INCIDENTS: Operational incidents
-- ============================================
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    source VARCHAR(100),
    assigned_to VARCHAR(100),
    resolved_at TIMESTAMPTZ,
    resolution TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);

-- ============================================
-- AUDIT_EVENTS: Immutable audit trail
-- ============================================
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_events(created_at DESC);

-- ============================================
-- DEPLOYMENT_EVENTS: Deploy tracking
-- ============================================
CREATE TABLE IF NOT EXISTS deployment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    environment VARCHAR(50) DEFAULT 'staging',
    status VARCHAR(20) NOT NULL,
    deployed_by VARCHAR(100),
    commit_sha VARCHAR(40),
    rollback_ref VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deploy_service ON deployment_events(service);
CREATE INDEX IF NOT EXISTS idx_deploy_created_at ON deployment_events(created_at DESC);

-- ============================================
-- KNOWLEDGE_SOURCES: Knowledge base registry
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    last_sync TIMESTAMPTZ,
    record_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS (existing, keep compatible)
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    messages JSONB DEFAULT '[]',
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES (existing, keep compatible)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255),
    role VARCHAR(50),
    content TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENT_EXECUTIONS (existing, keep compatible)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_executions (
    id VARCHAR(255) PRIMARY KEY,
    agent_name VARCHAR(100),
    task TEXT,
    result TEXT,
    status VARCHAR(50),
    duration VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIEWS for dashboard
-- ============================================

-- Runs summary last 24h
CREATE OR REPLACE VIEW v_runs_24h AS
SELECT
    agent,
    status,
    COUNT(*) as count,
    AVG(duration_ms) as avg_duration_ms,
    SUM(cost_usd) as total_cost
FROM runs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY agent, status;

-- Runs summary last 7d
CREATE OR REPLACE VIEW v_runs_7d AS
SELECT
    agent,
    status,
    DATE(created_at) as run_date,
    COUNT(*) as count,
    AVG(duration_ms) as avg_duration_ms,
    SUM(cost_usd) as total_cost
FROM runs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY agent, status, DATE(created_at)
ORDER BY run_date DESC;

-- Cost summary by provider
CREATE OR REPLACE VIEW v_costs_by_provider AS
SELECT
    provider,
    model,
    DATE(created_at) as cost_date,
    SUM(tokens_input) as total_tokens_in,
    SUM(tokens_output) as total_tokens_out,
    SUM(cost_usd) as total_cost
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY provider, model, DATE(created_at)
ORDER BY cost_date DESC;

-- Pending approvals
CREATE OR REPLACE VIEW v_pending_approvals AS
SELECT
    a.*,
    r.agent,
    r.action
FROM approvals a
LEFT JOIN runs r ON a.run_id = r.id
WHERE a.status = 'pending'
ORDER BY a.created_at ASC;

-- Open incidents
CREATE OR REPLACE VIEW v_open_incidents AS
SELECT *
FROM incidents
WHERE status IN ('open', 'investigating', 'mitigating')
ORDER BY
    CASE severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END,
    created_at DESC;

-- Integration health
CREATE OR REPLACE VIEW v_integration_health AS
SELECT
    name,
    integration_type,
    status,
    last_health_check,
    last_health_status,
    CASE
        WHEN last_health_check IS NULL THEN 'never_checked'
        WHEN last_health_check < NOW() - INTERVAL '1 hour' THEN 'stale'
        ELSE 'recent'
    END as check_freshness
FROM integrations
ORDER BY name;
