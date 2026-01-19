'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline'
import {
    FileText,
    Hash,
    Clock,
    CheckCircle2
} from 'lucide-react'

// Types
interface AgentConfig {
    id: string
    allowed_channel_ids: string[]
    updated_at?: string
}

interface Document {
    id: string
}

export default function AdminDashboard() {
    const router = useRouter()
    const [config, setConfig] = useState<AgentConfig | null>(null)
    const [docCount, setDocCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [logs, setLogs] = useState<any[]>([])

    const [userGreeting, setUserGreeting] = useState("COMMANDER")

    useEffect(() => {
        const supabase = createClient()
        let hasLoadedData = false

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                // Set username from session
                if (session.user.email) {
                    setUserGreeting(session.user.email.split('@')[0].toUpperCase())
                }

                if (!hasLoadedData) {
                    hasLoadedData = true
                    loadData()
                }
            } else if (!session && hasLoadedData) {
                router.push('/login')
            } else if (!session) {
                router.push('/login')
            }
        })

        // Poll for logs
        const fetchLogs = async () => {
            try {
                const response = await fetch('/api/status')
                if (response.ok) {
                    const data = await response.json()
                    if (data.recent_logs) setLogs(data.recent_logs)
                }
            } catch (console) {
                // Ignore errors
            }
        }

        fetchLogs()
        const interval = setInterval(fetchLogs, 5000)

        return () => {
            subscription.unsubscribe()
            clearInterval(interval)
        }
    }, [])

    const loadData = async () => {
        try {
            // Load Config
            const configRes = await fetch('/api/config')
            if (configRes.ok) {
                const configData = await configRes.json()
                setConfig(configData)
            }

            // Load Doc Count
            const supabase = createClient()
            const { count } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })

            if (count !== null) setDocCount(count)

        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-96" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* SUPER GALACTIC WELCOME BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10 p-10 md:p-14 group perspective-1000 shadow-2xl shadow-primary/10">

                {/* 1. Deep Space Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-80" />

                {/* 2. Twinkling Stars Layer */}
                <div className="absolute inset-0 opacity-40 animate-pulse bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 brightness-100" />

                {/* 3. Nebula Cloud Effects */}
                <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-primary/30 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-blob" />
                <div className="absolute bottom-[-50%] right-[-20%] w-[100%] h-[200%] bg-purple-600/30 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-blob animation-delay-2000" />

                {/* 4. Moving Grid Floor */}
                <div className="absolute bottom-0 inset-x-0 h-[300px] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(500px)_rotateX(60deg)_translateY(100px)] opacity-30 pointer-events-none origin-bottom" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-mono text-green-400 tracking-wider">SYSTEM ONLINE</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                            WELCOME <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-white animate-text-shimmer bg-[length:200%_auto]">
                                {userGreeting}
                            </span>
                        </h1>
                        <p className="text-white/50 mt-4 max-w-md font-light text-lg tracking-wide">
                            Command interface ready. Global node latency at <span className="text-white">12ms</span>.
                        </p>
                    </div>

                    {/* AI Sentinel Character Animation */}
                    <div className="hidden md:block relative z-20">
                        <motion.div
                            className="relative w-40 h-40"
                            animate={{
                                y: [0, -15, 0],
                                rotateZ: [0, 2, 0, -2, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {/* Droid Head Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden">
                                {/* Circuit Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />

                                {/* The Visor */}
                                <div className="w-full h-12 bg-black/80 flex items-center justify-center gap-6 relative">
                                    {/* Scanning Line */}
                                    <motion.div
                                        className="absolute inset-0 bg-primary/20"
                                        animate={{ x: ['100%', '-100%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Left Eye */}
                                    <div className="w-8 h-2 bg-gray-800 rounded-full relative overflow-hidden">
                                        <motion.div
                                            className="absolute inset-0 bg-primary"
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                    </div>

                                    {/* Right Eye */}
                                    <div className="w-8 h-2 bg-gray-800 rounded-full relative overflow-hidden">
                                        <motion.div
                                            className="absolute inset-0 bg-primary"
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Outer Orbital Rings */}
                            <motion.div
                                className="absolute -inset-4 border-2 border-primary/20 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                            />
                            <motion.div
                                className="absolute -inset-8 border border-white/10 rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
                            />

                            {/* Status Tag */}
                            <div className="absolute -top-2 -right-4 bg-primary text-black text-[9px] font-bold px-2 py-0.5 rounded-sm skew-x-[-12deg] shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                                SENTINEL v4.0.1
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white/80 uppercase mb-2">System Overview</h1>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Status"
                    value="Operational"
                    icon={CheckCircle2}
                    description="All systems running"
                />
                <StatsCard
                    title="Channels"
                    value={config?.allowed_channel_ids?.length || 0}
                    icon={Hash}
                    description="Monitored channels"
                />
                <StatsCard
                    title="Knowledge Base"
                    value={docCount}
                    icon={FileText}
                    description="Documents indexed"
                />
                <StatsCard
                    title="Last Config Update"
                    value={config?.updated_at ? new Date(config.updated_at).toLocaleDateString() : 'Never'}
                    icon={Clock}
                    description="System configuration"
                />
            </div>

            {/* Activity Timeline */}
            <div className="grid gap-6">
                <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
                <ActivityTimeline logs={logs} />
            </div>
        </div>
    )
}
