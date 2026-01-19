// Test script to verify Supabase connection
// Run with: node scripts/test-connection.js

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Need: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_ versions)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n')

  // Test 1: Check if tables exist
  console.log('1. Checking tables...')
  const { data: tables, error: tablesError } = await supabase
    .from('agent_config')
    .select('id')
    .limit(1)

  if (tablesError) {
    console.error('   ❌ Error accessing agent_config:', tablesError.message)
    console.error('   → Make sure you ran schema.sql in Supabase SQL Editor')
    return false
  }
  console.log('   ✅ agent_config table exists')

  // Test 2: Check RPC function
  console.log('\n2. Checking RPC function...')
  try {
    // Test with dummy embedding
    const dummyEmbedding = Array(1536).fill(0).join(',')
    const { error: rpcError } = await supabase.rpc('match_document_chunks', {
      query_embedding: `[${dummyEmbedding}]`,
      match_threshold: 0.5,
      match_count: 1,
    })

    if (rpcError && !rpcError.message.includes('no rows')) {
      console.error('   ❌ RPC function error:', rpcError.message)
      console.error('   → Make sure you ran schema.sql completely')
      return false
    }
    console.log('   ✅ match_document_chunks function exists')
  } catch (error) {
    console.error('   ❌ RPC function test failed:', error.message)
    return false
  }

  // Test 3: Check if config row exists
  console.log('\n3. Checking initial config...')
  const { data: config, error: configError } = await supabase
    .from('agent_config')
    .select('*')
    .single()

  if (configError) {
    console.error('   ❌ No config row found:', configError.message)
    console.error('   → Run this in SQL Editor:')
    console.error('     INSERT INTO agent_config DEFAULT VALUES;')
    return false
  }
  console.log('   ✅ Initial config row exists')
  console.log(`      ID: ${config.id}`)
  console.log(`      Instructions: ${config.system_instructions.substring(0, 50)}...`)

  // Test 4: Check documents table
  console.log('\n4. Checking documents table...')
  const { data: docs, error: docsError } = await supabase
    .from('documents')
    .select('id')
    .limit(1)

  if (docsError) {
    console.error('   ❌ Error accessing documents:', docsError.message)
    return false
  }
  console.log('   ✅ documents table exists')

  console.log('\n✅ All checks passed! Your Supabase setup is correct.\n')
  return true
}

testConnection().catch(console.error)

