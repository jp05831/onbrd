'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Check, Sparkles, ShieldCheck, Clock, PartyPopper, Mail } from 'lucide-react'

export default function BillingPage() {
  const { data: session, update } = useSession()
  const searchParams = useSearchParams()
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free')
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year')
  const [loading, setLoading] = useState(false)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null)
  const [countdown, setCountdown] = useState('')
  const [justUpgraded, setJustUpgraded] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (!cancelAtPeriodEnd || !currentPeriodEnd) return
    const tick = () => {
      const diff = new Date(currentPeriodEnd).getTime() - Date.now()
      if (diff <= 0) { setCountdown('Expired'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [cancelAtPeriodEnd, currentPeriodEnd])

  // Handle successful Stripe checkout redirect
  useEffect(() => {
    if (searchParams.get('success') !== 'true') return

    // Fire Meta Pixel
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Purchase', { currency: 'USD', value: 15.00 })
    }

    setJustUpgraded(true)
    window.history.replaceState({}, '', '/dashboard/billing')

    // Poll until the session reflects Pro (webhook may take a few seconds)
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      await update() // force NextAuth to re-fetch from DB
      if (attempts >= 10) clearInterval(poll) // give up after ~10s
    }, 1000)

    return () => clearInterval(poll)
  }, [searchParams])

  // Sync plan from session
  useEffect(() => {
    if (session?.user && (session.user as any)?.plan) {
      const plan = (session.user as any).plan as 'free' | 'pro'
      setCurrentPlan(plan)
      if (plan === 'pro' && justUpgraded) {
        setJustUpgraded(false) // webhook confirmed, dismiss success screen
      }
    }
  }, [session])

  // Fetch billing status for Pro users
  useEffect(() => {
    if (currentPlan === 'pro' && session) {
      fetch('/api/billing/status')
        .then(r => r.json())
        .then(d => {
          setCancelAtPeriodEnd(d.cancelAtPeriodEnd || false)
          setCurrentPeriodEnd(d.currentPeriodEnd || null)
        })
        .catch(() => {})
    }
  }, [currentPlan, session])

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: billingInterval }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const pricing = {
    month: { displayPrice: '$15', period: '/mo', subtext: 'billed monthly', savings: null },
    year: { displayPrice: '$12.50', period: '/mo', subtext: 'billed $150/yr', savings: 'Save $30' },
  }

  const selectedPrice = pricing[billingInterval]

  // Success screen shown right after Stripe checkout while we wait for webhook
  if (justUpgraded) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to Pro! 🎉</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your payment was successful. We&apos;re activating your account now — this usually takes just a few seconds.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Activating your Pro account...
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Taking longer than expected? Try refreshing the page or signing out and back in.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your subscription and billing details.</p>
      </div>

      {/* Cancellation notice */}
      {cancelAtPeriodEnd && currentPeriodEnd && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Cancellation scheduled</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                Your Pro access continues until <strong>{new Date(currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>. After that your account will revert to Free.
              </p>
            </div>
          </div>
          {countdown && (
            <div className="mt-3 flex items-center justify-center gap-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg py-2.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-mono font-semibold text-amber-800 dark:text-amber-300">{countdown}</span>
              <span className="text-xs text-amber-600 dark:text-amber-500">remaining</span>
            </div>
          )}
        </div>
      )}

      {/* Value nudge for free users */}
      {currentPlan === 'free' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">You&apos;re on the free plan</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">
              Limited to 2 flows and 2 steps each. Upgrade to Pro for unlimited flows, unlimited clients, and white-label branding.
            </p>
          </div>
        </div>
      )}

      {/* Billing Toggle */}
      {currentPlan !== 'pro' && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-gray-100 dark:bg-neutral-900 rounded-lg p-1">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingInterval === 'month'
                  ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                billingInterval === 'year'
                  ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Annual
              <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">Save $30</span>
            </button>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Free Plan */}
        <div className={`bg-white dark:bg-neutral-900 border-2 rounded-lg p-6 ${
          currentPlan === 'free' ? 'border-gray-300 dark:border-neutral-700' : 'border-gray-200 dark:border-neutral-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Free</h3>
            {currentPlan === 'free' && (
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Current</span>
            )}
          </div>
          <div className="mb-1">
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">$0</span>
            <span className="text-gray-500 dark:text-gray-400">/forever</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Try it out, no card needed</p>
          <ul className="space-y-3 mb-6">
            {['2 flows', '2 steps per flow', 'Progress tracking', 'Shareable client links'].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <button disabled className="w-full py-2 border border-gray-200 dark:border-neutral-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-md cursor-not-allowed">
            {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white dark:bg-neutral-900 border-2 border-blue-600 rounded-lg p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-blue-600 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              Recommended
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pro</h3>
            {currentPlan === 'pro' && (
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Current</span>
            )}
          </div>
          <div className="mb-1">
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">{selectedPrice.displayPrice}</span>
            <span className="text-gray-500 dark:text-gray-400">{selectedPrice.period}</span>
            {selectedPrice.savings && (
              <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-medium">{selectedPrice.savings}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{selectedPrice.subtext}</p>
          <ul className="space-y-3 mb-6">
            {[
              'Unlimited flows & steps',
              'Unlimited clients — no per-seat fees',
              'Email notifications on completion',
              'White-label — remove Onbrd branding',
              'Priority support',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {currentPlan === 'pro' ? (
            <button disabled className="w-full py-2 border border-gray-200 dark:border-neutral-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-md cursor-not-allowed">
              {cancelAtPeriodEnd ? 'Cancellation Scheduled' : 'Current Plan'}
            </button>
          ) : (
            <>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Loading...' : 'Upgrade to Pro'}
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                  7-day money-back guarantee · Cancel anytime
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Billing History</h3>
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg">
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No billing history yet.
          </div>
        </div>
      </div>

      {/* Refund & Support */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg flex items-start gap-3">
        <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            7-day money-back guarantee
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Not happy? Email us within 7 days of your purchase and we'll refund you — no questions asked.{' '}
            <a
              href="mailto:Onbrd1@gmail.com?subject=Refund Request"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Contact support →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
