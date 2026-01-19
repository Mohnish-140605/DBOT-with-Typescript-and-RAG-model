-- Quick verification script to check if tables exist
-- Run this in Supabase SQL Editor to verify setup

-- Check which tables exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- If tables exist, check their contents
SELECT 'agent_config' as table_name, COUNT(*) as row_count FROM agent_config
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'document_chunks', COUNT(*) FROM document_chunks
UNION ALL
SELECT 'bot_status', COUNT(*) FROM bot_status
UNION ALL
SELECT 'bot_logs', COUNT(*) FROM bot_logs;
