import { Sidebar } from "@/components/layout/Sidebar"
import { TopNav } from "@/components/dashboard/TopNav"
import CursorEffect from "@/components/ui/cursor-effect"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-black text-white">
            <CursorEffect />
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav botStatus="online" />
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Dark Grid Pattern */}
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                    <div className="relative z-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
