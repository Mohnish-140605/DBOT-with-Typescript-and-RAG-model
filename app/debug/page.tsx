'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [envCheck, setEnvCheck] = useState<any>({})

  useEffect(() => {
    const supabase = createClient()
    
    // Check session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Check env vars (safe check)
    setEnvCheck({
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 8) + '...'
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debugger</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Environment</h2>
        <pre>{JSON.stringify(envCheck, null, 2)}</pre>
      </div>

      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Session State</h2>
        {loading ? (
          <div>Loading session...</div>
        ) : (
          <pre>{session ? JSON.stringify(session, null, 2) : 'No active session'}</pre>
        )}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.reload()
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Force Sign Out
        </button>
      </div>
    </div>
  )
}
