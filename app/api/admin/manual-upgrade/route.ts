import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const pool = new Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL })

// ONE-TIME USE — delete after use
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== 'onbrd-manual-upgrade-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const check = await pool.query('SELECT id, email, plan FROM users WHERE LOWER(email) = LOWER($1)', [email])
  if (!check.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await pool.query('UPDATE users SET plan = $1, is_pro = TRUE WHERE LOWER(email) = LOWER($2)', ['pro', email])

  const updated = await pool.query('SELECT id, email, plan, is_pro FROM users WHERE LOWER(email) = LOWER($1)', [email])
  return NextResponse.json({ success: true, user: updated.rows[0] })
}
