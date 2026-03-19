import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import Stripe from 'stripe'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const pool = new Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL })

// ONE-TIME USE — delete after use
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== 'onbrd-fix-sub-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  // Known values from Stripe
  const customerId = 'cus_UAq6hZu1OkXJTw'
  const subscriptionId = 'sub_1TCUQL2LWdEL3A7uQodvWSJW'
  const email = 'ChrisLeo665@gmail.com'

  await pool.query(
    'UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2, plan = $3, is_pro = TRUE WHERE LOWER(email) = LOWER($4)',
    [customerId, subscriptionId, 'pro', email]
  )

  const updated = await pool.query(
    'SELECT id, email, plan, is_pro, stripe_customer_id, stripe_subscription_id FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  )

  return NextResponse.json({ success: true, user: updated.rows[0] })
}
