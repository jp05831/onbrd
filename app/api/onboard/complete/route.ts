import { NextRequest, NextResponse } from 'next/server'
import database from '../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { stepId } = await request.json()

    if (!stepId) {
      return NextResponse.json({ error: 'Step ID required' }, { status: 400 })
    }

    await database.completeStep(stepId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete step error:', error)
    return NextResponse.json({ error: 'Failed to complete step' }, { status: 500 })
  }
}
