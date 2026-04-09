import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import { createClient } from '@supabase/supabase-js'

// Use the anon key — no need for service role here, we're just resolving a public URL
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require authentication — files are private to the owner
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Basic input validation — prevent path traversal
  if (!id || !/^[a-zA-Z0-9._-]+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid file id' }, { status: 400 })
  }

  // Files are stored at uploads/{userId}/{filename}
  // Restrict to only the authenticated user's own files
  const filePath = `uploads/${session.user.id}/${id}`

  const { data: urlData } = supabase.storage
    .from('files')
    .getPublicUrl(filePath)

  if (!urlData?.publicUrl) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  return NextResponse.redirect(urlData.publicUrl)
}
