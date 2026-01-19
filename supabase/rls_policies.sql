-- Row Level Security Policies
-- Run this AFTER running schema.sql

-- ============================================
-- AGENT_CONFIG TABLE
-- ============================================
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;

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
-- DOCUMENTS TABLE
-- ============================================
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage documents
CREATE POLICY "Admins can manage documents"
ON documents
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- DOCUMENT_CHUNKS TABLE
-- ============================================
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

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

