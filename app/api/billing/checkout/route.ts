import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const interval = body.interval === 'year' ? 'year' : 'month'

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      // If no Stripe key, return null URL (will trigger demo upgrade)
      return NextResponse.json({ url: null })
    }

    const stripe = new Stripe(stripeKey)

    // Pricing: $15/month or $150/year (2 months free)
    const pricing = {
      month: {
        amount: 1500, // $15.00
        interval: 'month' as const,
        description: 'Billed monthly',
      },
      year: {
        amount: 15000, // $150.00 (save $30)
        interval: 'year' as const,
        description: 'Billed annually (save $30)',
      },
    }

    const selectedPricing = pricing[interval]

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Onbrd Pro',
              description: `Unlimited flows, unlimited steps, unlimited users. ${selectedPricing.description}`,
            },
            unit_amount: selectedPricing.amount,
            recurring: {
              interval: selectedPricing.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard/billing`,
      client_reference_id: session.user.id,
      customer_email: session.user.email,
      metadata: {
        billing_interval: interval,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
