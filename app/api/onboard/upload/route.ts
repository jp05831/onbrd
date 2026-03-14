import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const stepId = formData.get('stepId') as string

    if (!file || !stepId) {
      return NextResponse.json({ error: 'File and stepId required' }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`uploads/client/${stepId}-${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Update the step with the uploaded file info and mark as complete
    await database.updateStep(stepId, {
      uploaded_file_id: blob.url,
      uploaded_file_name: file.name,
      completed: true,
      completed_at: new Date().toISOString()
    } as any)

    // Check if all steps are complete and update flow status
    const step = await database.getStepById?.(stepId)
    if (step) {
      const allSteps = await database.getStepsByFlowId(step.flow_id)
      const allComplete = allSteps.every(s => s.completed || s.id === stepId)
      if (allComplete) {
        await database.updateFlow(step.flow_id, { 
          status: 'completed',
          completed_at: new Date().toISOString()
        } as any)
      }
    }

    return NextResponse.json({ 
      url: blob.url, 
      name: file.name,
      success: true 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
