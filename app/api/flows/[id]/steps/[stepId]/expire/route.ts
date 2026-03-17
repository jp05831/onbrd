import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../../../lib/auth'
import database from '../../../../../../lib/db'

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

    const body = await request.json()
    // expire_days: 7 | 30 | null (null = never)
    const expireDays: number | null = body.expire_days ?? null

    if (expireDays !== null && expireDays !== 7 && expireDays !== 30) {
      return NextResponse.json({ error: 'expire_days must be 7, 30, or null' }, { status: 400 })
    }

    await database.setStepExpiry(stepId, expireDays)

    const step = await database.getStepById(stepId)
    return NextResponse.json({ success: true, expire_at: step?.expire_at ?? null, expire_days: step?.expire_days ?? null })
  } catch (error) {
    console.error('Set expiry error:', error)
    return NextResponse.json({ error: 'Failed to set expiry' }, { status: 500 })
  }
}
