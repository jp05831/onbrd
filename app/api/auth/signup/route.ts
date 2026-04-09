import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import database from '../../../lib/db'
import { sendVerificationEmail } from '../../../lib/email'

// Signup spam protection: 5 accounts per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) { rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); return false }
  if (entry.count >= 5) return true
  entry.count++; return false
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
  if (isRateLimited(ip)) return NextResponse.json({ error: 'Too many signups from this IP. Please try again later.' }, { status: 429 })

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
