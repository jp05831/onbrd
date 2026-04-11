import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Onbrd.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-semibold mb-3">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-10 text-gray-400 leading-relaxed">
          <section>
            <p>
              By accessing or using Onbrd ("the Service"), you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree, do not use the Service.
            </p>
          </section>

          {[
            {
              title: '1. Use of the Service',
              content: [
                'Onbrd provides a platform for building and sharing client onboarding portals. You may use the Service only for lawful purposes and in accordance with these Terms.',
                'You agree not to:',
                '— Use the Service to transmit spam, malware, or illegal content',
                '— Attempt to gain unauthorized access to any part of the Service',
                '— Resell or sublicense the Service without written permission',
                '— Impersonate any person or entity',
              ],
            },
            {
              title: '2. Accounts',
              content: [
                'You are responsible for maintaining the security of your account and password. Onbrd cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.',
                'You must be at least 18 years old to use the Service.',
              ],
            },
            {
              title: '3. Payments & Subscriptions',
              content: [
                'Paid plans are billed in advance on a monthly or annual basis. All payments are processed securely by Stripe.',
                'Subscriptions automatically renew unless cancelled before the renewal date. You can cancel at any time from your billing settings.',
                'We offer a 7-day money-back guarantee on all paid plans. After 7 days, payments are non-refundable.',
                'We reserve the right to change pricing with 30 days notice.',
              ],
            },
            {
              title: '4. Your Content',
              content: [
                'You retain ownership of all content you create or upload to Onbrd. By using the Service, you grant Onbrd a limited license to store and display your content solely to provide the Service.',
                'You are solely responsible for the content you create and share with your clients.',
              ],
            },
            {
              title: '5. Client Data',
              content: [
                'Information submitted by your clients through your onboarding portals is processed on your behalf. You are the data controller for your clients\' data. You are responsible for ensuring you have the appropriate legal basis to collect and process your clients\' information.',
              ],
            },
            {
              title: '6. Uptime & Service Availability',
              content: [
                'We strive to maintain high availability but do not guarantee uninterrupted access to the Service. We are not liable for any downtime or data loss beyond our reasonable control.',
              ],
            },
            {
              title: '7. Termination',
              content: [
                'We may suspend or terminate your account if you violate these Terms. You may delete your account at any time from your settings.',
                'Upon termination, your right to use the Service ceases immediately. We will delete your data within 30 days of account deletion.',
              ],
            },
            {
              title: '8. Disclaimer of Warranties',
              content: [
                'The Service is provided "as is" without warranty of any kind. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.',
              ],
            },
            {
              title: '9. Limitation of Liability',
              content: [
                'To the maximum extent permitted by law, Onbrd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising out of your use of the Service.',
                'Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.',
              ],
            },
            {
              title: '10. Changes to Terms',
              content: [
                'We may revise these Terms at any time. We will notify you of material changes by email or by posting a notice on the site. Continued use of the Service after changes constitutes acceptance of the new Terms.',
              ],
            },
            {
              title: '11. Governing Law',
              content: [
                'These Terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of the applicable jurisdiction.',
              ],
            },
            {
              title: '12. Contact',
              content: [
                'Questions about these Terms? Email us at info@onbrd.net.',
              ],
            },
          ].map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-white mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.content.map((item, j) => (
                  <p key={j}>{item}</p>
                ))}
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
