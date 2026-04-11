import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'What\'s new in Onbrd — latest updates, improvements, and fixes.',
  alternates: { canonical: '/changelog' },
}

const releases = [
  {
    version: '1.3',
    date: 'March 2025',
    tag: 'New',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    items: [
      { type: 'new', text: 'File upload steps — clients can now upload files directly in their onboarding portal' },
      { type: 'new', text: 'Auto-expiry for uploaded files — set files to delete automatically after a set number of days' },
      { type: 'new', text: 'Support page with FAQ and contact form' },
      { type: 'improved', text: 'Faster portal load times' },
    ],
  },
  {
    version: '1.2',
    date: 'February 2025',
    tag: 'Update',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    items: [
      { type: 'new', text: 'Annual billing option — save $30/year on Pro' },
      { type: 'new', text: 'Email notifications when clients complete steps (Pro)' },
      { type: 'new', text: 'White-label option — remove Onbrd branding (Pro)' },
      { type: 'improved', text: 'Drag-and-drop step reordering in the flow editor' },
      { type: 'fix', text: 'Fixed an issue where progress wasn\'t saving correctly on mobile' },
    ],
  },
  {
    version: '1.1',
    date: 'January 2025',
    tag: 'Update',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    items: [
      { type: 'new', text: 'Dark mode support across the entire dashboard' },
      { type: 'new', text: 'Clone flows — duplicate an existing flow as a template' },
      { type: 'new', text: 'Google OAuth sign-in' },
      { type: 'improved', text: 'Onboarding portal now fully responsive on mobile' },
      { type: 'fix', text: 'Fixed email verification link expiry edge case' },
    ],
  },
  {
    version: '1.0',
    date: 'December 2024',
    tag: 'Launch',
    tagColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    items: [
      { type: 'new', text: 'Onbrd launches — create client onboarding portals in minutes' },
      { type: 'new', text: 'Create flows with unlimited steps (Pro) or up to 2 flows with 2 steps (Free)' },
      { type: 'new', text: 'Shareable client portal links — no account required for clients' },
      { type: 'new', text: 'Progress tracking — see which steps each client has completed' },
      { type: 'new', text: 'Free and Pro plans via Stripe' },
    ],
  },
]

const typeStyles: Record<string, string> = {
  new: 'text-blue-400 bg-blue-400/10',
  improved: 'text-purple-400 bg-purple-400/10',
  fix: 'text-yellow-400 bg-yellow-400/10',
}

const typeLabels: Record<string, string> = {
  new: 'New',
  improved: 'Improved',
  fix: 'Fix',
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-dark.png" alt="Onbrd" width={120} height={60} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">Get started</Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-14">
          <h1 className="text-4xl font-semibold mb-3">Changelog</h1>
          <p className="text-gray-400 text-lg">New features, improvements, and fixes.</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-2 bottom-0 w-px bg-neutral-800" />

          <div className="space-y-14">
            {releases.map((release, i) => (
              <div key={i} className="pl-8 relative">
                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-neutral-600 -translate-x-[3px]" />

                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${release.tagColor}`}>
                    {release.tag}
                  </span>
                  <h2 className="font-semibold text-white">Version {release.version}</h2>
                  <span className="text-sm text-gray-500">{release.date}</span>
                </div>

                <div className="space-y-3">
                  {release.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${typeStyles[item.type]}`}>
                        {typeLabels[item.type]}
                      </span>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-800 py-8 px-6 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo-dark.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto opacity-60" />
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Blog</Link>
            <Link href="/support" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Support</Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Privacy</Link>
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
