'use client'

import { useEffect, useState } from 'react'

export function EnvCheck() {
  const [envMissing, setEnvMissing] = useState(false)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      setEnvMissing(true)
    }
  }, [])

  if (!envMissing) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-50 text-center">
      <div className="max-w-4xl mx-auto">
        <strong>⚠️ Configuration Required:</strong> Missing Supabase environment variables. 
        Please add <code className="bg-black/20 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
        <code className="bg-black/20 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your Vercel project settings.
      </div>
    </div>
  )
}
