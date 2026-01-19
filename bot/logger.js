const { createClient } = require('@supabase/supabase-js')

class Logger {
    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )
    }

    async log(level, message, details = {}) {
        const timestamp = new Date().toISOString()
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`)

        try {
            if (process.env.NODE_ENV === 'production' || true) { // Always log to DB for MVP
                await this.supabase.from('bot_logs').insert({
                    level,
                    message,
                    details,
                    created_at: timestamp
                })
            }
        } catch (error) {
            console.error('Failed to write log to DB:', error)
        }
    }

    async info(message, details) {
        await this.log('info', message, details)
    }

    async warn(message, details) {
        await this.log('warn', message, details)
    }

    async error(message, details) {
        await this.log('error', message, details)
    }

    async updateStatus(status, metadata = {}) {
        try {
            // First try to update
            const { error } = await this.supabase
                .from('bot_status')
                .update({
                    status,
                    last_seen: new Date().toISOString(),
                    metadata
                })
                .neq('id', '00000000-0000-0000-0000-000000000000') // Updates all rows (should be one)

            if (error) console.error('Status update error:', error)
        } catch (error) {
            console.error('Failed to update status:', error)
        }
    }
}

module.exports = new Logger()
