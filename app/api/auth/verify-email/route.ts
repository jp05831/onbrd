import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'
import { forgotPasswordRateLimit, getIP } from '@/app/lib/ratelimit'

export async function GET(request: NextRequest) {
  // Rate limit token verification attempts (prevents enumeration)
  if (await forgotPasswordRateLimit(getIP(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'missing' }, { status: 400 })
  }

  const user = await database.verifyEmail(token)

  if (!user) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  return NextResponse.json({ success: true, email: user.email })
}
