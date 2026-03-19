import { NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import database from '../../../lib/db'
import Stripe from 'stripe'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await database.getUserById(session.user.id)
    if (!user || user.plan !== 'pro' || !user.stripe_subscription_id) {
      return NextResponse.json({ cancelAtPeriodEnd: false, currentPeriodEnd: null })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ cancelAtPeriodEnd: false, currentPeriodEnd: null })
    }

    const stripe = new Stripe(stripeKey)
    const sub = await stripe.subscriptions.retrieve(user.stripe_subscription_id) as any

    return NextResponse.json({
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
      status: sub.status,
    })
  } catch (error) {
    console.error('Billing status error:', error)
    return NextResponse.json({ cancelAtPeriodEnd: false, currentPeriodEnd: null })
  }
}
