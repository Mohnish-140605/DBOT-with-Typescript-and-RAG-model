-- Bot status tracking
CREATE TABLE IF NOT EXISTS bot_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'offline', -- 'online', 'offline', 'error'
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure single row for status
INSERT INTO bot_status (status) 
SELECT 'offline' 
WHERE NOT EXISTS (SELECT 1 FROM bot_status);

-- Bot logs
CREATE TABLE IF NOT EXISTS bot_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL, -- 'info', 'warn', 'error'
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for logs
CREATE INDEX idx_bot_logs_created_at ON bot_logs(created_at DESC);

-- RLS Policies
ALTER TABLE bot_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read status
CREATE POLICY "Allow authenticated read bot_status" ON bot_status
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users (and anon for basic status checks if needed, but sticking to auth) to read
-- Allow service role full access (implicit)
