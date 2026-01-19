import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  // #region agent log
  if (typeof window !== 'undefined') {
    const cookies = document.cookie
    const hasAuthCookies = cookies.includes('sb-') || cookies.includes('supabase')
    fetch('http://127.0.0.1:7243/ingest/953ddd6d-c7ea-4260-83a9-980ef548b30d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'lib/supabase/client.ts:createClient',
        message: 'Creating browser client - cookie check',
        data: {
          hasCookies: !!cookies,
          cookieLength: cookies.length,
          hasAuthCookies,
          cookieNames: cookies.split(';').map(c => c.split('=')[0].trim()).join(', '),
          timestamp: Date.now()
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C'
      })
    }).catch(() => {})
  }
  // #endregion agent log

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

