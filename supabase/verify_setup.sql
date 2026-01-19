-- Verification Script
-- Run this AFTER running schema.sql and rls_policies.sql
-- This checks if everything is set up correctly

-- 1. Check if pgvector extension is enabled
SELECT * FROM pg_extension WHERE extname = 'vector';

-- 2. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('agent_config', 'documents', 'document_chunks')
ORDER BY table_name;

-- 3. Check if RLS is enabled
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('agent_config', 'documents', 'document_chunks');

-- 4. Check if policies exist
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Check if RPC function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'match_document_chunks';

-- 6. Check if agent_config has initial row
SELECT id, system_instructions, allowed_channel_ids, conversation_summary
FROM agent_config;

-- Expected Results:
-- 1. Should show vector extension
-- 2. Should show 3 tables
-- 3. Should show rowsecurity = true for all tables
-- 4. Should show multiple policies
-- 5. Should show match_document_chunks function
-- 6. Should show 1 row in agent_config

