import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // #region agent log
  const cookieHeader = request.headers.get('cookie') || ''
  const hasAuthCookies = cookieHeader.includes('sb-') || cookieHeader.includes('supabase')
  console.log('API /config GET: Cookie header present:', !!cookieHeader)
  console.log('API /config GET: Has auth cookies:', hasAuthCookies)
  // #endregion agent log

  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log('API /config: User check result:', user?.id, authError)
  console.log('API /config: Auth error details:', authError)

  // #region agent log
  console.log('API /config GET: User authenticated:', !!user)
  if (!user) {
    console.log('API /config GET: Returning 401 - no user')
  }
  // #endregion agent log

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('agent_config')
    .select('*')
    .single()

  if (error) {
    // If no rows found, return default config
    if (error.code === 'PGRST116') {
      return NextResponse.json({
        id: '',
        system_instructions: 'You are a helpful AI assistant.',
        allowed_channel_ids: [],
        conversation_summary: '',
        updated_at: new Date().toISOString()
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || {
    id: '',
    system_instructions: 'You are a helpful AI assistant.',
    allowed_channel_ids: [],
    conversation_summary: '',
    updated_at: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log('API POST /config: User check result:', user?.id, authError)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Get existing config or create new one
  let { data: existingConfig } = await supabase
    .from('agent_config')
    .select('id')
    .single()

  if (!existingConfig) {
    // Create if doesn't exist
    const { data: newConfig, error: createError } = await supabase
      .from('agent_config')
      .insert({
        system_instructions: body.system_instructions || 'You are a helpful AI assistant.',
        allowed_channel_ids: body.allowed_channel_ids || [],
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json(newConfig)
  }

  // Update existing
  const { data, error } = await supabase
    .from('agent_config')
    .update({
      system_instructions: body.system_instructions,
      allowed_channel_ids: body.allowed_channel_ids || [],
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingConfig.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

