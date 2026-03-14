'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Sparkles, AlertTriangle } from 'lucide-react'

export default function BillingPage() {
  const { data: session, update } = useSession()
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free')
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [loading, setLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    if (session?.user && (session.user as any)?.plan) {
      setCurrentPlan((session.user as any).plan)
    }
  }, [session])

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: billingInterval }),
      })
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

  const handleCancel = async () => {
    setCancelLoading(true)
    try {
      const res = await fetch('/api/billing/cancel', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.success) {
        setCurrentPlan('free')
        setShowCancelModal(false)
        // Refresh session to update plan
        await update()
        alert('Your subscription has been cancelled.')
      } else {
        alert(data.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Cancel error:', error)
      alert('Failed to cancel subscription')
    } finally {
      setCancelLoading(false)
    }
  }

  const pricing = {
    month: { price: 15, period: '/month', savings: null },
    year: { price: 150, period: '/year', savings: 'Save $30' },
  }

  const selectedPrice = pricing[billingInterval]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your subscription and billing details.</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Current Plan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You are currently on the <span className="font-medium text-gray-900 dark:text-white capitalize">{currentPlan}</span> plan.
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            currentPlan === 'pro' 
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
              : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300'
          }`}>
            {currentPlan === 'pro' ? 'Pro' : 'Free Trial'}
          </span>
        </div>

        {/* Cancel Button for Pro users */}
        {currentPlan === 'pro' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Cancel subscription
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancel Subscription</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to cancel your Pro subscription? You'll lose access to:
            </p>
            <ul className="space-y-2 mb-6">
              {['Unlimited flows', 'Unlimited steps', 'Email notifications', 'Priority support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Free Trial</h3>
            {currentPlan === 'free' && (
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Current</span>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">$0</span>
            <span className="text-gray-500 dark:text-gray-400">/forever</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              'Up to 2 flows',
              'Up to 2 steps per flow',
              'Progress tracking',
              'Shareable links',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          {currentPlan === 'free' ? (
            <button
              disabled
              className="w-full py-2 border border-gray-200 dark:border-neutral-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              className="w-full py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              Downgrade
            </button>
          )}
        </div>

        {/* Pro Plan */}
        <div className={`bg-white dark:bg-neutral-900 border-2 rounded-lg p-6 relative ${
          currentPlan === 'pro' ? 'border-blue-600' : 'border-blue-600'
        }`}>
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
          <div className="mb-4">
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">${selectedPrice.price}</span>
            <span className="text-gray-500 dark:text-gray-400">{selectedPrice.period}</span>
            {selectedPrice.savings && (
              <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-medium">{selectedPrice.savings}</span>
            )}
          </div>
          <ul className="space-y-3 mb-6">
            {[
              'Unlimited flows',
              'Unlimited steps per flow',
              'Unlimited users',
              'Email notifications',
              'Remove branding',
              'Priority support',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          {currentPlan === 'pro' ? (
            <button
              disabled
              className="w-full py-2 border border-gray-200 dark:border-neutral-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : `Upgrade to Pro — $${selectedPrice.price}${selectedPrice.period}`}
            </button>
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

      {/* FAQ */}
      <div className="mt-8">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">Can I cancel anytime?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">What happens to my flows if I downgrade?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your existing flows will remain, but you won't be able to create new ones beyond the free plan limit (2 flows, 2 steps each).</p>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">Do you offer refunds?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We offer a 7-day money-back guarantee if you're not satisfied with Pro.</p>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">What's included in unlimited users?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pro plan allows unlimited clients to access and complete your onboarding flows — no per-user charges.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
