"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CursorEffect() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

    useEffect(() => {
        // Disable on mobile/touch devices or reduced motion
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)")
        if (mediaQuery.matches) return

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })

            // Randomly spawn sparkles on movement (throttled)
            if (Math.random() > 0.9) {
                addSparkle(e.clientX, e.clientY)
            }
        }

        const addSparkle = (x: number, y: number) => {
            const id = Date.now() + Math.random()
            setSparkles(prev => [...prev.slice(-10), { id, x, y }])

            // Cleanup
            setTimeout(() => {
                setSparkles(prev => prev.filter(s => s.id !== id))
            }, 500)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Radial Light */}
            <div
                className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] transition-transform duration-75"
                style={{ left: mousePosition.x, top: mousePosition.y }}
            />

            {/* Sparkles */}
            <AnimatePresence>
                {sparkles.map(sparkle => (
                    <motion.div
                        key={sparkle.id}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 1.5, rotate: 180 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute h-2 w-2 text-accent-foreground"
                        style={{ left: sparkle.x, top: sparkle.y }}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                        </svg>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
