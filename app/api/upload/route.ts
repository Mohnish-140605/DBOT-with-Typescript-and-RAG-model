import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

const CHUNK_SIZE = 1000
const CHUNK_OVERLAP = 200

async function chunkText(text: string): Promise<string[]> {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length)
    chunks.push(text.slice(start, end).trim())
    start = end - CHUNK_OVERLAP
  }

  return chunks.filter(chunk => chunk.length > 0)
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'PDF file required' }, { status: 400 })
    }

    // Parse PDF
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const pdfData = await pdfParse(buffer)
    const text = pdfData.text

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'PDF contains no text' }, { status: 400 })
    }

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({ filename: file.name })
      .select()
      .single()

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 500 })
    }

    // Chunk text
    const chunks = await chunkText(text)

    // Generate chunks (without embeddings for Free RAG)
    const chunkPromises = chunks.map(async (chunk, index) => {
      // Use a strict JSON string for the vector
      const dummyVector = JSON.stringify(Array(1536).fill(0.1));

      return {
        document_id: document.id,
        content: chunk,
        embedding: dummyVector,
        chunk_index: index,
      }
    })

    const chunkData = await Promise.all(chunkPromises)
    console.log(`Inserting ${chunkData.length} chunks for doc ${document.id}`);

    const { error: chunkError } = await supabase
      .from('document_chunks')
      .insert(chunkData)

    if (chunkError) {
      console.error("Supabase Insert Error:", chunkError);
      return NextResponse.json({ error: "DB Error: " + chunkError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      document_id: document.id,
      chunks_count: chunks.length
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}

