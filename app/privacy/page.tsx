import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Onbrd collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  const lastUpdated = 'March 19, 2025'

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
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-10 text-gray-400 leading-relaxed">
          <section>
            <p>
              Onbrd ("we", "us", or "our") operates <a href="https://www.onbrd.net" className="text-blue-400 hover:text-blue-300">www.onbrd.net</a>. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
            </p>
          </section>

          {[
            {
              title: '1. Information We Collect',
              content: [
                '**Account information:** When you sign up, we collect your name and email address.',
                '**Usage data:** We collect information about how you use Onbrd, including pages visited, features used, and actions taken.',
                '**Payment information:** Payments are processed by Stripe. We do not store your credit card details — Stripe handles all payment data securely.',
                '**Client data:** Information your clients submit through your onboarding portals (forms, file uploads) is stored on your behalf.',
                '**Cookies:** We use cookies to keep you logged in and to understand how the service is used.',
              ],
            },
            {
              title: '2. How We Use Your Information',
              content: [
                'To provide, maintain, and improve the Onbrd service',
                'To process payments and send billing-related emails',
                'To send transactional emails (account verification, notifications)',
                'To respond to support requests',
                'To detect and prevent fraud or abuse',
                'To comply with legal obligations',
              ],
            },
            {
              title: '3. Sharing Your Information',
              content: [
                'We do not sell your personal data. We share information only with:',
                '**Stripe** — for payment processing',
                '**Resend** — for transactional email delivery',
                '**Supabase / hosting providers** — for data storage and infrastructure',
                '**Law enforcement** — if required by law or to protect our rights',
              ],
            },
            {
              title: '4. Data Retention',
              content: [
                'We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law.',
                'Uploaded files in onboarding portals are subject to the expiry settings you configure.',
              ],
            },
            {
              title: '5. Your Rights',
              content: [
                'Depending on your location, you may have the right to:',
                'Access the personal data we hold about you',
                'Correct inaccurate data',
                'Request deletion of your data',
                'Export your data in a portable format',
                'To exercise any of these rights, email us at info@onbrd.net.',
              ],
            },
            {
              title: '6. Security',
              content: [
                'We use industry-standard security measures including HTTPS encryption, secure password hashing, and access controls. No method of transmission over the internet is 100% secure, but we take reasonable steps to protect your data.',
              ],
            },
            {
              title: '7. Children\'s Privacy',
              content: [
                'Onbrd is not directed at children under 13. We do not knowingly collect personal information from children under 13.',
              ],
            },
            {
              title: '8. Changes to This Policy',
              content: [
                'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the site. The "last updated" date at the top of this page reflects the most recent revision.',
              ],
            },
            {
              title: '9. Contact',
              content: [
                'Questions about this Privacy Policy? Email us at info@onbrd.net or visit our support page.',
              ],
            },
          ].map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-white mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((item, j) => {
                  if (item.startsWith('**')) {
                    const match = item.match(/^\*\*(.+?)\*\*(.*)$/)
                    if (match) {
                      return (
                        <p key={j}>
                          <strong className="text-white">{match[1]}</strong>{match[2]}
                        </p>
                      )
                    }
                  }
                  return <p key={j}>{item}</p>
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-neutral-800 py-8 px-6 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo-dark.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto opacity-60" />
          <div className="flex items-center gap-6">
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
