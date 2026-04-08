'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flowSlug = searchParams.get('flow')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/client-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
      } else {
        if (flowSlug) {
          router.push(`/onboard/${flowSlug}`)
        } else {
          router.push('/client/dashboard')
        }
        router.refresh()
      }
    } catch {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Welcome back</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to your client account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <Link href="/client/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          href={flowSlug ? `/client/signup?flow=${flowSlug}` : '/client/signup'}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Create account
        </Link>
      </p>
    </div>
  )
}

export default function ClientLoginPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors">
      <header className="px-6 py-4">
        <Link href="/" className="inline-flex items-center">
          <Image src="/logo-light.png" alt="Onbrd" width={120} height={60} className="h-10 w-auto dark:hidden" priority />
          <Image src="/logo-dark.png" alt="Onbrd" width={120} height={60} className="h-10 w-auto hidden dark:block" priority />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  )
}
