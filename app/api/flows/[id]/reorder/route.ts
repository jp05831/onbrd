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

    const body = await request.json()
    const { stepIds } = body

    if (!Array.isArray(stepIds) || stepIds.some((id: any) => typeof id !== 'string')) {
      return NextResponse.json({ error: 'stepIds must be an array of strings' }, { status: 400 })
    }

    // Verify all stepIds belong to this flow
    const existingSteps = await database.getStepsByFlowId(flowId)
    const validIds = new Set(existingSteps.map(s => s.id))
    if (stepIds.some((id: string) => !validIds.has(id))) {
      return NextResponse.json({ error: 'Invalid step IDs' }, { status: 400 })
    }

    await database.reorderSteps(flowId, stepIds)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reorder steps error:', error)
    return NextResponse.json({ error: 'Failed to reorder steps' }, { status: 500 })
  }
}
