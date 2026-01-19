'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Sidebar() {
    const pathname = usePathname()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    const navItems = [
        { name: 'Agent Config', href: '/dashboard', icon: '⚡' },
        // Placeholder for future features
        { name: 'Analytics', href: '/dashboard/analytics', icon: '📊' },
        { name: 'Logs', href: '/dashboard/logs', icon: '📝' },
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    ]

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    🤖 Discord Copilot
                </h1>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-md transition-colors"
                >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}
