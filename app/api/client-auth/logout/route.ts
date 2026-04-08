import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import database from '../../../lib/db'

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('client_token')?.value

    if (token) {
      await database.deleteClientSession(token)
    }

    cookieStore.delete('client_token')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Client logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
