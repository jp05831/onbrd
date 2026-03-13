import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = session.user.id

    // Update user plan to free
    await database.updateUser(userId, { plan: 'free', is_pro: false })

    return NextResponse.json({ 
      success: true,
      message: 'Your subscription has been cancelled. You will retain access until the end of your billing period.'
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
