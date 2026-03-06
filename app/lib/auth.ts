import { auth } from '../../auth'
import database from './db'

export async function getSession() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return null
  }

  const user = database.getUserByEmail(session.user.email)
  
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
}
