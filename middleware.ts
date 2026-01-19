import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip auth for API routes, login, signup, auth callback, and debug pages
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname.startsWith('/auth/callback') ||
    request.nextUrl.pathname === '/debug'
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip Supabase initialization if env vars are missing (during build)
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // #region agent log
  const cookieNames = request.cookies.getAll().map(c => c.name).join(', ')
  const hasAuthCookies = cookieNames.includes('sb-') || cookieNames.includes('supabase')
  // #endregion agent log

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  // #region agent log
  console.log('Middleware checking:', request.nextUrl.pathname)
  console.log('Middleware Cookie Names:', cookieNames)
  console.log('Middleware has auth cookies:', hasAuthCookies)
  console.log('Middleware Session found:', !!session)
  console.log('Middleware Session error:', sessionError?.message)
  if (session) {
    console.log('Middleware Session user:', session.user?.id, session.user?.email)
  }
  // #endregion agent log

  if (!session && request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
    console.log('Middleware: No session detected, but BYPASSING redirect for debugging.')
    console.log('Target was:', request.nextUrl.pathname)
    // return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

