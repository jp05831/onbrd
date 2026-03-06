'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '')
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and company information.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {/* Company Name */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-gray-900">Company Name</h3>
              <p className="text-sm text-gray-500 mt-1">
                This will be displayed on your client portals.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Company Name"
                  maxLength={32}
                />
                <button
                  onClick={saveCompanyName}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50"
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
              <h3 className="font-medium text-gray-900">Email Address</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your primary email for notifications.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@company.com"
                />
                <button
                  onClick={saveEmail}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50"
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
              <h3 className="font-medium text-gray-900">Account</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your account details.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600">
                <p>Signed in as <span className="font-medium text-gray-900">{session?.user?.name}</span></p>
                <p className="text-gray-400 mt-1">{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-500 mt-1">
                Irreversible actions.
              </p>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                    // TODO: Implement account deletion
                    alert('Contact support to delete your account.')
                  }
                }}
                className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-md hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
