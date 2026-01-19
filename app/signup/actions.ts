'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function signup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()
    const origin = headers().get('origin')

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error('Signup error:', error.message)
        return { error: error.message }
    }

    if (data.session) {
        // User is auto-confirmed
        return { success: true, session: true }
    }

    // Email confirmation required
    return { success: true, session: false }
}
