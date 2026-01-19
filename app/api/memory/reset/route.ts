import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data: config } = await supabase
    .from('agent_config')
    .select('id')
    .single()

  if (!config) {
    return NextResponse.json({ error: 'Config not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('agent_config')
    .update({ conversation_summary: '' })
    .eq('id', config.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

