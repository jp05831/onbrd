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
