import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const user = await database.verifyResetToken(token)

    if (!user) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }

    const hash = bcrypt.hashSync(password, 10)
    await database.resetPassword(user.id, hash)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[reset-password] error:', error)
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 })
  }
}
