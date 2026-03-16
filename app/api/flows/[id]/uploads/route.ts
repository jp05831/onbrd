import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/auth'
import database from '../../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const flow = await database.getFlowById(id)

    if (!flow) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    if (flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const uploads = await database.getUploadedStepsByFlowId(id)

    return NextResponse.json({ uploads })
  } catch (error) {
    console.error('Get uploads error:', error)
    return NextResponse.json({ error: 'Failed to fetch uploads' }, { status: 500 })
  }
}
