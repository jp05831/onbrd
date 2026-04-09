import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'
import { onboardRateLimit, getIP } from '@/app/lib/ratelimit'

export async function POST(request: NextRequest) {
  if (await onboardRateLimit(getIP(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  try {
    const { stepId, flowSlug } = await request.json()

    if (!stepId || !flowSlug) {
      return NextResponse.json({ error: 'stepId and flowSlug required' }, { status: 400 })
    }

    const step = await database.getStepById(stepId)
    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }
    const flow = await database.getFlowBySlug(flowSlug)
    if (!flow || flow.id !== step.flow_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await database.updateStep(stepId, {
      completed: false,
      completed_at: null,
      uploaded_file_id: null,
      uploaded_file_name: null
    } as any)

    if (flow.status === 'completed') {
      await database.updateFlow(flow.id, {
        status: 'published',
        completed_at: null
      } as any)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Uncomplete step error:', error)
    return NextResponse.json({ error: 'Failed to uncomplete step' }, { status: 500 })
  }
}
