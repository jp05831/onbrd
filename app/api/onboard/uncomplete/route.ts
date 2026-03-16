import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { stepId } = await request.json()

    if (!stepId) {
      return NextResponse.json({ error: 'Step ID required' }, { status: 400 })
    }

    // Get the step to find its flow
    const step = await database.getStepById(stepId)
    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 })
    }

    // Uncomplete the step and clear any uploaded file
    await database.updateStep(stepId, { 
      completed: false, 
      completed_at: null,
      uploaded_file_id: null,
      uploaded_file_name: null
    } as any)

    // If the flow was marked completed, revert it to published
    const flow = await database.getFlowById(step.flow_id)
    if (flow && flow.status === 'completed') {
      await database.updateFlow(step.flow_id, { 
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
