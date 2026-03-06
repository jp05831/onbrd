import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { getSession } from '../../lib/auth'
import database from '../../lib/db'

export async function GET() {
  try {
    // Get raw NextAuth session
    const nextAuthSession = await auth()
    
    // Get our custom session
    const customSession = await getSession()
    
    // If we have a user, get their flows
    let flows = null
    let dbUser = null
    
    if (customSession?.user?.id) {
      flows = await database.getFlowsByUserId(customSession.user.id)
      dbUser = await database.getUserById(customSession.user.id)
    }
    
    // Also try looking up by email directly
    let userByEmail = null
    let flowsByEmail = null
    if (nextAuthSession?.user?.email) {
      userByEmail = await database.getUserByEmail(nextAuthSession.user.email)
      if (userByEmail) {
        flowsByEmail = await database.getFlowsByUserId(userByEmail.id)
      }
    }
    
    return NextResponse.json({
      nextAuthSession: {
        user: nextAuthSession?.user,
        expires: nextAuthSession?.expires,
      },
      customSession,
      dbUser: dbUser ? { id: dbUser.id, email: dbUser.email, name: dbUser.name } : null,
      flowCount: flows?.length || 0,
      userByEmail: userByEmail ? { id: userByEmail.id, email: userByEmail.email } : null,
      flowsByEmailCount: flowsByEmail?.length || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
