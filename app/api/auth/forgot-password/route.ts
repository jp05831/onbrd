import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import database from '../../../lib/db'
import { sendPasswordResetEmail } from '../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await database.getUserByEmail(email)

    if (user) {
      const token = randomUUID()
      await database.setResetToken(user.id, token)
      await sendPasswordResetEmail(email, token)
    }

    // Always return success to avoid revealing if email exists
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
