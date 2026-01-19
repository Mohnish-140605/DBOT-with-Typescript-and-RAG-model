-- ============================================
-- DISCORD COPILOT DATABASE SETUP
-- ============================================
-- This script sets up all required tables, policies, and functions
-- Run this in the Supabase SQL Editor

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- TABLES
-- ============================================

-- Agent configuration table (single row)
CREATE TABLE IF NOT EXISTS agent_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_instructions TEXT NOT NULL DEFAULT 'You are a helpful AI assistant.',
  allowed_channel_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  conversation_summary TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document chunks with embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimension
  chunk_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bot status tracking
CREATE TABLE IF NOT EXISTS bot_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'offline', -- 'online', 'offline', 'error'
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bot logs
CREATE TABLE IF NOT EXISTS bot_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL, -- 'info', 'warn', 'error'
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
ON document_chunks USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Index for document lookup
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id 
ON document_chunks(document_id);

-- Index for logs
CREATE INDEX IF NOT EXISTS idx_bot_logs_created_at 
ON bot_logs(created_at DESC);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert initial config row (if table is empty)
INSERT INTO agent_config (system_instructions, allowed_channel_ids, conversation_summary)
SELECT 'You are a helpful AI assistant.', ARRAY[]::TEXT[], ''
WHERE NOT EXISTS (SELECT 1 FROM agent_config);

-- Ensure single row for bot status
INSERT INTO bot_status (status) 
SELECT 'offline' 
WHERE NOT EXISTS (SELECT 1 FROM bot_status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - AGENT_CONFIG
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage config" ON agent_config;
DROP POLICY IF EXISTS "Service role can read config" ON agent_config;
DROP POLICY IF EXISTS "Service role can update summary" ON agent_config;

-- Allow authenticated users to read/write config
CREATE POLICY "Admins can manage config"
ON agent_config
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow service role (bot) to read config
CREATE POLICY "Service role can read config"
ON agent_config
FOR SELECT
TO service_role
USING (true);

-- Allow service role (bot) to update conversation_summary
CREATE POLICY "Service role can update summary"
ON agent_config
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- RLS POLICIES - DOCUMENTS
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage documents" ON documents;

-- Allow authenticated users to manage documents
CREATE POLICY "Admins can manage documents"
ON documents
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- RLS POLICIES - DOCUMENT_CHUNKS
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage chunks" ON document_chunks;
DROP POLICY IF EXISTS "Service role can read chunks" ON document_chunks;

-- Allow authenticated users to manage chunks
CREATE POLICY "Admins can manage chunks"
ON document_chunks
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow service role (bot) to read chunks for RAG
CREATE POLICY "Service role can read chunks"
ON document_chunks
FOR SELECT
TO service_role
USING (true);

-- ============================================
-- RLS POLICIES - BOT_STATUS
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read bot_status" ON bot_status;

-- Allow authenticated users to read status
CREATE POLICY "Allow authenticated read bot_status" 
ON bot_status
FOR SELECT 
TO authenticated 
USING (true);

-- ============================================
-- RLS POLICIES - BOT_LOGS
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read bot_logs" ON bot_logs;

-- Allow authenticated users to read logs
CREATE POLICY "Allow authenticated read bot_logs" 
ON bot_logs
FOR SELECT 
TO authenticated 
USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- RPC function for vector similarity search
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify setup:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM agent_config;
-- SELECT * FROM bot_status;
