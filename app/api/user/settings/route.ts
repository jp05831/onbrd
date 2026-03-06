import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import database from '../../../lib/db'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, company_name, logo_url } = body

    database.updateUser(session.user.id, {
      name: name || session.user.name,
      company_name: company_name || null,
      logo_url: logo_url || null,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
