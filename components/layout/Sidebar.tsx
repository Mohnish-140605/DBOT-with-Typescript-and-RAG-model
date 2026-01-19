"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import {
    LayoutDashboard,
    Settings,
    BookOpen,
    MessageSquare,
    ChevronLeft,
    ChevronRight
} from "lucide-react"


export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const [userEmail, setUserEmail] = useState("Loading...")
    const [userInitials, setUserInitials] = useState("..")
    const pathname = usePathname()

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) {
                setUserEmail(user.email)
                setUserInitials(user.email.substring(0, 2).toUpperCase())
            }
        }
        getUser()
    }, [])

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: BookOpen, label: "Knowledge", href: "/dashboard/knowledge" },
        { icon: MessageSquare, label: "Memory", href: "/dashboard/memory" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ]

    return (
        <div
            className={cn(
                "relative flex flex-col border-r border-white/10 bg-black transition-all duration-300 ease-in-out h-screen text-white",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black text-white hover:border-primary hover:text-primary transition-all z-50"
            >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Logo Area */}
            <div className={cn("flex h-20 items-center border-b border-white/10 px-6", collapsed ? "justify-center" : "gap-3")}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary text-white font-bold">
                    F
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="font-bold tracking-tighter text-lg leading-none">FIGMENTA</span>
                        <span className="text-[10px] text-white/40 tracking-widest uppercase">Node Access</span>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 space-y-1 p-3 mt-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                            pathname === item.href
                                ? "bg-white text-black shadow-lg shadow-white/10"
                                : "text-white/60 hover:text-white hover:bg-white/5",
                            collapsed ? "justify-center" : "gap-3"
                        )}
                    >
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors",
                            pathname === item.href ? "text-black" : "group-hover:text-white"
                        )} />

                        {!collapsed && (
                            <span className="tracking-wide">{item.label}</span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* User Info (Bottom) */}
            <div className="border-t border-white/10 p-4 bg-white/5">
                <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white uppercase">
                        {userInitials}
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col animate-fade-in">
                            <span className="text-sm font-bold text-white truncate max-w-[140px]" title={userEmail}>
                                {userEmail.split('@')[0]}
                            </span>
                            <span className="text-xs text-primary tracking-wider uppercase">System Operator</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
