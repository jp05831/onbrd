import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../lib/auth'
import database from '../../lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const flows = await database.getFlowsByUserId(session.user.id)
    const user = await database.getUserById(session.user.id)
    const activeFlows = await database.getActiveFlowCount(session.user.id)

    return NextResponse.json({
      flows,
      userPlan: {
        plan: user?.plan || 'free',
        activeFlows,
        maxFlows: user?.plan === 'pro' ? Infinity : 3,
      },
    })
  } catch (error) {
    console.error('Get flows error:', error)
    return NextResponse.json({ error: 'Failed to fetch flows' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await database.getUserById(session.user.id)
    const activeFlows = await database.getActiveFlowCount(session.user.id)

    if (user?.plan !== 'pro' && activeFlows >= 3) {
      return NextResponse.json({ error: 'Upgrade to Pro for more flows' }, { status: 403 })
    }

    const body = await request.json()
    const { client_name, client_email, welcome_message } = body

    if (!client_name) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
    }

    const { id, slug } = await database.createFlow(session.user.id, client_name, client_email, welcome_message)

    return NextResponse.json({ id, slug })
  } catch (error) {
    console.error('Create flow error:', error)
    return NextResponse.json({ error: 'Failed to create flow' }, { status: 500 })
  }
}
