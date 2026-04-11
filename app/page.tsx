import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight, Zap, Link2, BarChart3, ShieldCheck } from 'lucide-react'
import { getAllPosts, formatDate } from './lib/blog'
import { TestimonialsSection } from '../components/ui/testimonial-v2'

export default function LandingPage() {
  const recentPosts = getAllPosts().slice(0, 3)
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-dark.png"
              alt="Onbrd"
              width={120}
              height={60}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/client/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Client login
            </Link>
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
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-sm text-gray-400 mb-8">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Simple onboarding for modern teams
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Client onboarding,{' '}
            <br className="hidden md:block" />
            simplified
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Create step-by-step onboarding portals for your clients. One link, no confusion, no friction.
          </p>
          <div className="flex justify-center gap-3">
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 text-gray-300 text-base font-medium rounded-lg hover:bg-neutral-900 hover:border-neutral-600 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900 shadow-2xl shadow-blue-500/5">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-neutral-950 border-b border-neutral-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
              </div>
              <div className="flex-1 text-center text-xs text-gray-500 font-mono">
                onbrd.net/onboard/riverside-studio
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg" />
                <div>
                  <div className="font-medium text-white">Riverside Studio</div>
                  <div className="text-sm text-gray-500">Client Onboarding</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-white">2/4</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full">
                  <div className="h-full w-1/2 bg-blue-600 rounded-full" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-neutral-800/50">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-300">Sign Contract</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-neutral-800/50">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-300">Complete Payment</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-blue-600 bg-blue-600/5">
                  <div className="w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <span className="flex-1 text-white">Fill Out Intake Form</span>
                  <span className="px-3 py-1 bg-white text-black text-sm font-medium rounded-md">Open →</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 opacity-40">
                  <div className="w-6 h-6 border-2 border-neutral-600 rounded-full" />
                  <span className="text-gray-500">Schedule Kickoff Call</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center mb-4">
            How it works
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-md mx-auto">
            Three steps to a seamless onboarding experience
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: Zap,
                title: 'Create a flow', 
                desc: 'Add steps with links to your existing tools — contracts, forms, payments.' 
              },
              { 
                icon: Link2,
                title: 'Share one link', 
                desc: 'Your client gets a single URL. No app downloads, no account needed.' 
              },
              { 
                icon: BarChart3,
                title: 'Track progress', 
                desc: 'See which steps are done. Get notified when clients complete them.' 
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-medium text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-neutral-800" id="pricing">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center mb-3">
            Simple pricing
          </h2>
          <p className="text-gray-500 text-center mb-3">
            Start free. Upgrade when you&apos;re ready.
          </p>
          {/* Annual callout */}
          <p className="text-center text-sm text-blue-400 font-medium mb-12">
            🎉 Annual plan saves you $30/yr — just $12.50/mo
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-900">
              <h3 className="font-semibold text-white mb-1">Free</h3>
              <p className="text-sm text-gray-500 mb-4">Try it out, no card needed</p>
              <div className="text-3xl font-semibold text-white mb-5">
                $0<span className="text-sm font-normal text-gray-500">/forever</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  '2 flows',
                  '2 steps per flow',
                  'Progress tracking',
                  'Shareable client links',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-2.5 border border-neutral-700 text-gray-300 font-medium rounded-lg hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="border-2 border-blue-600 rounded-xl p-6 bg-neutral-900 relative shadow-lg shadow-blue-600/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-xs font-medium text-white bg-blue-600 px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">Pro</h3>
              <p className="text-sm text-gray-500 mb-4">For growing businesses</p>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-3xl font-semibold text-white">
                  $15<span className="text-sm font-normal text-gray-500">/mo</span>
                </div>
                <span className="text-sm text-gray-500 pb-0.5">or <span className="text-blue-400 font-medium">$12.50/mo</span> billed annually</span>
              </div>
              <p className="text-xs text-green-400 font-medium mb-5">Save $30 with the annual plan</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Unlimited flows & steps',
                  'Unlimited clients — no seat fees',
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
              <Link
                href="/signup"
                className="block text-center py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start free — upgrade anytime
              </Link>
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                <p className="text-xs text-gray-500">7-day money-back guarantee · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Blog */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">From the blog</h2>
              <p className="text-gray-500">Client onboarding tips and guides</p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              All posts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-8">
            {recentPosts.map((post) => (
              <article key={post.slug} className="flex gap-6 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(post.date)}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="font-medium text-white mb-1 group-hover:text-blue-400 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <Link href={`/blog/${post.slug}`} className="text-gray-600 group-hover:text-blue-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Ready to simplify onboarding?
          </h2>
          <p className="text-gray-500 mb-8">
            Create your first flow in under 5 minutes. No credit card required.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get started for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <Image src="/logo-dark.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto opacity-70 mb-4" />
              <p className="text-xs text-gray-600 leading-relaxed">
                Client onboarding portals that just work.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</p>
              <div className="space-y-2.5">
                <Link href="/signup" className="block text-sm text-gray-600 hover:text-gray-300 transition-colors">Get started</Link>
                <Link href="/#pricing" className="block text-sm text-gray-600 hover:text-gray-300 transition-colors">Pricing</Link>
                <Link href="/changelog" className="block text-sm text-gray-600 hover:text-gray-300 transition-colors">Changelog</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resources</p>
              <div className="space-y-2.5">
                <Link href="/blog" className="block text-sm text-gray-600 hover:text-gray-300 transition-colors">Blog</Link>
                <Link href="/support" className="block text-sm text-gray-600 hover:text-gray-300 transition-colors">Support</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</p>
              <div className="space-y-2.5">
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-gray-300 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-gray-600 hover:text-gray-300 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-700">© {new Date().getFullYear()} Onbrd. All rights reserved.</p>
            <a
              href="https://www.producthunt.com/products/onbrd?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-onbrd"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <img
                alt="Onbrd - One link. No back-and-forth. | Product Hunt"
                width={250}
                height={54}
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1119327&theme=dark&t=1775696690819"
              />
            </a>
            <div className="flex items-center gap-4">
              <a href="mailto:info@onbrd.net" className="text-xs text-gray-700 hover:text-gray-400 transition-colors">info@onbrd.net</a>
              <a href="https://www.facebook.com/Onbrding" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-400 transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/onbrding/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-400 transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <Link href="/client/login" className="text-xs text-gray-700 hover:text-gray-400 transition-colors">Client login</Link>
              <Link href="/login" className="text-xs text-gray-700 hover:text-gray-400 transition-colors">Log in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
