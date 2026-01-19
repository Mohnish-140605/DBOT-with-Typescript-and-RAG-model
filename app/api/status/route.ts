import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Get bot status
        const { data: statusData, error: statusError } = await supabase
            .from('bot_status')
            .select('*')
            .single()

        if (statusError && statusError.code !== 'PGRST116') {
            throw statusError
        }

        // Get recent logs
        const { data: logsData, error: logsError } = await supabase
            .from('bot_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        if (logsError) {
            throw logsError
        }

        return NextResponse.json({
            status: statusData?.status || 'offline',
            last_seen: statusData?.last_seen,
            metadata: statusData?.metadata,
            recent_logs: logsData || []
        })
    } catch (error: any) {
        // Handle missing table error (Migration not applied yet)
        if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
            console.warn('Status table not found. Please run the migration.')
            return NextResponse.json({
                status: 'offline',
                last_seen: null,
                metadata: { error: 'Migration required' },
                recent_logs: []
            })
        }

        console.error('Failed to fetch status:', error)
        return NextResponse.json(
            { error: 'Failed to fetch status' },
            { status: 500 }
        )
    }
}
