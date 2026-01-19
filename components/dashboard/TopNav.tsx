'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LogOut, Bot, Clock, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopNavProps {
    botStatus?: 'online' | 'offline'
}

export function TopNav({ botStatus = 'offline' }: TopNavProps) {
    const router = useRouter()
    const [currentTime, setCurrentTime] = useState<string>("")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [identity, setIdentity] = useState("COMMANDER")

    useEffect(() => {
        // Fetch User Identity
        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) {
                setIdentity(user.email.split('@')[0].toUpperCase())
            }
        }
        fetchUser()

        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }))
        }, 1000)

        // Initial set
        setCurrentTime(new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }))

        return () => clearInterval(timer)
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <nav className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40 transition-all duration-200">
            <div className="h-full px-6 flex items-center justify-between">

                {/* Left: Breadcrumb / Title */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/50 text-sm font-mono tracking-wider">
                        <span className="text-white">DASHBOARD</span>
                        <span className="text-white/20">/</span>
                        <span>OVERVIEW</span>
                    </div>
                </div>

                {/* Right: Status & Profile */}
                <div className="flex items-center gap-6">
                    {/* Discord Link */}
                    <a
                        href="https://discord.gg/H7nj5mCS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/30 hover:text-[#5865F2] transition-all duration-300 group"
                        title="Join Command Server"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.862-1.295 1.199-1.99a.076.076 0 0 0-.041-.105 13.11 13.11 0 0 1-1.872-.89.077.077 0 0 1-.008-.128c.125-.094.252-.192.37-.29a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.245.196.37.29a.077.077 0 0 1-.006.127 12.988 12.988 0 0 1-1.873.89.077.077 0 0 0-.041.106c.34.693.74 1.362 1.199 1.99a.078.078 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.156 2.419 0 1.334-.946 2.419-2.156 2.419zm7.974 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.156 2.419 0 1.334-.946 2.419-2.156 2.419z" />
                        </svg>
                    </a>

                    {/* Bot Status Pill */}
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono tracking-wider transition-all duration-300",
                        botStatus === 'online'
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-white/5 border-white/10 text-white/50"
                    )}>
                        <span className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            botStatus === 'online' ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-gray-500"
                        )} />
                        {botStatus === 'online' ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
                    </div>

                    {/* Profile Dropdown Trigger */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-4 transition-all duration-200 hover:opacity-80 outline-none group">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-sm font-bold text-white tracking-wider group-hover:text-primary transition-colors">{identity}</span>
                                <span className="text-[10px] text-primary/80 font-mono">GLOBAL NODE • {currentTime}</span>
                            </div>
                            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-gray-800 to-black border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <span className="text-xs font-black text-white">{identity.substring(0, 2)}</span>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 p-1 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 origin-top-right z-50">
                                <div className="p-2 border-b border-white/5 mb-1">
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest pl-2">Command Center</p>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-2 font-light"
                                >
                                    <Clock className="w-3 h-3 text-primary" />
                                    <span>System Logs</span>
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/settings')}
                                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-2 mb-1 font-light"
                                >
                                    <Settings className="w-3 h-3 text-primary" />
                                    <span>Protocol Config</span>
                                </button>
                                <div className="border-t border-white/5 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <LogOut className="w-3 h-3" />
                                        <span>Sever Connection</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
