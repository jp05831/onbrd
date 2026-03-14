import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import database from '../../../lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(stripeKey)

    // Get user's subscription ID
    const user = await database.getUserById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
    }

    // Cancel the subscription at period end (lets them keep access until billing period ends)
    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Update user plan (they keep Pro until period ends, webhook will handle final downgrade)
    // For immediate feedback, we can note the cancellation
    console.log(`User ${user.email} cancelled subscription (will end at period end)`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
