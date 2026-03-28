'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {})

    setStatus('sent')
  }

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
          {status === 'sent' ? (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-blue-400" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Check your inbox</h1>
              <p className="text-gray-500 dark:text-neutral-400 text-sm mb-8">
                We sent a password reset link to your email.
              </p>
              <Link href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Forgot your password?</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {status === 'loading' ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
