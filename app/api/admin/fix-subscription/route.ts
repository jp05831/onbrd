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

  // List all recent customers and subscriptions
  const customers = await stripe.customers.list({ limit: 20 })
  const subs = await stripe.subscriptions.list({ limit: 20, status: 'all' })

  return NextResponse.json({
    customers: customers.data.map(c => ({ id: c.id, email: c.email, created: new Date(c.created * 1000).toISOString() })),
    subscriptions: subs.data.map(s => ({ id: s.id, status: s.status, customer: s.customer, created: new Date(s.created * 1000).toISOString() }))
  })
}
