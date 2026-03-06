import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../lib/auth'
import database from '../../lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const flows = database.getFlowsByUserId(session.user.id)
    const activeFlows = database.getActiveFlowCount(session.user.id)
    
    return NextResponse.json({
      flows,
      userPlan: {
        plan: session.user.plan,
        activeFlows,
        maxFlows: session.user.plan === 'pro' ? Infinity : 3,
      }
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

    // Check flow limit for free plan
    if (session.user.plan === 'free') {
      const activeFlows = database.getActiveFlowCount(session.user.id)
      if (activeFlows >= 3) {
        return NextResponse.json({ 
          error: 'Free plan limited to 3 active flows. Upgrade to Pro for unlimited.' 
        }, { status: 403 })
      }
    }

    const body = await request.json()
    const { client_name, client_email, welcome_message } = body

    if (!client_name) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
    }

    const { id, slug } = database.createFlow(
      session.user.id,
      client_name,
      client_email,
      welcome_message
    )

    return NextResponse.json({ id, slug })
  } catch (error) {
    console.error('Create flow error:', error)
    return NextResponse.json({ error: 'Failed to create flow' }, { status: 500 })
  }
}
