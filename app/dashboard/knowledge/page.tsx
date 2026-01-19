'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    FileText,
    Upload,
    Trash2
} from 'lucide-react'

interface Document {
    id: string
    filename: string
    uploaded_at: string
    chunk_count?: number
}

export default function KnowledgePage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        loadDocuments()
    }, [])

    const loadDocuments = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .order('uploaded_at', { ascending: false })

            if (!error && data) {
                setDocuments(data)
            }
        } catch (error) {
            console.error('Failed to load documents:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Failed to upload PDF')

            const result = await response.json()
            alert(`PDF uploaded successfully! Processed ${result.chunks_count} chunks.`)
            e.target.value = ''
            loadDocuments()
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload PDF')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (docId: string) => {
        if (!confirm('Are you sure you want to delete this document? All associated knowledge chunks will be removed.')) {
            return
        }

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', docId)

            if (error) throw error

            setDocuments(prev => prev.filter(doc => doc.id !== docId))
        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete document')
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-[200px]" />
                <div className="space-y-2">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                <p className="text-muted-foreground mt-2">
                    Upload documents to train your AI. It uses RAG to retrieve relevant context.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Upload Documents
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Supported formats: PDF (Max 10MB)
                            </CardDescription>
                        </div>
                        <Badge variant="success" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                            RAG Active
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Upload Zone */}
                    <div className="border-2 border-dashed rounded-xl p-10 text-center hover:bg-muted/50 transition-all duration-200 group relative overflow-hidden">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="relative z-0">
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/5 mb-4 group-hover:bg-primary/10 transition-colors">
                                <Upload className="h-8 w-8 text-primary/70" />
                            </div>
                            {uploading ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium animate-pulse">Processing document chunks...</p>
                                    <p className="text-xs text-muted-foreground">This uses OpenAI Embeddings</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        Click or drag to upload PDF
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Documents are automatically chunked and vector-indexed.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Document List */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Library ({documents.length})</h3>
                        {documents.length > 0 ? (
                            <div className="grid gap-2">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-primary/10">
                                                <FileText className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{doc.filename}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono text-muted-foreground">
                                                        PDF
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(doc.uploaded_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(doc.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-sm">No documents uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
