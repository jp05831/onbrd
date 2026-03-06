import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import database from '../../../lib/db'

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
    const flow = database.getFlowById(id)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    const steps = database.getStepsByFlowId(id)

    return NextResponse.json({ flow, steps })
  } catch (error) {
    console.error('Get flow error:', error)
    return NextResponse.json({ error: 'Failed to fetch flow' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const flow = database.getFlowById(id)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    const body = await request.json()
    database.updateFlow(id, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update flow error:', error)
    return NextResponse.json({ error: 'Failed to update flow' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const flow = database.getFlowById(id)

    if (!flow || flow.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }

    database.deleteFlow(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete flow error:', error)
    return NextResponse.json({ error: 'Failed to delete flow' }, { status: 500 })
  }
}
