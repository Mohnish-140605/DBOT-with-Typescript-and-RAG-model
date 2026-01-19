require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')
const { createClient } = require('@supabase/supabase-js')
const Groq = require('groq-sdk')
const logger = require('./logger')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY'
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// Heartbeat interval
let heartbeatInterval

async function getAgentConfig() {
  const { data, error } = await supabase
    .from('agent_config')
    .select('*')
    .single()

  if (error || !data) {
    logger.error('Failed to fetch config', { error })
    return null
  }

  return data
}

// RAG: Keyword Search Fallback (Free & Robust)
async function getRAGContext(query) {
  try {
    // 1. Clean query
    const cleanQuery = query.replace(/[^\w\s]/gi, '').trim();
    if (cleanQuery.length < 3) return '';

    // 2. Perform text search in Supabase (Simple ILIKE for robustness)
    const { data, error } = await supabase
      .from('document_chunks')
      .select('content')
      .ilike('content', `%${cleanQuery}%`) // Simple substring match
      .limit(3);

    if (error) {
      logger.warn('Search failed', { error: error.message });
      return '';
    }

    if (!data || data.length === 0) return '';
    return data.map(chunk => chunk.content).join('\n\n');
  } catch (error) {
    logger.error('RAG Error', { error: error.message });
    return '';
  }
}

async function updateConversationSummary(userMessage, assistantResponse, currentSummary) {
  try {
    const summaryPrompt = `Current summary: "${currentSummary || 'None'}"
User: ${userMessage}
Assistant: ${assistantResponse}
Update the summary to include this exchange concisely. Return ONLY the summary text.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: summaryPrompt }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || currentSummary;
  } catch (error) {
    logger.error('Summary update error', { error: error.message })
    return currentSummary
  }
}

client.once('ready', async () => {
  logger.info(`Bot logged in as ${client.user.tag}`)

  // Start heartbeat
  await logger.updateStatus('online', {
    username: client.user.tag,
    id: client.user.id
  })

  heartbeatInterval = setInterval(async () => {
    await logger.updateStatus('online')
  }, 60000) // Every minute
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return

  const config = await getAgentConfig()
  if (!config) return

  const allowedChannels = config.allowed_channel_ids || []
  if (allowedChannels.length === 0 || !allowedChannels.includes(message.channel.id)) {
    return
  }

  await message.channel.sendTyping()

  try {
    // Retrieve Context
    const ragContext = await getRAGContext(message.content)

    // Construct Prompt
    const messages = [
      { role: "system", content: config.system_instructions || "You are a helpful assistant." }
    ];

    if (ragContext) {
      messages.push({ role: "system", content: `RELAVENT KNOWLEDGE:\n${ragContext}` })
    }

    if (config.conversation_summary) {
      messages.push({ role: "system", content: `Context Summary: ${config.conversation_summary}` });
    }

    messages.push({ role: "user", content: message.content });

    // Call Groq (Llama 3)
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "No response generated.";

    // Send Response (Split if too long)
    if (response.length > 2000) {
      const chunks = response.match(/.{1,2000}/g) || []
      for (const chunk of chunks) await message.reply(chunk)
    } else {
      await message.reply(response)
    }

    // Update Memory
    const updatedSummary = await updateConversationSummary(
      message.content,
      response,
      config.conversation_summary
    )

    await supabase
      .from('agent_config')
      .update({ conversation_summary: updatedSummary })
      .eq('id', config.id)

    logger.info('Processed message', {
      user: message.author.tag,
      channel: message.channel.name,
      model: 'llama-3.3-70b-versatile',
      rag: !!ragContext
    })

  } catch (error) {
    console.error('❌ ERROR DETAILS:', {
      message: error.message,
      name: error.name
    })

    if (error.message.includes('API key') || error.message.includes('MISSING_KEY')) {
      await message.reply('❌ **Setup Required:** Please add `GROQ_API_KEY` to your `.env` file. Get one for free at https://console.groq.com/keys')
    } else {
      await message.reply('Sorry, I encountered an error. Please check the bot console.')
    }
  }
})

// Handle shutdown
process.on('SIGINT', async () => {
  logger.info('Bot shutting down...')
  if (heartbeatInterval) clearInterval(heartbeatInterval)
  await logger.updateStatus('offline')
  client.destroy()
  process.exit(0)
})

client.login(process.env.DISCORD_BOT_TOKEN)
