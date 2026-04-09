import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import database from '../../../lib/db'
import { loginRateLimit, getIP } from '../../lib/ratelimit'

export async function POST(request: NextRequest) {
  if (await loginRateLimit(getIP(request))) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Find user (getUserByEmail already returns undefined for banned users)
    const user = await database.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check account lockout
    if (await database.isAccountLocked(user.id)) {
      return NextResponse.json({ error: 'Account temporarily locked. Try again in 15 minutes.' }, { status: 429 })
    }

    // Verify password (OAuth users have no password)
    if (!user.password_hash || !database.verifyPassword(password, user.password_hash)) {
      await database.recordFailedLogin(user.id)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await database.clearFailedLogins(user.id)

    // Create session
    const token = await database.createSession(user.id)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
