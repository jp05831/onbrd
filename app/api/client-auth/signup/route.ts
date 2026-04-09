import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import database from '../../../lib/db'
import { signupRateLimit, getIP } from '@/app/lib/ratelimit'

export async function POST(req: NextRequest) {
  if (await signupRateLimit(getIP(req))) {
    return NextResponse.json({ error: 'Too many signups. Please try again later.' }, { status: 429 })
  }

  try {
    const { email, password, name, flowSlug } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (name.length > 200) {
      return NextResponse.json({ error: 'Name too long' }, { status: 400 })
    }

    const existing = await database.getClientAccountByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 400 })
    }

    const clientId = await database.createClientAccount(email, password, name)

    if (flowSlug) {
      const flow = await database.getFlowBySlug(flowSlug)
      // Only link the flow if the owner explicitly set this email on it — never link flows with no email set
      if (flow && flow.client_email && flow.client_email.toLowerCase() === email.toLowerCase()) {
        await database.linkFlowToClientAccount(flow.id, clientId)
      }
    }

    const token = await database.createClientSession(clientId)

    const cookieStore = await cookies()
    cookieStore.set('client_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({ success: true, clientId })
  } catch (error) {
    console.error('Client signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
