'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '')
      if ((session.user as any)?.plan) {
        setCurrentPlan((session.user as any).plan)
      }
      fetchSettings()
    }
  }, [session])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/user/settings')
      if (res.ok) {
        const data = await res.json()
        setCompanyName(data.company_name || '')
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const saveCompanyName = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveEmail = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    setCancelLoading(true)
    try {
      const res = await fetch('/api/billing/cancel', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setCurrentPlan('free')
        setShowCancelModal(false)
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

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This will permanently delete all your flows, steps, and data. This cannot be undone.')) return
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' })
      if (res.ok) {
        await signOut({ callbackUrl: '/' })
      } else {
        alert('Failed to delete account. Please try again.')
      }
    } catch (error) {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and company information.</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        {/* Company Name */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Company Name</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This will be displayed on your client portals.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Company Name"
                  maxLength={32}
                />
                <button
                  onClick={saveCompanyName}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Max 32 characters</p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Email Address</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your primary email for notifications.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@company.com"
                />
                <button
                  onClick={saveEmail}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your account details.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Signed in as <span className="font-medium text-gray-900 dark:text-white">{session?.user?.name}</span></p>
                <p className="text-gray-400 mt-1">{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Plan</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your current subscription.
              </p>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                currentPlan === 'pro'
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400'
              }`}>
                {currentPlan === 'pro' ? 'Pro' : 'Free'}
              </span>
              {currentPlan === 'pro' ? (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  Cancel subscription
                </button>
              ) : (
                <a
                  href="/dashboard/billing"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Upgrade to Pro →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-gray-50 dark:bg-neutral-900/50 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Irreversible actions.
              </p>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={deleteAccount}
                className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
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
              Are you sure? You&apos;ll immediately lose access to:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'All flows beyond your first 2',
                'Steps beyond 2 per flow',
                'Email notifications',
                'White-label branding',
                'Priority support',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800"
              >
                Keep My Plan
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
    </div>
  )
}
