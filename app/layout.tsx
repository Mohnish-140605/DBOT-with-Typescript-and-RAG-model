import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { HydrationDebugger } from './HydrationDebugger'
import { EnvCheck } from '@/components/EnvCheck'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'Discord Copilot Admin',
    description: 'Admin dashboard for Discord AI Copilot with RAG',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // #region agent log
    if (typeof window === 'undefined') {
        // Server-side: log what we're rendering
        const serverLog = {
            location: 'layout.tsx:RootLayout',
            message: 'Server-side render - HTML element attributes',
            data: {
                lang: 'en',
                className: inter.variable,
                timestamp: Date.now()
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B'
        }
        // Note: Can't use fetch on server-side, will log via client component
    }
    // #endregion agent log

    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body className={inter.className}>
                <HydrationDebugger />
                <EnvCheck />
                {children}
            </body>
        </html>
    )
}
