import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/app/lib/admin-auth'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: (process.env.POSTGRES_URL || process.env.DATABASE_URL || '').replace(/[?&]sslmode=[^&]*/g, ''),
  ssl: { rejectUnauthorized: false },
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifyAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { ban } = await req.json()

  await pool.query('UPDATE users SET is_banned = $1 WHERE id = $2', [ban, id])
  return NextResponse.json({ success: true, is_banned: ban })
}
