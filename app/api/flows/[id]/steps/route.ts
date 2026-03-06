import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/auth'
import database from '../../../../lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: flowId } = await params
    const flow = await database.getFlowById(flowId)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    // Check step limit for free plan
    const user = await database.getUserById(session.user.id)
    if (user?.plan !== 'pro') {
      const existingSteps = await database.getStepsByFlowId(flowId)
      if (existingSteps.length >= 2) {
        return NextResponse.json({ error: 'Free plan limited to 2 steps per flow. Upgrade to Pro for unlimited steps.' }, { status: 403 })
      }
    }

    const body = await request.json()
    const { title, description, url, position, file_id, file_name } = body

    const stepId = await database.createStep(flowId, title, description, url || null, position, file_id, file_name)

    return NextResponse.json({ id: stepId })
  } catch (error) {
    console.error('Create step error:', error)
    return NextResponse.json({ error: 'Failed to create step' }, { status: 500 })
  }
}
