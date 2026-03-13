import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getSession } from '../../../lib/auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN not configured')
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file type (only PDF for now)
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'pdf'
    const storedName = `${crypto.randomBytes(16).toString('hex')}.${ext}`
    const filePath = `uploads/${session.user.id}/${storedName}`

    // Upload to Vercel Blob
    const blob = await put(filePath, file, {
      access: 'public',
      contentType: file.type,
      token,
    })

    return NextResponse.json({ 
      id: storedName,
      name: file.name,
      size: file.size,
      url: blob.url
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
