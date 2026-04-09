import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import database from '../../../lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const flows = await database.getFlowsByUserId(session.user.id)
    const rows = [
      ['Client Name', 'Status', 'Steps Total', 'Steps Completed', 'Created', 'Completed At'],
      ...flows.filter((f: any) => !f.is_template).map((f: any) => [
        f.client_name, f.status, f.total_steps, f.completed_steps,
        new Date(f.created_at).toLocaleDateString(),
        f.completed_at ? new Date(f.completed_at).toLocaleDateString() : '',
      ])
    ]
    const csv = rows.map((r: any[]) => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="onbrd-clients-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
