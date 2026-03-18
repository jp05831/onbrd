import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { stepId, flowSlug } = await request.json()

    if (!stepId || !flowSlug) {
      return NextResponse.json({ error: 'stepId and flowSlug required' }, { status: 400 })
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

    await database.completeStep(stepId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete step error:', error)
    return NextResponse.json({ error: 'Failed to complete step' }, { status: 500 })
  }
}
