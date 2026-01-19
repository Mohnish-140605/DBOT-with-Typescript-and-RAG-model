'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Server login error:', error.message)
        return { error: error.message }
    }

    console.log('SignIn successful. User:', data.user?.email)

    // Explicitly debug cookies
    const cookieStore = await cookies()
    cookieStore.set('debug_test', 'true')

    console.log('Redirecting to dashboard...')
    // redirect('/dashboard') // Redirect in client to avoid error swallowing
    return { success: true }
}
