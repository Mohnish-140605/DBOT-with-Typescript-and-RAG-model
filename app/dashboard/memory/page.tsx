'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    MessageSquare,
    RotateCcw,
    BrainCircuit,
    History
} from 'lucide-react'

export default function MemoryPage() {
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadMemory()
    }, [])

    const loadMemory = async () => {
        try {
            const response = await fetch('/api/config')
            if (!response.ok) throw new Error('Failed to load config')
            const data = await response.json()
            setSummary(data.conversation_summary || '')
        } catch (error) {
            console.error('Failed to load memory:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleResetMemory = async () => {
        if (!confirm('Are you sure you want to reset conversation memory? This action cannot be undone.')) {
            return
        }

        try {
            const response = await fetch('/api/memory/reset', {
                method: 'POST',
            })

            if (!response.ok) throw new Error('Failed to reset memory')

            setSummary('')
            alert('Memory reset successfully!')
        } catch (error) {
            console.error('Failed to reset memory:', error)
            alert('Failed to reset memory')
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-[400px]" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Memory</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage the AI's short-term conversational context.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BrainCircuit className="h-5 w-5 text-primary" />
                                        Current Context
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Rolling summary of recent interactions used for continuity.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="bg-muted/30 p-6 rounded-xl min-h-[300px] border font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                                {summary ? summary : (
                                    <span className="text-muted-foreground italic">
                                        Memory is empty. It will populate as users chat with the bot.
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Resetting memory clears specific conversation details but keeps system instructions and knowledge base intact.
                            </p>
                            <Button
                                variant="destructive"
                                className="w-full gap-2"
                                onClick={handleResetMemory}
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset Conversation
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="rounded-xl border bg-blue-50/50 p-4">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            How it works
                        </h4>
                        <p className="text-xs text-blue-800/80 leading-relaxed">
                            The bot maintains a "rolling summary" of the last few turns of conversation. This allows it to remember user names and topics without exceeding token limits.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
