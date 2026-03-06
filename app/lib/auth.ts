import { auth } from '../../auth'
import database from './db'

export async function getSession() {
  try {
    const session = await auth()
    
    console.log('[getSession] NextAuth session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      console.log('[getSession] No email in session')
      return null
    }

    const user = await database.getUserByEmail(session.user.email)
    
    console.log('[getSession] Database user:', user?.id, user?.email)
    
    if (!user) {
      console.log('[getSession] User not found in database')
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      }
    }
  } catch (error) {
    console.error('[getSession] Error:', error)
    return null
  }
}
