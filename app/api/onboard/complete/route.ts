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
    if (flow.status !== 'published') {
      return NextResponse.json({ error: 'Flow is not active' }, { status: 403 })
    }

    await database.completeStep(stepId)

    await database.logActivity(flow.id, 'step_completed', step.title).catch(console.error)

    const allSteps = await database.getStepsByFlowId(flow.id)
    const allDone = allSteps.every(s => s.id === stepId ? true : s.completed)
    const owner = await database.getUserById(flow.user_id)

    if (allDone) {
      if (flow.client_email) {
        const { sendClientCompletionEmail } = await import('../../../lib/email')
        await sendClientCompletionEmail(flow.client_email, flow.client_name, owner?.company_name || owner?.name || 'Your provider', flow.completion_message).catch(console.error)
      }
      if (owner) {
        const { sendFlowCompletionToOwner } = await import('../../../lib/email')
        await sendFlowCompletionToOwner(owner.email, flow.client_name).catch(console.error)
      }
    } else {
      // Notify owner of individual step completion (not sent when flow finishes — that gets its own email)
      if (owner) {
        const { sendStepCompletedToOwner } = await import('../../../lib/email')
        await sendStepCompletedToOwner(owner.email, flow.client_name, step.title, flow.slug).catch(console.error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete step error:', error)
    return NextResponse.json({ error: 'Failed to complete step' }, { status: 500 })
  }
}
