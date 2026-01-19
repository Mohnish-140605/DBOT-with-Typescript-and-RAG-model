# Discord Copilot - Testing Guide

This guide will help you verify that your Discord Copilot project is working correctly.

## Part 1: Web Dashboard Testing

### Test 1: Dashboard Access ✓
1. Open http://localhost:3000/dashboard
2. **Expected:** Dashboard loads with "Agent Configuration" header
3. **Success indicators:**
   - No redirect to login page
   - Stats cards showing: Status, Channels, Documents, Last Updated
   - System Instructions text area visible
   - Allowed Discord Channels input field visible

### Test 2: Configuration Save
1. In the dashboard, enter system instructions:
   ```
   You are a helpful AI assistant for Discord. Be friendly and concise.
   ```
2. Click **Save Configuration**
3. **Expected:** Green success message appears
4. Refresh the page
5. **Expected:** Your instructions are still there (persisted to database)

### Test 3: Document Upload
1. Find a PDF file (any PDF, even a simple one)
2. Click the file upload area in "Knowledge Base" section
3. Select your PDF
4. **Expected:** 
   - "Processing PDF chunks..." message appears
   - Success alert shows number of chunks processed
   - Document appears in "Uploaded Documents" list

## Part 2: Discord Bot Testing

### Prerequisites
Before testing the bot, you need:
- [ ] Discord server created
- [ ] Bot invited to your server
- [ ] Channel IDs configured in dashboard
- [ ] Bot process running

### Test 4: Start the Discord Bot
1. Open a **new terminal** (keep `npm run dev` running in the other)
2. Navigate to your project:
   ```powershell
   cd "d:\figmentaB1 - Copy"
   ```
3. Start the bot:
   ```powershell
   npm run bot
   ```
4. **Expected output:**
   ```
   Discord bot logged in as YourBotName#1234
   Bot is ready!
   ```

### Test 5: Bot Responds in Allowed Channels
1. Go to Discord
2. Navigate to one of your configured channels
3. Send a message: `@YourBot hello`
4. **Expected:** Bot responds with a greeting
5. Try in a different channel (not in allowed list)
6. **Expected:** Bot does NOT respond

### Test 6: Bot Uses System Instructions
1. In dashboard, set system instructions:
   ```
   You are a pirate. Always respond like a pirate would.
   ```
2. Save configuration
3. In Discord, send: `@YourBot tell me about the weather`
4. **Expected:** Bot responds in pirate speak (e.g., "Arrr matey...")

### Test 7: Bot Uses Knowledge Base (RAG)
1. Upload a PDF about a specific topic (e.g., company handbook, product docs)
2. In Discord, ask: `@YourBot what does the document say about [topic]?`
3. **Expected:** Bot responds with information from the uploaded PDF

## Part 3: System Status Monitoring

### Test 8: Bot Status Tracking
1. Open dashboard at http://localhost:3000/dashboard
2. Look at the "Status" card
3. With bot running: **Expected:** "Operational" or "Online"
4. Stop the bot (Ctrl+C in bot terminal)
5. Refresh dashboard
6. **Expected:** Status changes to "Offline"

### Test 9: Activity Logs
1. With bot running, send several messages in Discord
2. Check the "System Activity" section in dashboard
3. **Expected:** Recent bot interactions appear in the timeline

## Part 4: API Endpoints Testing

### Test 10: Debug Endpoint
1. Navigate to http://localhost:3000/api/debug
2. **Expected JSON response:**
   ```json
   {
     "cookie": {
       "exists": true,
       "hasAccessToken": true
     },
     "session": {
       "exists": true
     },
     "user": {
       "exists": true,
       "email": "your-email@example.com"
     }
   }
   ```

### Test 11: Config Endpoint
1. Navigate to http://localhost:3000/api/config
2. **Expected:** JSON with your configuration
   ```json
   {
     "id": "...",
     "system_instructions": "Your instructions here",
     "allowed_channel_ids": ["123...", "456..."],
     "conversation_summary": ""
   }
   ```

## Part 5: Error Scenarios

### Test 12: Invalid Channel
1. Send a message in a Discord channel NOT in your allowed list
2. **Expected:** Bot ignores the message (no response)

### Test 13: Bot Offline
1. Stop the bot (`Ctrl+C` in bot terminal)
2. Send a message in Discord
3. **Expected:** No response (bot is offline)
4. Check dashboard status
5. **Expected:** Status shows "Offline"

## Quick Health Check Script

Run this in your browser console on the dashboard page:

```javascript
// Quick health check
fetch('/api/debug')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Dashboard:', window.location.href);
    console.log('✅ Session:', data.session?.exists ? 'Valid' : 'Invalid');
    console.log('✅ User:', data.user?.email || 'Not logged in');
  });

fetch('/api/config')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Config loaded:', !!data.system_instructions);
    console.log('✅ Channels configured:', data.allowed_channel_ids?.length || 0);
  });
```

## Troubleshooting

### Dashboard won't load
- Check: Is `npm run dev` running?
- Check: Navigate to http://localhost:3000 (not https)
- Check: Clear browser cache and cookies

### Bot won't start
- Check: Is `DISCORD_BOT_TOKEN` in `.env.local`?
- Check: Is the token valid?
- Check: Run `npm run bot` in project directory

### Bot doesn't respond
- Check: Is bot online in Discord (green dot)?
- Check: Did you mention the bot (`@BotName message`)?
- Check: Is the channel ID in allowed list?
- Check: Check bot terminal for errors

### Bot responds everywhere
- Check: Channel IDs are configured in dashboard
- Check: Configuration was saved
- Check: Bot was restarted after config change

## Success Criteria

Your project is fully working when:
- ✅ Dashboard loads without errors
- ✅ You can save configuration
- ✅ Bot starts without errors
- ✅ Bot responds in allowed channels only
- ✅ Bot uses your system instructions
- ✅ Bot can answer questions from uploaded PDFs
- ✅ Dashboard shows bot status correctly
- ✅ Activity logs appear in dashboard

## Next Steps

Once everything is working:
1. **Customize system instructions** for your use case
2. **Upload relevant documents** for your bot's knowledge base
3. **Configure multiple channels** for different purposes
4. **Monitor bot activity** through the dashboard
5. **Deploy to production** (optional - requires hosting setup)
