'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Crown, Zap } from 'lucide-react'

interface User {
  plan: 'free' | 'pro'
}

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setUpgrading(true)
    
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        // For demo: just upgrade immediately
        await fetch('/api/billing/upgrade', { method: 'POST' })
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to upgrade:', error)
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  const isPro = user?.plan === 'pro'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">Manage your subscription</p>
      </div>

      <div className="max-w-3xl">
        {/* Current Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Plan</p>
              <div className="flex items-center gap-2 mt-1">
                {isPro ? (
                  <>
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="text-xl font-bold text-gray-900">Pro</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900">Free</span>
                )}
              </div>
            </div>
            {isPro && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Monthly</p>
                <p className="text-2xl font-bold text-gray-900">$10</p>
              </div>
            )}
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className={`bg-white rounded-xl border-2 p-6 ${!isPro ? 'border-primary-300' : 'border-gray-200'}`}>
            {!isPro && (
              <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-4">
                Current Plan
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
            <p className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-lg font-normal text-gray-500">/mo</span></p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                Up to 3 active flows
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                Unlimited steps per flow
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                Progress tracking
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span className="w-5 h-5 flex-shrink-0">—</span>
                "Powered by" branding
              </li>
            </ul>
            {!isPro && (
              <div className="text-center text-sm text-gray-500">Your current plan</div>
            )}
          </div>

          {/* Pro Plan */}
          <div className={`bg-white rounded-xl border-2 p-6 ${isPro ? 'border-primary-300' : 'border-gray-200'}`}>
            {isPro && (
              <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-4">
                Current Plan
              </span>
            )}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-4">$10<span className="text-lg font-normal text-gray-500">/mo</span></p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <strong>Unlimited</strong> active flows
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                Unlimited steps per flow
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                Email notifications
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                Remove "Powered by" branding
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                Priority support
              </li>
            </ul>
            {!isPro ? (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                {upgrading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            ) : (
              <div className="text-center text-sm text-gray-500">Your current plan</div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Can I cancel anytime?</h3>
              <p className="text-sm text-gray-600 mt-1">Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">What happens to my flows if I downgrade?</h3>
              <p className="text-sm text-gray-600 mt-1">Your existing flows will remain, but you won't be able to create new ones until you're within the free plan limit of 3 active flows.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
