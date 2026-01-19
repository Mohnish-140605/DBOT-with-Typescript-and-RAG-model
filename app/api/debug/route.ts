import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        // Get cookie details
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()
        const authCookie = allCookies.find(c => c.name.startsWith('sb-'))

        // Try to parse the cookie value
        let cookieData = null
        let parseError = null
        if (authCookie) {
            try {
                cookieData = JSON.parse(authCookie.value)
            } catch (e: any) {
                parseError = e.message
            }
        }

        const supabase = await createClient()

        // Try getSession first (reads from cookie)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        // Try getUser (validates with Supabase API)
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        return NextResponse.json({
            cookie: {
                exists: !!authCookie,
                name: authCookie?.name,
                valueLength: authCookie?.value.length,
                parseError,
                hasAccessToken: !!cookieData?.access_token,
                hasRefreshToken: !!cookieData?.refresh_token,
                hasUser: !!cookieData?.user,
                expiresAt: cookieData?.expires_at
            },
            session: {
                exists: !!session,
                userId: session?.user?.id,
                expiresAt: session?.expires_at,
                error: sessionError?.message
            },
            user: {
                exists: !!user,
                id: user?.id,
                email: user?.email,
                error: userError?.message
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
