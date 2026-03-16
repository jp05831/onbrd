'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'pending' | 'checking' | 'success' | 'error' | 'waiting'>(
    token ? 'checking' : 'waiting'
  )

  useEffect(() => {
    if (!token) return

    setStatus('checking')

    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [token])

  // No token — show "check your inbox"
  if (status === 'waiting') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center">
            <Mail className="w-7 h-7 text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Check your inbox</h1>
        <p className="text-neutral-400 text-sm mb-2">
          We sent a verification link to your email address.
        </p>
        <p className="text-neutral-500 text-xs mb-8">
          Click the link in the email to verify your account, then sign in.
        </p>
        <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Back to sign in
        </Link>
      </div>
    )
  }

  // Token present, verifying...
  if (status === 'checking') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Verifying...</h1>
        <p className="text-neutral-400 text-sm">Just a moment.</p>
      </div>
    )
  }

  // Success
  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Email verified!</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Your account is now active. You can sign in.
        </p>
        <Link
          href="/login?verified=1"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in →
        </Link>
      </div>
    )
  }

  // Error
  return (
    <div className="text-center">
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 bg-red-950/50 border border-red-900/50 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Link invalid</h1>
      <p className="text-neutral-400 text-sm mb-6">
        This verification link has expired or already been used.
      </p>
      <Link href="/signup" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
        Sign up again →
      </Link>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="px-6 py-4">
        <Link href="/">
          <Image src="/logo-dark.png" alt="Onbrd" width={100} height={40} className="h-8 w-auto" priority />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Suspense>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
