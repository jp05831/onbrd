'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { AlertTriangle, Clock, Upload, X } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '')
      const plan = (session.user as any)?.plan || 'free'
      setCurrentPlan(plan)
      fetchSettings(plan)
    }
  }, [session])

  const fetchSettings = async (plan?: string) => {
    try {
      const res = await fetch('/api/user/settings')
      if (res.ok) {
        const data = await res.json()
        setCompanyName(data.company_name || '')
        setLogoUrl(data.logo_url || null)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }

    // Always fetch billing status for pro users
    const effectivePlan = plan ?? currentPlan
    if (effectivePlan === 'pro') {
      try {
        const res = await fetch('/api/billing/status')
        const d = await res.json()
        setCancelAtPeriodEnd(d.cancelAtPeriodEnd || false)
        setCurrentPeriodEnd(d.currentPeriodEnd || null)
      } catch {}
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

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Please upload an image file')
    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/files/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        const url = data.url || `/api/files/${data.id}`
        setLogoUrl(url)
        await fetch('/api/user/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logo_url: url }),
        })
      } else {
        alert('Upload failed')
      }
    } catch { alert('Upload failed') } finally {
      setUploadingLogo(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }

  const removeLogo = async () => {
    setLogoUrl(null)
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logo_url: null }),
    })
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
        setShowCancelModal(false)
        setCancelAtPeriodEnd(true)
        // Fetch the period end date
        fetch('/api/billing/status').then(r => r.json()).then(d => {
          setCurrentPeriodEnd(d.currentPeriodEnd || null)
        }).catch(() => {})
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

        {/* Company Logo */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Company Logo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Shown on all your client portals by default. You can override per-flow in the flow editor.
              </p>
            </div>
            <div className="md:col-span-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}
                className="hidden"
              />
              {logoUrl ? (
                <div className="flex items-center gap-4">
                  <img
                    src={logoUrl}
                    alt="Company logo"
                    className="h-14 max-w-[200px] object-contain rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingLogo ? 'Uploading...' : 'Change'}
                    </button>
                    <button
                      onClick={removeLogo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 dark:border-neutral-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-neutral-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingLogo ? 'Uploading...' : 'Upload logo'}
                </button>
              )}
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, SVG — recommended height 40–80px</p>
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
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  currentPlan === 'pro'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {currentPlan === 'pro' ? 'Pro' : 'Free'}
                </span>
                {currentPlan === 'pro' && !cancelAtPeriodEnd && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                  >
                    Cancel subscription
                  </button>
                )}
                {currentPlan === 'free' && (
                  <a
                    href="/dashboard/billing"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Upgrade to Pro →
                  </a>
                )}
              </div>
              {cancelAtPeriodEnd && currentPeriodEnd && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  Cancellation scheduled — Pro access until {new Date(currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
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
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              You&apos;ll keep Pro access until the end of your current billing period. After that you&apos;ll lose access to:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Unlimited flows & steps',
                'Unlimited clients',
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
