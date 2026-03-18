import { NextResponse } from 'next/server'

// Disabled: use /api/billing/checkout for Stripe-based upgrades
export async function POST() {
  return NextResponse.json({ error: 'Not available' }, { status: 410 })
}
