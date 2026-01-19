import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Login API: Starting login for:', email)
    
    // Check cookies before login
    const cookieStoreBefore = await cookies()
    const cookiesBefore = cookieStoreBefore.getAll()
    console.log('Login API: Cookies BEFORE login:', cookiesBefore.map(c => c.name).join(', '))

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Server login error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('SignIn successful. User:', data.user?.email)
    console.log('Login API: Session data:', {
      access_token: data.session?.access_token?.substring(0, 20) + '...',
      refresh_token: data.session?.refresh_token?.substring(0, 20) + '...',
      expires_at: data.session?.expires_at,
    })

    // Check cookies after login - Supabase SSR should have called setAll
    const cookieStoreAfter = await cookies()
    const cookiesAfter = cookieStoreAfter.getAll()
    console.log('Login API: Cookies AFTER login:', cookiesAfter.map(c => c.name).join(', '))
    console.log('Login API: Cookie count changed:', cookiesBefore.length, '->', cookiesAfter.length)

    // Create response
    const response = NextResponse.json({ success: true, user: data.user })
    
    // CRITICAL: Copy ALL cookies from cookie store to response
    // Supabase SSR's setAll callback sets cookies in the store, but they need to be in the response
    // In Next.js route handlers, cookies set via cookies().set() should auto-include, but we'll ensure it
    cookiesAfter.forEach(cookie => {
      // Copy all cookies to response (Supabase SSR should have set auth cookies)
      if (!response.cookies.has(cookie.name)) {
        console.log(`Login API: Copying cookie to response: ${cookie.name}`)
        response.cookies.set(cookie.name, cookie.value, {
          httpOnly: cookie.name.startsWith('sb-') ? false : true, // Auth cookies readable by JS
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: cookie.name.startsWith('sb-') ? 60 * 60 * 24 * 7 : undefined, // 7 days for auth cookies
        })
      }
    })
    
    // If no Supabase cookies were set by setAll, manually create them from session
    const hasSupabaseCookies = cookiesAfter.some(c => c.name.startsWith('sb-'))
    if (data.session && !hasSupabaseCookies) {
      console.log('Login API: No Supabase cookies found, manually creating from session')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 })
      }
      const urlParts = new URL(supabaseUrl)
      const projectRef = urlParts.hostname.split('.')[0]
      
      const accessTokenCookieName = `sb-${projectRef}-auth-token`
      const cookieValue = JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
        user: data.user,
      })
      
      // Set in cookie store AND response
      cookieStoreAfter.set(accessTokenCookieName, cookieValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      
      response.cookies.set(accessTokenCookieName, cookieValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      
      console.log(`Login API: Manually created cookie: ${accessTokenCookieName}`)
    }

    // Check what cookies are in the response
    const responseCookies = Array.from(response.cookies.getAll()).map(c => c.name)
    console.log('Login API: Response cookies:', responseCookies.join(', '))

    return response
  } catch (error: any) {
    console.error('Login route error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
