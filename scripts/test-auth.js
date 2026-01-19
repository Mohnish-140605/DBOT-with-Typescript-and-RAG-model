// Test authentication connection
// Run with: node scripts/test-auth.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Auth Connection...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('')
  console.error('Make sure .env.local exists with:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
  console.error('')
  console.error('Current values:')
  console.error('  URL:', supabaseUrl || 'MISSING')
  console.error('  Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING')
  process.exit(1)
}

console.log('✅ Environment variables found')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  // Test 1: Check if we can connect
  console.log('1. Testing connection...')
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error && error.message.includes('JWT')) {
      console.error('   ❌ Invalid API key (JWT error)')
      console.error('   → Check your NEXT_PUBLIC_SUPABASE_ANON_KEY')
      return false
    }
    console.log('   ✅ Connection successful')
  } catch (error) {
    console.error('   ❌ Connection failed:', error.message)
    if (error.message.includes('fetch')) {
      console.error('   → Check your NEXT_PUBLIC_SUPABASE_URL')
    }
    return false
  }

  // Test 2: Check URL configuration
  console.log('\n2. Checking URL configuration...')
  console.log('   ⚠️  Make sure Supabase allows http://localhost:3000')
  console.log('   → Go to: Authentication → URL Configuration')
  console.log('   → Add to Redirect URLs: http://localhost:3000')

  // Test 3: Try to get auth settings
  console.log('\n3. Testing auth API...')
  try {
    // This will fail if URL/key is wrong, but that's okay
    const { error } = await supabase.auth.getUser()
    if (error && error.message.includes('Invalid')) {
      console.log('   ⚠️  No active session (expected)')
    } else {
      console.log('   ✅ Auth API accessible')
    }
  } catch (error) {
    console.error('   ❌ Auth API error:', error.message)
    return false
  }

  console.log('\n✅ All basic checks passed!')
  console.log('\nNext steps:')
  console.log('1. Make sure dev server is running: npm run dev')
  console.log('2. Visit http://localhost:3000/login')
  console.log('3. Try signing up or logging in')
  console.log('4. Check browser console (F12) for errors')
  
  return true
}

testAuth().catch(console.error)
