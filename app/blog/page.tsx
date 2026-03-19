import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, formatDate } from '../lib/blog'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Client onboarding tips, guides, and best practices for freelancers and agencies. Learn how to streamline your onboarding process.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo-dark.png" alt="Onbrd" className="h-10 w-auto" />
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

      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-14">
          <h1 className="text-4xl font-semibold mb-4">Blog</h1>
          <p className="text-gray-400 text-lg">
            Client onboarding tips, guides, and best practices.
          </p>
        </div>

        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-neutral-800 pb-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                <span className="text-sm text-gray-600">·</span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-400 mb-4 leading-relaxed">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Read more <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src="/logo-dark.png" alt="Onbrd" className="h-8 w-auto opacity-60" />
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Onbrd</p>
        </div>
      </footer>
    </div>
  )
}
