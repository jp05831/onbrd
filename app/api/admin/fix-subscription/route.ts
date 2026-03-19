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

  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  // Find customer in Stripe by email
  const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 5 })
  if (!customers.data.length) {
    return NextResponse.json({ error: 'No Stripe customer found for this email', customers: [] })
  }

  const customer = customers.data[0]

  // Get their subscriptions
  const subs = await stripe.subscriptions.list({ customer: customer.id, limit: 5 })

  if (!subs.data.length) {
    return NextResponse.json({ 
      error: 'No subscriptions found', 
      customer_id: customer.id,
      customer_email: customer.email 
    })
  }

  const sub = subs.data[0]
  const isActive = sub.status === 'active' || sub.status === 'trialing'

  // Update DB with stripe IDs
  await pool.query(
    'UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2, plan = $3, is_pro = $4 WHERE LOWER(email) = LOWER($5)',
    [customer.id, sub.id, isActive ? 'pro' : 'free', isActive, email]
  )

  const updated = await pool.query('SELECT id, email, plan, is_pro, stripe_customer_id, stripe_subscription_id FROM users WHERE LOWER(email) = LOWER($1)', [email])

  return NextResponse.json({ 
    success: true, 
    subscription: { id: sub.id, status: sub.status },
    customer: { id: customer.id, email: customer.email },
    user: updated.rows[0]
  })
}
