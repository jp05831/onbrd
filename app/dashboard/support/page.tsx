'use client'

import { useState } from 'react'
import { MessageSquare, BookOpen, Zap, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    q: 'How do I create my first onboarding flow?',
    a: "From your dashboard, click \"New Flow\". Add a name, then start adding steps — each step is a link to something your client needs to complete. Publish when you're ready and share the link.",
  },
  {
    q: 'Do my clients need to create an account?',
    a: 'No. Your clients just click the link you share with them. No sign-up, no download, no friction.',
  },
  {
    q: 'Can I use my own tools (DocuSign, Stripe, Typeform, etc.)?',
    a: 'Yes — Onbrd works with any tool that has a link. Just paste the URL into the step.',
  },
  {
    q: 'How do I get notified when a client completes a step?',
    a: "Pro plan includes email notifications whenever a client completes all steps. You'll get an email with the client details.",
  },
  {
    q: 'Can I white-label my portal?',
    a: 'Yes, on the Pro plan you can remove Onbrd branding so the portal looks fully like your own.',
  },
  {
    q: "What's your refund policy?",
    a: 'We offer a 7-day money-back guarantee on all paid plans — no questions asked. Just email us.',
  },
]

export default function DashboardSupportPage() {
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Help & Support</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">We typically reply within a few hours.</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Zap, title: 'Getting started', desc: 'New to Onbrd?', href: '/blog/how-to-create-client-onboarding-portal', external: true },
          { icon: BookOpen, title: 'Blog & guides', desc: 'Tips and best practices', href: '/blog', external: true },
          { icon: MessageSquare, title: 'Contact us', desc: 'Send a message below', href: '#contact', external: false },
        ].map((item, i) => (
          <a
            key={i}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className="flex flex-col gap-2 p-4 border border-gray-200 dark:border-neutral-800 rounded-xl hover:border-gray-300 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all group"
          >
            <item.icon className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Frequently asked questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{faq.q}</span>
                <span className={`text-gray-400 flex-shrink-0 text-lg leading-none transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 pt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div id="contact" className="border border-gray-200 dark:border-neutral-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Send us a message</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Can't find what you need? We'll get back to you within a few hours.</p>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Message sent!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">We'll get back to you within a few hours.</p>
            <button onClick={() => setStatus('idle')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Subject</label>
              <select
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your question or issue..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            {status === 'error' && (
              <p className="text-sm text-red-500">
                Something went wrong. Email us directly at{' '}
                <a href="mailto:info@onbrd.net" className="underline">info@onbrd.net</a>.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Sending...' : <><span>Send message</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
