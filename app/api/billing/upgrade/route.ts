import { NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import database from '../../../lib/db'

// Demo upgrade endpoint (when Stripe is not configured)
export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Upgrade user to pro
    database.updateUser(session.user.id, { plan: 'pro' })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Upgrade error:', error)
    return NextResponse.json({ error: 'Failed to upgrade' }, { status: 500 })
  }
}
