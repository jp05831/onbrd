'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { Mail, AlertCircle } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (error) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-red-950/50 border border-red-900/50 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Invalid link</h1>
        <p className="text-neutral-400 text-sm mb-6">
          This verification link is invalid or has already been used.
        </p>
        <Link href="/signup" className="text-sm text-blue-400 hover:text-blue-300">
          Sign up again →
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="flex justify-center mb-5">
        <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-xl flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Check your inbox</h1>
      <p className="text-neutral-400 text-sm mb-2">
        We sent a verification link to your email address.
      </p>
      <p className="text-neutral-500 text-xs mb-8">
        Click the link in the email to verify your account, then sign in.
      </p>
      <Link
        href="/login"
        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        Back to sign in
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
