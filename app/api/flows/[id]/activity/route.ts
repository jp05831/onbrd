import { NextRequest, NextResponse } from 'next/server'
import database from '../../../../lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const flow = await database.getFlowById(id)
    if (!flow) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const activity = await database.getActivityByFlowId(id)
    return NextResponse.json({ activity })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
