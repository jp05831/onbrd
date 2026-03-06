import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { stepId } = await request.json()

    if (!stepId) {
      return NextResponse.json({ error: 'Step ID required' }, { status: 400 })
    }

    // Complete the step
    const flowId = database.completeStep(stepId)

    // Get flow and owner for notification
    const flow = database.getFlowById(flowId)
    if (flow) {
      const user = database.getUserById(flow.user_id)
      const steps = database.getStepsByFlowId(flowId)
      const completedStep = steps.find(s => s.id === stepId)
      
      // Send email notification if user is on pro plan
      // (In production, you'd use a real email service)
      if (user && user.plan === 'pro' && user.email) {
        console.log(`[Email] Notify ${user.email}: ${flow.client_name} completed "${completedStep?.title}"`)
        // TODO: Implement actual email sending with nodemailer or similar
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete step error:', error)
    return NextResponse.json({ error: 'Failed to complete step' }, { status: 500 })
  }
}
