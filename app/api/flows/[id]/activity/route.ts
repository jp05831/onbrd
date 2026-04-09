import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/auth'
import database from '../../../../lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const flow = await database.getFlowById(id)
    if (!flow) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (flow.user_id !== session.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const activity = await database.getActivityByFlowId(id)
    return NextResponse.json({ activity })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
