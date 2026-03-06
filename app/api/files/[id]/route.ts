import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import database from '../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const file = database.getFileById(id)
  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  try {
    const filePath = path.join(process.cwd(), 'uploads', file.stored_name)
    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.mime_type,
        'Content-Disposition': `inline; filename="${file.original_name}"`,
        'Content-Length': file.size.toString(),
      },
    })
  } catch (error) {
    console.error('File read error:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
