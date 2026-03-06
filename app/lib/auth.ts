import { auth } from '../../auth'
import database from './db'

export async function getSession() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return null
    }

    const user = await database.getUserByEmail(session.user.email)
    
    if (!user) {
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
    console.error('Session error:', error)
    return null
  }
}
