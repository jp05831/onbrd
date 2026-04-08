import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import database from '../../../lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await database.getClientAccountByEmail(email)
    if (!client || !client.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = database.verifyPassword(password, client.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await database.createClientSession(client.id)

    const cookieStore = await cookies()
    cookieStore.set('client_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    const flows = await database.getFlowsByClientAccountId(client.id)

    return NextResponse.json({
      success: true,
      flows: flows.map(f => ({
        id: f.id,
        slug: f.slug,
        client_name: f.client_name,
        status: f.status,
      })),
    })
  } catch (error) {
    console.error('Client login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
