'use client'

/**
 * Onbrd Marketing Funnel Landing Page
 * Route: /lp  (link-only, not linked from nav)
 * Funnel: Ad → /lp → /demo → /signup
 *
 * 🎬 TO ADD YOUR VIDEO: replace YOUTUBE_VIDEO_ID below with your YouTube video ID
 */
const YOUTUBE_VIDEO_ID = '' // ← paste your YouTube video ID here

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Sparkles, ShieldCheck, Star, Play } from 'lucide-react'

function trackFbq(event: string, params?: object) {
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', event, params)
  }
}

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Brand Designer',
    body: "I used to send 6 different emails just to onboard one client. Now I send one link and they work through everything themselves. It's genuinely changed how I run my business.",
    stars: 5,
  },
  {
    name: 'Marcus T.',
    role: 'Marketing Agency Owner',
    body: "My clients actually complete onboarding now. Before Onbrd, half of them would ghost the process. The step-by-step format makes it impossible to miss what's next.",
    stars: 5,
  },
  {
    name: 'Priya N.',
    role: 'Freelance Web Developer',
    body: "Setup took 10 minutes. I built a flow, published it, sent the link to my client — they finished everything in an hour. That's never happened before.",
    stars: 5,
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year')

  useEffect(() => {
    trackFbq('ViewContent', { content_name: 'Landing Page' })
  }, [])

  const handleDemoCTA = () => {
    trackFbq('InitiateCheckout')
  }

  const pricing = {
    month: { price: '$15', sub: '/mo', note: 'billed monthly', savings: null },
    year: { price: '$12.50', sub: '/mo', note: 'billed $150/yr', savings: 'Save $30' },
  }
  const p = pricing[billingInterval]

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Nav */}
      <header className="border-b border-neutral-800 sticky top-0 z-40 bg-black/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-dark.png" alt="Onbrd" width={120} height={60} className="h-9 w-auto" priority />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              onClick={handleDemoCTA}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Create your first flow
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Stop sending clients<br className="hidden sm:block" /> a pile of links.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Onbrd gives every client one clean portal to complete their onboarding —
            step by step, no confusion, no back-and-forth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/demo"
              onClick={handleDemoCTA}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Create your first flow
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600">No credit card required · 2 min setup</p>
        </div>
      </section>

      {/* Video */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {YOUTUBE_VIDEO_ID ? (
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl shadow-blue-500/5"
              style={{ paddingBottom: '56.25%' }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
                title="Onbrd walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl shadow-blue-500/5"
              style={{ paddingBottom: '56.25%' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center">
                  <Play className="w-7 h-7 text-blue-400 ml-1" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">See Onbrd in action</p>
                  <p className="text-sm text-gray-500 mt-1">Video coming soon</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/demo"
              onClick={handleDemoCTA}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Create your first flow — it's free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-500">No account needed to try</p>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 px-6 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">The old way</p>
              <h2 className="text-2xl font-semibold text-white mb-6 leading-snug">
                Onboarding a client used to mean 10 emails and 6 different links.
              </h2>
              <ul className="space-y-3">
                {[
                  'Email 1: "Here\'s the contract link"',
                  'Email 2: "Did you see the payment link?"',
                  'Email 3: "Can you fill out this form?"',
                  'Email 4: "Just following up..."',
                  'Email 5: "Sorry to bug you again..."',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-4">The Onbrd way</p>
              <h2 className="text-2xl font-semibold text-white mb-6 leading-snug">
                One link. Everything in order. Done.
              </h2>
              <ul className="space-y-3">
                {[
                  'Client gets one link — their personal portal',
                  'Steps unlock in order — no confusion about what\'s next',
                  'Works with any tool they already use',
                  'You see progress in real-time',
                  'Email when it\'s all complete',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="mt-0.5 w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/demo"
                onClick={handleDemoCTA}
                className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create your first flow
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Up and running in minutes</h2>
          <p className="text-gray-400 mb-16 max-w-md mx-auto">No setup calls, no tech knowledge required. Build your first flow faster than you can write an email.</p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                title: 'Build your flow',
                desc: 'Add steps with links to your contracts, forms, and payments. Name your client, add a welcome message, publish.',
              },
              {
                step: '02',
                title: 'Send one link',
                desc: "Your client gets a unique URL. No account needed on their end. They open it, see exactly what to do, and work through it.",
              },
              {
                step: '03',
                title: 'Track progress',
                desc: "Watch steps complete in real-time from your dashboard. Get notified the moment everything's done.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-neutral-800 mb-4">{item.step}</div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-gray-400 max-w-md mx-auto">Built for freelancers, agencies, and service businesses that onboard clients regularly.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Works with any tool',
                desc: 'DocuSign, Stripe, Typeform, Calendly — if it has a URL, it works as a step.',
                pro: false,
              },
              {
                title: 'Collect documents',
                desc: 'Request PDFs and photos directly in the portal. Files land in your dashboard.',
                pro: true,
              },
              {
                title: 'Request photos',
                desc: 'Need a headshot, ID, or proof photo? Clients upload directly from their phone.',
                pro: true,
              },
              {
                title: 'Email notifications',
                desc: 'Get notified when steps are completed. No more manually chasing clients.',
                pro: true,
              },
              {
                title: 'White-label branding',
                desc: 'Add your logo and remove Onbrd branding. Your client sees only your brand.',
                pro: true,
              },
              {
                title: 'Unlimited clients',
                desc: 'No per-seat fees. Onboard as many clients as you want on one flat Pro plan.',
                pro: true,
              },
            ].map((f, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-white text-sm">{f.title}</h3>
                  {f.pro && (
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-900/40 border border-purple-800 px-1.5 py-0.5 rounded flex-shrink-0 ml-2">PRO</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-white">Clients actually complete onboarding now.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col gap-4">
                <StarRow count={t.stars} />
                <p className="text-sm text-gray-300 leading-relaxed flex-1">"{t.body}"</p>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-neutral-800" id="pricing">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-3">Simple, transparent pricing.</h2>
            <p className="text-gray-400">No contracts, no per-client fees, no surprises.</p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
              <button
                onClick={() => setBillingInterval('month')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  billingInterval === 'month' ? 'bg-neutral-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('year')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  billingInterval === 'year' ? 'bg-neutral-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Annual
                <span className="text-xs bg-green-900/50 text-green-400 border border-green-800 px-1.5 py-0.5 rounded-full">Save $30</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Free */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 flex flex-col">
              <h3 className="font-semibold text-white text-lg mb-1">Free</h3>
              <p className="text-sm text-gray-500 mb-5">Try it out — no card needed</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-500 ml-1">/forever</span>
              </div>
              <p className="text-xs text-gray-600 mb-6">Keep using it for free, forever</p>
              <ul className="space-y-3 mb-8 flex-1">
                {['2 flows', '2 steps per flow', 'Progress tracking', 'Shareable client links'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/demo"
                className="block text-center py-3 border border-neutral-700 text-gray-300 text-sm font-medium rounded-xl hover:bg-neutral-800 hover:border-neutral-600 transition-colors mt-auto"
              >
                Create your first flow
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-neutral-900 border-2 border-blue-600 rounded-2xl p-7 relative shadow-xl shadow-blue-600/10 flex flex-col">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Most popular
                </span>
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Pro</h3>
              <p className="text-sm text-gray-500 mb-5">For growing businesses</p>
              <div className="mb-1 flex items-end gap-2">
                <span className="text-4xl font-bold text-white">{p.price}</span>
                <span className="text-gray-500 mb-1">{p.sub}</span>
                {p.savings && <span className="text-sm text-green-400 font-semibold mb-1">{p.savings}</span>}
              </div>
              <p className="text-xs text-gray-600 mb-6">{p.note}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Unlimited flows & steps',
                  'Unlimited clients — no per-seat fees',
                  'Collect PDFs and photos from clients',
                  'Email notifications on completion',
                  'White-label — remove Onbrd branding',
                  'Priority support',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href="/signup"
                  onClick={() => trackFbq('InitiateCheckout')}
                  className="block text-center py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Get Onbrd Pro
                </Link>
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
                  <p className="text-xs text-gray-600">7-day money-back guarantee · Cancel anytime</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-3">No account needed to try.</p>
            <Link
              href="/demo"
              onClick={handleDemoCTA}
              className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Create your first flow →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5 leading-tight">
            Your next client deserves<br className="hidden sm:block" /> a better onboarding experience.
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
            Build your first flow, send one link, and watch clients actually complete the process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/demo"
              onClick={handleDemoCTA}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20"
            >
              Create your first flow — free
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <ShieldCheck className="w-4 h-4 text-gray-600" />
            <p className="text-sm text-gray-600">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <Image src="/logo-dark.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto opacity-70" />
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Home</Link>
              <Link href="/demo" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Create a flow</Link>

              <Link href="/support" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Support</Link>
              <a href="mailto:info@onbrd.net" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">info@onbrd.net</a>
            </div>
          </div>
          <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-700">© {new Date().getFullYear()} Onbrd. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="https://www.facebook.com/Onbrding" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-400 transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/onbrding/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-400 transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
