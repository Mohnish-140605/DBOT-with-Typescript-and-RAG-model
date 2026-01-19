import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Debug: Log all cookies
  const allCookies = cookieStore.getAll()
  console.log('Server createClient: Total cookies:', allCookies.length)
  console.log('Server createClient: Cookie names:', allCookies.map(c => c.name).join(', '))

  const authCookie = allCookies.find(c => c.name.startsWith('sb-'))
  console.log('Server createClient: Auth cookie found:', !!authCookie)
  if (authCookie) {
    console.log('Server createClient: Auth cookie name:', authCookie.name)
    console.log('Server createClient: Auth cookie value length:', authCookie.value.length)
    // Try to parse the cookie to see if it's valid JSON
    try {
      const parsed = JSON.parse(authCookie.value)
      console.log('Server createClient: Cookie parsed successfully, has access_token:', !!parsed.access_token)
    } catch (e) {
      console.error('Server createClient: Failed to parse cookie:', e)
    }
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          console.log(`Supabase SSR get('${name}'):`, cookie ? `found (${cookie.value.length} chars)` : 'not found')
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            console.log(`Supabase SSR set('${name}'):`, value.length, 'chars')
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Supabase SSR set error:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            console.log(`Supabase SSR remove('${name}')`)
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.error('Supabase SSR remove error:', error)
          }
        },
      },
    }
  )
}


