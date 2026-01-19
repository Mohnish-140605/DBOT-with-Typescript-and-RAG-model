import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Activity, Info, AlertTriangle, AlertCircle } from 'lucide-react'

interface Log {
    id: string
    level: 'info' | 'warn' | 'error'
    message: string
    created_at: string
    details?: any
}

interface ActivityTimelineProps {
    logs: Log[]
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
    const getIcon = (level: string) => {
        switch (level) {
            case 'info': return <Info className="h-4 w-4 text-blue-500" />
            case 'warn': return <AlertTriangle className="h-4 w-4 text-amber-500" />
            case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
            default: return <Activity className="h-4 w-4 text-gray-500" />
        }
    }

    const getBadgeVariant = (level: string) => {
        switch (level) {
            case 'info': return 'secondary'
            case 'warn': return 'warning'
            case 'error': return 'destructive'
            default: return 'outline'
        }
    }

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 h-[400px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    System Activity
                </CardTitle>
                <CardDescription>
                    Real-time logs from the AI agent and system.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No recent activity recorded.
                            </p>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                                    <div className="mt-1">
                                        {getIcon(log.level)}
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{log.message}</p>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(log.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        {log.details && Object.keys(log.details).length > 0 && (
                                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
