import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=missing', request.url))
  }

  const user = await database.verifyEmail(token)

  if (!user) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', request.url))
  }

  return NextResponse.redirect(new URL('/login?verified=1', request.url))
}
