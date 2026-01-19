
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ConnectingLoader({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0)

    // Steps: 
    // 0: Initializing
    // 1: Locating user
    // 2: Connecting to Figmenta Node
    // 3: Authenticating
    // 4: Access Granted

    useEffect(() => {
        const timer = setTimeout(() => {
            if (step < 4) {
                setStep(s => s + 1)
            } else {
                setTimeout(onComplete, 800)
            }
        }, step === 0 ? 500 : step === 1 ? 1200 : step === 2 ? 1500 : 800)

        return () => clearTimeout(timer)
    }, [step, onComplete])

    const steps = [
        "INITIALIZING PROTOCOL...",
        "TRIANGULATING SIGNAL...",
        "CONNECTING TO GLOBAL NODE...",
        "VERIFYING CREDENTIALS...",
        "ACCESS GRANTED"
    ]

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white px-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
            <div className="w-full max-w-md">
                {/* Animated Digital Cube/Globe Placeholder */}
                <div className="flex justify-center mb-12">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5],
                            rotate: [0, 90, 180, 270, 360]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-2 border-primary/50 relative"
                    >
                        <div className="absolute inset-2 border border-white/20" />
                        <div className="absolute inset-0 bg-primary/10 blur-xl" />
                    </motion.div>
                </div>

                {/* Status Text */}
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl font-bold tracking-tighter text-center"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {steps[step]}
                        </motion.h2>
                    </AnimatePresence>

                    {/* Progress Bar */}
                    <div className="h-1 bg-white/10 w-full overflow-hidden rounded-full">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step + 1) * 20}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <div className="flex justify-between text-xs text-white/40 font-mono pt-2">
                        <span>SECURE CONNECTION</span>
                        <span>V1.0.4</span>
                    </div>
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        </motion.div>
    )
}
