import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import database from '../../../lib/db'

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('client_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const session = await database.getClientSession(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }

    const flows = await database.getFlowsByClientAccountId(session.id)

    return NextResponse.json({
      client: {
        id: session.id,
        email: session.email,
        name: session.name,
      },
      flows: flows.map(f => ({
        id: f.id,
        slug: f.slug,
        client_name: f.client_name,
        status: f.status,
        total_steps: (f as any).total_steps,
        completed_steps: (f as any).completed_steps,
      })),
    })
  } catch (error) {
    console.error('Client me error:', error)
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
  }
}
