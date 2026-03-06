'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Check } from 'lucide-react'

export default function BillingPage() {
  const { data: session } = useSession()
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user && (session.user as any)?.plan) {
      setCurrentPlan((session.user as any).plan)
    }
  }, [session])

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and billing details.</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Current Plan</h3>
            <p className="text-sm text-gray-500 mt-1">
              You are currently on the <span className="font-medium text-gray-900 capitalize">{currentPlan}</span> plan.
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            currentPlan === 'pro' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {currentPlan === 'pro' ? 'Pro' : 'Free'}
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Free Plan */}
        <div className={`bg-white border-2 rounded-lg p-6 ${
          currentPlan === 'free' ? 'border-blue-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Free</h3>
            {currentPlan === 'free' && (
              <span className="text-xs font-medium text-blue-600">Current</span>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-semibold text-gray-900">$0</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {['Up to 3 active flows', 'Unlimited steps per flow', 'Progress tracking', 'Shareable links'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          {currentPlan === 'free' ? (
            <button
              disabled
              className="w-full py-2 border border-gray-200 text-gray-400 text-sm font-medium rounded-md cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              className="w-full py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
            >
              Downgrade
            </button>
          )}
        </div>

        {/* Pro Plan */}
        <div className={`bg-white border-2 rounded-lg p-6 ${
          currentPlan === 'pro' ? 'border-blue-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Pro</h3>
            {currentPlan === 'pro' ? (
              <span className="text-xs font-medium text-blue-600">Current</span>
            ) : (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Recommended</span>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-semibold text-gray-900">$10</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {['Unlimited active flows', 'Email notifications', 'Remove branding', 'Priority support', 'Custom branding'].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          {currentPlan === 'pro' ? (
            <button
              disabled
              className="w-full py-2 border border-gray-200 text-gray-400 text-sm font-medium rounded-md cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8">
        <h3 className="font-medium text-gray-900 mb-4">Billing History</h3>
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-8 text-center text-gray-500 text-sm">
            No billing history yet.
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h3 className="font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 text-sm">Can I cancel anytime?</h4>
            <p className="text-sm text-gray-500 mt-1">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-900 text-sm">What happens to my flows if I downgrade?</h4>
            <p className="text-sm text-gray-500 mt-1">Your existing flows will remain, but you won't be able to create new ones beyond the free plan limit.</p>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-900 text-sm">Do you offer refunds?</h4>
            <p className="text-sm text-gray-500 mt-1">We offer a 7-day money-back guarantee if you're not satisfied with Pro.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
