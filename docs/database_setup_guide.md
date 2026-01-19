# Database Setup Guide

This guide will help you set up the Supabase database for the Discord Copilot application.

## Prerequisites

- Access to your Supabase project dashboard
- The Supabase URL and anon key configured in `.env.local`

## Step 1: Access Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **qptgxaudyuoifrtntczx**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query** to create a new SQL query

## Step 2: Run the Setup Script

1. Open the file [`supabase/setup_database.sql`](file:///d:/figmentaB1%20-%20Copy/supabase/setup_database.sql)
2. Copy the entire contents of the file
3. Paste it into the SQL Editor in Supabase
4. Click **Run** (or press `Ctrl+Enter`)

The script will:
- ✅ Create all required tables (`agent_config`, `documents`, `document_chunks`, `bot_status`, `bot_logs`)
- ✅ Set up indexes for performance
- ✅ Enable Row Level Security (RLS)
- ✅ Create RLS policies for authentication
- ✅ Insert default configuration data
- ✅ Create the vector similarity search function

## Step 3: Verify Setup

After running the script, verify everything was created correctly:

### Check Tables

Run this query in the SQL Editor:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

You should see:
- `agent_config`
- `bot_logs`
- `bot_status`
- `document_chunks`
- `documents`

### Check Initial Data

Run these queries:

```sql
-- Check agent config
SELECT * FROM agent_config;

-- Check bot status
SELECT * FROM bot_status;
```

You should see one row in each table with default values.

### Check RLS Policies

1. Go to **Authentication** → **Policies** in the Supabase dashboard
2. Verify that each table has policies enabled
3. You should see policies like "Admins can manage config", "Admins can manage documents", etc.

## Step 4: Test the Application

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Log in with your credentials

4. The dashboard should now load without errors:
   - ✅ No 404 error on `/rest/v1/documents`
   - ✅ No 401 error on `/api/config`

## Troubleshooting

### Error: "relation already exists"

This is normal if you're running the script multiple times. The script uses `CREATE TABLE IF NOT EXISTS` and `DROP POLICY IF EXISTS` to handle this gracefully.

### Error: "permission denied"

Make sure you're logged into the correct Supabase project and have admin access.

### 401 Unauthorized Error Persists

1. Clear your browser cookies and cache
2. Log out and log back in
3. Check that your `.env.local` has the correct Supabase credentials
4. Verify the user exists in Supabase Authentication dashboard

### 404 Not Found Error Persists

1. Verify the tables were created (see "Check Tables" above)
2. Check that RLS policies are enabled
3. Make sure you're logged in as an authenticated user

## Next Steps

Once the database is set up:
- Upload PDF documents through the dashboard
- Configure system instructions for your AI agent
- Add Discord channel IDs to enable the bot
- Monitor bot status and logs in real-time
