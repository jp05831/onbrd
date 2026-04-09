import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const stepId = formData.get('stepId') as string
    const flowSlug = formData.get('flowSlug') as string

    if (!file || !stepId || !flowSlug) {
      return NextResponse.json({ error: 'file, stepId, and flowSlug required' }, { status: 400 })
    }

    // Verify step belongs to this flow slug
    const step = await database.getStepById(stepId)
    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }
    const flow = await database.getFlowBySlug(flowSlug)
    if (!flow || flow.id !== step.flow_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Only accept uploads for published flows
    if (flow.status !== 'published') {
      return NextResponse.json({ error: 'Flow is not active' }, { status: 403 })
    }

    // Don't accept re-uploads for already-completed steps
    if (step.completed && step.uploaded_file_id) {
      return NextResponse.json({ error: 'Step already completed' }, { status: 409 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Validate file type based on step type
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
    const pdfTypes = ['application/pdf']

    if (step.step_type === 'request_photo') {
      if (!imageTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Only image files are allowed for this step (JPG, PNG, GIF, WebP, HEIC)' }, { status: 400 })
      }
    } else if (step.step_type === 'request_pdf') {
      if (!pdfTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Only PDF files are allowed for this step' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'This step does not accept file uploads' }, { status: 400 })
    }

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)

    // Upload to Vercel Blob
    const blob = await put(`uploads/client/${stepId}-${Date.now()}-${safeName}`, file, {
      access: 'public',
    })

    await database.updateStep(stepId, {
      uploaded_file_id: blob.url,
      uploaded_file_name: file.name.slice(0, 500),
      completed: true,
      completed_at: new Date().toISOString()
    } as any)

    const allSteps = await database.getStepsByFlowId(step.flow_id)
    const allComplete = allSteps.every(s => s.completed || s.id === stepId)
    if (allComplete) {
      await database.updateFlow(step.flow_id, {
        status: 'completed',
        completed_at: new Date().toISOString()
      } as any)
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
