'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Sparkles,
    Hash,
    Save,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'

interface AgentConfig {
    id: string
    system_instructions: string
    allowed_channel_ids: string[]
    updated_at?: string
}

export default function SettingsPage() {
    const [config, setConfig] = useState<AgentConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [systemInstructions, setSystemInstructions] = useState('')
    const [channelIds, setChannelIds] = useState('')
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        loadConfig()
    }, [])

    useEffect(() => {
        if (config) {
            const hasChanges =
                systemInstructions !== (config.system_instructions || '') ||
                channelIds !== (config.allowed_channel_ids?.join(', ') || '')
            setHasUnsavedChanges(hasChanges)
        }
    }, [systemInstructions, channelIds, config])

    const loadConfig = async () => {
        try {
            const response = await fetch('/api/config')
            if (!response.ok) throw new Error('Failed to load config')
            const data = await response.json()
            setConfig(data)
            setSystemInstructions(data.system_instructions || '')
            setChannelIds(data.allowed_channel_ids?.join(', ') || '')
        } catch (error) {
            console.error('Failed to load config:', error)
        } finally {
            setLoading(false)
        }
    }

    const saveConfig = async () => {
        setSaving(true)
        setSaveSuccess(false)
        try {
            const channelIdsArray = channelIds
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0)

            const response = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: config?.id,
                    system_instructions: systemInstructions,
                    allowed_channel_ids: channelIdsArray,
                }),
            })

            if (!response.ok) throw new Error('Failed to save config')

            const updated = await response.json()
            setConfig(updated)
            setHasUnsavedChanges(false)
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (error) {
            console.error('Failed to save config:', error)
            alert('Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[200px]" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your AI agent's behavior and personality.
                </p>
            </div>

            {/* Unsaved Changes Alert */}
            {hasUnsavedChanges && (
                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription>
                        You have unsaved changes.
                    </AlertDescription>
                </Alert>
            )}

            {/* Save Success Alert */}
            {saveSuccess && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                        Configuration saved successfully!
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6">
                {/* System Instructions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    System Instructions
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    Define how your AI behaves across Discord. Be explicit and intentional.
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">Core Personality</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={systemInstructions}
                            onChange={(e) => setSystemInstructions(e.target.value)}
                            className="min-h-[250px] font-mono text-sm leading-relaxed"
                            placeholder="You are a helpful AI assistant that..."
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Tip: Include tone guidelines (e.g., "be concise", "use emojis") and interaction rules.
                        </p>
                    </CardContent>
                </Card>

                {/* Channel Access Control */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Hash className="h-5 w-5 text-primary" />
                            Allowed Discord Channels
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Restricts bot responses to specific channels for security.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="text"
                            value={channelIds}
                            onChange={(e) => setChannelIds(e.target.value)}
                            className="font-mono"
                            placeholder="123456789, 987654321"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Enter Channel IDs separated by commas.
                        </p>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end pb-8">
                    <Button
                        onClick={saveConfig}
                        disabled={saving || !hasUnsavedChanges}
                        size="lg"
                        className="gap-2 min-w-[150px]"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
