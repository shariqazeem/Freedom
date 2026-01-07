-- =============================================================================
-- Kyvern Shield Database Schema
-- Supabase PostgreSQL Migration
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Users Table
-- =============================================================================
-- Stores user accounts. In production, this would integrate with Supabase Auth.

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- API Keys Table
-- =============================================================================
-- Stores hashed API keys for authentication.
-- Raw keys are NEVER stored - only SHA-256 hashes.

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL UNIQUE,  -- SHA-256 hash of the API key
    key_prefix TEXT NOT NULL,       -- First 7 chars for identification (sk_live_)
    name TEXT NOT NULL DEFAULT 'Default Key',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,         -- NULL if active, set when revoked

    -- Constraints
    CONSTRAINT api_keys_name_length CHECK (char_length(name) <= 100)
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);

-- Trigger to auto-update last_used_at (called explicitly from application)
-- This is optional - we'll handle this in the application layer

-- =============================================================================
-- API Key Usage Logs (Optional - for analytics)
-- =============================================================================
-- Track API key usage for rate limiting and analytics.

CREATE TABLE IF NOT EXISTS api_key_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_ip TEXT,
    user_agent TEXT,
    response_status INTEGER,
    response_time_ms REAL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for time-based queries and rate limiting
CREATE INDEX IF NOT EXISTS idx_api_key_usage_key_time
    ON api_key_usage(api_key_id, created_at DESC);

-- Partition by time for efficient cleanup (optional - for high-volume)
-- In production, consider partitioning this table by month

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================
-- Enable RLS for Supabase security

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can only manage their own API keys
CREATE POLICY api_keys_select_own ON api_keys
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY api_keys_insert_own ON api_keys
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY api_keys_update_own ON api_keys
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY api_keys_delete_own ON api_keys
    FOR DELETE USING (user_id = auth.uid());

-- Policy: Service role can access all (for backend API)
-- These policies allow the service_role key to bypass RLS
CREATE POLICY service_role_users ON users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY service_role_api_keys ON api_keys
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY service_role_api_key_usage ON api_key_usage
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to verify an API key (used by backend)
CREATE OR REPLACE FUNCTION verify_api_key(p_key_hash TEXT)
RETURNS TABLE (
    key_id UUID,
    user_id UUID,
    key_name TEXT
) AS $$
BEGIN
    -- Update last_used_at and return key info
    UPDATE api_keys
    SET last_used_at = NOW()
    WHERE key_hash = p_key_hash AND revoked_at IS NULL
    RETURNING api_keys.id, api_keys.user_id, api_keys.name
    INTO key_id, user_id, key_name;

    IF FOUND THEN
        RETURN NEXT;
    END IF;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke an API key
CREATE OR REPLACE FUNCTION revoke_api_key(p_key_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    affected_rows INTEGER;
BEGIN
    UPDATE api_keys
    SET revoked_at = NOW()
    WHERE id = p_key_id AND user_id = p_user_id AND revoked_at IS NULL;

    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Sample Data (Development Only)
-- =============================================================================
-- Uncomment to seed development data

-- INSERT INTO users (id, email) VALUES
--     ('00000000-0000-0000-0000-000000000001', 'dev@kyvernlabs.com');

-- Note: API keys should be generated through the application, never manually inserted
