import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { flowSlug } = await request.json()
    if (!flowSlug) return NextResponse.json({ ok: true })
    const flow = await database.getFlowBySlug(flowSlug)
    if (flow) await database.logActivity(flow.id, 'portal_opened').catch(() => {})
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
