import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET
if (!ADMIN_JWT_SECRET) {
  throw new Error('ADMIN_JWT_SECRET environment variable is not set')
}

export async function verifyAdminSession(): Promise<{ email: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null
    const payload = jwt.verify(token, ADMIN_JWT_SECRET) as { email: string }
    return payload
  } catch {
    return null
  }
}

export function signAdminToken(email: string): string {
  return jwt.sign({ email }, ADMIN_JWT_SECRET, { expiresIn: '24h' })
}

export function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}
