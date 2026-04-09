import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import database from '../../../lib/db'
import { sendVerificationEmail } from '../../../lib/email'
import { signupRateLimit, getIP } from '../../lib/ratelimit'

export async function POST(request: NextRequest) {
  if (await signupRateLimit(getIP(request))) {
    return NextResponse.json({ error: 'Too many signups from this IP. Please try again later.' }, { status: 429 })
  }

  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await database.getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const userId = await database.createUser(email, password, name)
    const token = randomUUID()
    await database.setVerificationToken(userId, token)

    await sendVerificationEmail(email, token)

    return NextResponse.json({ success: true, requiresVerification: true })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({
      error: error?.message || 'Signup failed',
      details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined,
    }, { status: 500 })
  }
}
