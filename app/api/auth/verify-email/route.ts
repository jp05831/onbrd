import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'

export async function GET(request: NextRequest) {
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
