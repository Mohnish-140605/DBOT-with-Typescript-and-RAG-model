# Setup Checklist

Follow these steps in order:

## ✅ Step 1: Supabase Project Setup

- [ ] Created Supabase project at https://supabase.com
- [ ] Project is active and ready
- [ ] Copied Project URL from Settings → API
- [ ] Copied `anon` key from Settings → API
- [ ] Copied `service_role` key from Settings → API (keep secret!)

## ✅ Step 2: Run Database Schema

- [ ] Opened Supabase SQL Editor
- [ ] Copied entire contents of `supabase/schema.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" (or Ctrl+Enter)
- [ ] Saw "Success. No rows returned" message
- [ ] Copied entire contents of `supabase/rls_policies.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run"
- [ ] Saw "Success" message

## ✅ Step 3: Verify Setup

- [ ] Opened SQL Editor again
- [ ] Copied contents of `supabase/verify_setup.sql`
- [ ] Pasted and ran
- [ ] Verified all checks pass:
  - [ ] pgvector extension exists
  - [ ] 3 tables exist (agent_config, documents, document_chunks)
  - [ ] RLS is enabled on all tables
  - [ ] Policies exist
  - [ ] RPC function exists
  - [ ] Initial config row exists

## ✅ Step 4: Create Admin User

- [ ] Went to Authentication → Users
- [ ] Clicked "Add User" → "Create New User"
- [ ] Entered email: `admin@yourdomain.com`
- [ ] Entered password (saved it securely!)
- [ ] Checked "Auto Confirm User"
- [ ] Clicked "Create User"
- [ ] User appears in list

## ✅ Step 5: Environment Variables

- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Created `.env` file in project root
- [ ] Added `SUPABASE_URL`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Got OpenAI API key from https://platform.openai.com/api-keys
- [ ] Added `OPENAI_API_KEY` to both `.env.local` and `.env`
- [ ] Got Discord bot token from https://discord.com/developers/applications
- [ ] Added `DISCORD_BOT_TOKEN` to `.env`
- [ ] Verified all values are correct (no extra spaces)

## ✅ Step 6: Install Dependencies

- [ ] Ran `npm install`
- [ ] No errors during installation
- [ ] All packages installed successfully

## ✅ Step 7: Test Connection

- [ ] Ran `node scripts/test-connection.js`
- [ ] All checks passed
- [ ] No errors in output

## ✅ Step 8: Start Admin Dashboard

- [ ] Ran `npm run dev`
- [ ] Saw "Ready" message
- [ ] Opened http://localhost:3000
- [ ] Redirected to `/login` page
- [ ] Logged in with admin credentials
- [ ] Dashboard loaded successfully

## ✅ Step 9: Test Dashboard Features

- [ ] Can see system instructions textarea
- [ ] Can see channel IDs input
- [ ] Can see PDF upload section
- [ ] Can see conversation summary section
- [ ] Can click "Save Configuration" without errors
- [ ] Can upload a test PDF (if you have one)
- [ ] Can click "Reset Memory" button

## ✅ Step 10: Discord Bot Setup

- [ ] Created Discord application at https://discord.com/developers/applications
- [ ] Created bot in Bot section
- [ ] Copied bot token
- [ ] Enabled "Message Content Intent" in Privileged Gateway Intents
- [ ] Generated invite URL with `bot` and `messages.read` scopes
- [ ] Invited bot to Discord server
- [ ] Bot appears online in server

## ✅ Step 11: Test Discord Bot

- [ ] Started bot: `npm run bot` (in separate terminal)
- [ ] Saw "Bot logged in as YourBot#1234"
- [ ] Added Discord channel ID to dashboard
- [ ] Saved configuration
- [ ] Sent test message in Discord channel
- [ ] Bot responded (may take a few seconds)

## ✅ Step 12: End-to-End Test

- [ ] Updated system instructions in dashboard
- [ ] Bot uses new instructions (test in Discord)
- [ ] Uploaded PDF to knowledge base
- [ ] Asked bot question related to PDF content
- [ ] Bot responded with relevant information from PDF
- [ ] Reset memory
- [ ] Bot started fresh conversation

---

## 🎉 You're Done!

If all checkboxes are checked, your MVP is fully functional!

Next: Deploy to production (see DEPLOYMENT.md)

