import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../../lib/auth'
import database from '../../../../../lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: flowId, stepId } = await params
    const flow = await database.getFlowById(flowId)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    const step = await database.getStepById(stepId)
    if (!step || step.flow_id !== flowId) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }

    const body = await request.json()
    const allowedFields = ['title', 'description', 'url', 'step_type', 'file_id', 'file_name', 'position'] as const
    const updates: Record<string, any> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field]
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }
    // Validate step_type enum
    if (updates.step_type !== undefined && !['link', 'request_pdf', 'request_photo'].includes(updates.step_type)) {
      return NextResponse.json({ error: 'Invalid step_type' }, { status: 400 })
    }
    // Block dangerous URL protocols
    if (updates.url) {
      try {
        const proto = new URL(updates.url).protocol
        if (!['http:', 'https:', 'mailto:'].includes(proto)) {
          return NextResponse.json({ error: 'URL must use http, https, or mailto' }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
    }
    await database.updateStep(stepId, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update step error:', error)
    return NextResponse.json({ error: 'Failed to update step' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: flowId, stepId } = await params
    const flow = await database.getFlowById(flowId)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    const step = await database.getStepById(stepId)
    if (!step || step.flow_id !== flowId) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }

    await database.deleteStep(stepId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete step error:', error)
    return NextResponse.json({ error: 'Failed to delete step' }, { status: 500 })
  }
}
