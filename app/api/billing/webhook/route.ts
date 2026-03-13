import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import database from '../../../lib/db'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!stripeKey || !webhookSecret) {
    console.error('Stripe not configured')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })
  
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  // 1. Verify the webhook is genuinely from Stripe
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // 2. Handle the events that matter for Pro access
  switch (event.type) {
    // ✅ Link Stripe customer & grant Pro on checkout complete
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      if (session.customer_email && session.customer) {
        const user = await database.getUserByEmail(session.customer_email)
        if (user) {
          await database.updateUser(user.id, {
            stripe_customer_id: session.customer as string,
            plan: 'pro',
            is_pro: true,
          })
          console.log(`User ${user.email} upgraded to Pro`)
        }
      }
      break
    }

    // ✅ Grant Pro — subscription created or reactivated
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const isActive = sub.status === 'active' || sub.status === 'trialing'
      
      // Find user by stripe_customer_id
      const customerId = sub.customer as string
      // We need to find user by customer ID - get customer email from Stripe
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      
      if (customer.email) {
        const user = await database.getUserByEmail(customer.email)
        if (user) {
          await database.updateUser(user.id, {
            plan: isActive ? 'pro' : 'free',
            is_pro: isActive,
            stripe_subscription_id: sub.id,
          })
          console.log(`User ${user.email} subscription ${isActive ? 'activated' : 'deactivated'}`)
        }
      }
      break
    }

    // ❌ Revoke Pro — subscription cancelled or payment failed
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      
      if (customer.email) {
        const user = await database.getUserByEmail(customer.email)
        if (user) {
          await database.updateUser(user.id, {
            plan: 'free',
            is_pro: false,
            stripe_subscription_id: null,
          })
          console.log(`User ${user.email} subscription cancelled`)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
