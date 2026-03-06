import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // The id is the filename stored in Supabase
  // We need to find the file - for now, redirect to the Supabase public URL
  // This assumes files are stored as: uploads/{userId}/{id}
  
  // Since we don't know the userId here, we'll search for the file
  const { data: files, error } = await supabase.storage
    .from('files')
    .list('uploads', {
      search: id,
    })

  if (error || !files || files.length === 0) {
    // Try getting direct URL if file exists
    const { data: urlData } = supabase.storage
      .from('files')
      .getPublicUrl(`uploads/${id}`)
    
    if (urlData?.publicUrl) {
      return NextResponse.redirect(urlData.publicUrl)
    }
    
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // Redirect to the public URL
  const { data: urlData } = supabase.storage
    .from('files')
    .getPublicUrl(`uploads/${files[0].name}`)

  return NextResponse.redirect(urlData.publicUrl)
}
