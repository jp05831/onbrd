'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    token ? 'idle' : 'error'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Password reset!</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm mb-8">
          Your password has been updated.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in →
        </Link>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-red-950/50 border border-red-900/50 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Link expired</h1>
        <p className="text-gray-500 dark:text-neutral-400 text-sm mb-6">
          This link has expired or already been used.
        </p>
        <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Request a new link →
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Set a new password</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors">
      <header className="px-6 py-4">
        <Link href="/" className="inline-flex items-center">
          <Image src="/logo-light.png" alt="Onbrd" width={120} height={60} className="h-10 w-auto dark:hidden" priority />
          <Image src="/logo-dark.png" alt="Onbrd" width={120} height={60} className="h-10 w-auto hidden dark:block" priority />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Suspense>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
