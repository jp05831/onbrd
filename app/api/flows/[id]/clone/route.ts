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

    if (!flow.is_template) {
      return NextResponse.json({ error: 'Only templates can be cloned' }, { status: 400 })
    }

    const body = await request.json()
    const { client_name, client_email } = body

    if (!client_name?.trim()) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
    }

    const { id, slug } = await database.cloneFlow(flowId, client_name.trim(), client_email)

    return NextResponse.json({ id, slug })
  } catch (error) {
    console.error('Clone flow error:', error)
    return NextResponse.json({ error: 'Failed to clone flow' }, { status: 500 })
  }
}
