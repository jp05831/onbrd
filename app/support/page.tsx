'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageSquare, BookOpen, Zap, CheckCircle2 } from 'lucide-react'

const faqs = [
  {
    q: 'How do I create my first onboarding flow?',
    a: 'After signing up, click "New Flow" from your dashboard. Add a name, then start adding steps — each step is a link to something your client needs to complete (a contract, form, payment, etc.). Share the link when you\'re ready.',
  },
  {
    q: 'Do my clients need to create an account?',
    a: 'No. Your clients just click the link you share with them. No sign-up, no download, no friction.',
  },
  {
    q: 'Can I use my own tools (DocuSign, Stripe, Typeform, etc.)?',
    a: 'Yes — Onbrd works with any tool that has a link. Just paste the URL for your contract, payment page, or form into the step.',
  },
  {
    q: 'How do I get notified when a client completes a step?',
    a: 'Pro plan includes email notifications whenever a client marks a step as complete. You\'ll get an email with the client and step details.',
  },
  {
    q: 'Can I white-label my portal?',
    a: 'Yes, on the Pro plan you can remove Onbrd branding so the portal looks fully like your own.',
  },
  {
    q: 'What\'s your refund policy?',
    a: 'We offer a 7-day money-back guarantee on all paid plans — no questions asked. Just email us.',
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo-dark.png" alt="Onbrd" width={120} height={60} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-14 px-6 border-b border-neutral-800">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-semibold mb-4">How can we help?</h1>
          <p className="text-gray-400 text-lg">
            We typically reply within a few hours. Check the FAQs below first — most answers are there.
          </p>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-12 px-6 border-b border-neutral-800">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              title: 'Getting started',
              desc: 'New to Onbrd? Start here.',
              href: '/blog/how-to-create-client-onboarding-portal',
            },
            {
              icon: BookOpen,
              title: 'Blog & guides',
              desc: 'Tips and best practices.',
              href: '/blog',
            },
            {
              icon: MessageSquare,
              title: 'Contact us',
              desc: 'Send us a message below.',
              href: '#contact',
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-start gap-4 p-5 border border-neutral-800 rounded-xl hover:border-neutral-600 hover:bg-neutral-900 transition-all group"
            >
              <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-neutral-700">
                <item.icon className="w-4.5 h-4.5 text-blue-400 w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-white text-sm mb-0.5">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Video Tutorial */}
      <section className="py-16 px-6 border-b border-neutral-800">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Video walkthrough</h2>
            <p className="text-gray-400 text-sm">Watch how to create your first flow in under 5 minutes.</p>
          </div>
          <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/6umy1NqU7TM?start=18"
              title="How to create your first Onbrd flow"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-b border-neutral-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-10">Frequently asked questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-neutral-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-900 transition-colors"
                >
                  <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                  <span className={`text-gray-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">Send us a message</h2>
            <p className="text-gray-400">
              Can't find what you need? We'll get back to you within a few hours.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-5">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Message sent!</h3>
              <p className="text-gray-400 mb-8">We'll get back to you within a few hours.</p>
              <button
                onClick={() => setStatus('idle')}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="General question">General question</option>
                  <option value="Billing & plans">Billing &amp; plans</option>
                  <option value="Bug report">Bug report</option>
                  <option value="Feature request">Feature request</option>
                  <option value="Account issue">Account issue</option>
                  <option value="Refund request">Refund request</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your question or issue..."
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
              {status === 'error' && (
                <p className="text-sm text-red-400">
                  Something went wrong. Try again or email us directly at{' '}
                  <a href="mailto:info@onbrd.net" className="underline">info@onbrd.net</a>.
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : (
                  <>Send message <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo-dark.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto opacity-60" />
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Blog</Link>
            <Link href="/support" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Support</Link>
            <a href="mailto:info@onbrd.net" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">info@onbrd.net</a>
            <a href="https://www.facebook.com/Onbrding" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/onbrding/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Onbrd</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
