import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">OnboardLink</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-6">
            Client onboarding, simplified
          </h1>
          <p className="text-xl text-gray-500 mb-10">
            Create step-by-step onboarding portals for your clients. One link, no confusion.
          </p>
          <div className="flex justify-center gap-3">
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
              </div>
              <div className="flex-1 text-center text-xs text-gray-400">
                onboard.link/acme-corp
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-lg" />
                <div>
                  <div className="font-medium text-gray-900">Acme Corp</div>
                  <div className="text-sm text-gray-500">Client Onboarding</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-900">2/4</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full w-1/2 bg-blue-600 rounded-full" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-900">Sign Contract</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-900">Complete Payment</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-blue-600">
                  <div className="w-6 h-6 border-2 border-blue-600 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <span className="flex-1 text-gray-900">Fill Out Intake Form</span>
                  <span className="px-3 py-1 bg-gray-900 text-white text-sm rounded-md">Open →</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 opacity-50">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-400">Schedule Kickoff Call</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Create a flow', desc: 'Add steps with links to your existing tools — contracts, forms, payments.' },
              { title: 'Share one link', desc: 'Your client gets a single URL. No app downloads, no account needed.' },
              { title: 'Track progress', desc: 'See which steps are done. Get notified when clients complete them.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white font-semibold rounded-full flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            Simple pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Free</h3>
              <p className="text-sm text-gray-500 mb-4">For getting started</p>
              <div className="text-3xl font-semibold text-gray-900 mb-6">$0<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-2 mb-6">
                {['Up to 3 flows', 'Unlimited steps', 'Progress tracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-blue-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-2 border border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50">
                Get started
              </Link>
            </div>
            <div className="border-2 border-gray-900 rounded-lg p-6 bg-gray-900 text-white">
              <h3 className="font-semibold mb-1">Pro</h3>
              <p className="text-sm text-gray-400 mb-4">For growing businesses</p>
              <div className="text-3xl font-semibold mb-6">$10<span className="text-sm font-normal text-gray-400">/mo</span></div>
              <ul className="space-y-2 mb-6">
                {['Unlimited flows', 'Email notifications', 'Remove branding', 'Priority support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-2 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100">
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to simplify onboarding?
          </h2>
          <p className="text-gray-500 mb-6">
            Create your first flow in under 5 minutes.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Get started for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">OnboardLink</span>
          </div>
          <p className="text-sm text-gray-400">© 2024</p>
        </div>
      </footer>
    </div>
  )
}
