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
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Image src="/logo-dark.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto opacity-60" />
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">Privacy</Link>
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Onbrd</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
