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
    const flow = database.getFlowById(flowId)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    const body = await request.json()
    database.updateStep(stepId, body)

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
    const flow = database.getFlowById(flowId)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    database.deleteStep(stepId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete step error:', error)
    return NextResponse.json({ error: 'Failed to delete step' }, { status: 500 })
  }
}
