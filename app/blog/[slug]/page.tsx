import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, formatDate } from '../../lib/blog'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `https://www.onbrd.net/blog/${post.slug}`,
    },
  }
}

// Render markdown-ish content as HTML (no deps needed for this simple case)
function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl font-semibold text-white mt-12 mb-4">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-lg font-semibold text-white mt-8 mb-3">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} className="border-neutral-800 my-8" />)
    } else if (line.startsWith('- **')) {
      // Bold list items like "- **Title** — desc"
      const match = line.match(/^- \*\*(.+?)\*\*(.*)$/)
      if (match) {
        elements.push(
          <li key={key++} className="text-gray-300 leading-relaxed mb-2">
            <strong className="text-white">{match[1]}</strong>
            {match[2]}
          </li>
        )
      }
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="text-gray-400 leading-relaxed mb-1.5 ml-4 list-disc">
          {parseLine(line.slice(2))}
        </li>
      )
    } else if (/^\d+\. /.test(line)) {
      elements.push(
        <li key={key++} className="text-gray-400 leading-relaxed mb-1.5 ml-4 list-decimal">
          {parseLine(line.replace(/^\d+\. /, ''))}
        </li>
      )
    } else if (line.startsWith('| ')) {
      // Skip table lines (handled below)
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="mb-2" />)
    } else {
      elements.push(
        <p key={key++} className="text-gray-400 leading-relaxed mb-4">
          {parseLine(line)}
        </p>
      )
    }
  }

  return elements
}

function parseLine(text: string): React.ReactNode {
  // Handle **bold**, [text](url), inline backticks
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    }
    const linkMatch = part.match(/^\[(.+)\]\((.+)\)$/)
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} className="text-blue-400 hover:text-blue-300 underline" target={linkMatch[2].startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
          {linkMatch[1]}
        </a>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="text-blue-300 bg-neutral-800 px-1.5 py-0.5 rounded text-sm">{part.slice(1, -1)}</code>
    }
    return part
  })
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prev = allPosts[currentIndex + 1]
  const next = allPosts[currentIndex - 1]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Onbrd', url: 'https://www.onbrd.net' },
    publisher: { '@type': 'Organization', name: 'Onbrd', url: 'https://www.onbrd.net' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.onbrd.net/blog/${post.slug}` },
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All posts
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
          <span className="text-sm text-gray-600">·</span>
          <span className="text-sm text-gray-500">{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-gray-400 mb-12 leading-relaxed">{post.description}</p>

        {/* Content */}
        <div className="prose-custom">{renderContent(post.content)}</div>

        {/* CTA */}
        <div className="mt-16 p-8 border border-blue-600/30 rounded-xl bg-blue-600/5 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready to streamline your client onboarding?
          </h3>
          <p className="text-gray-400 mb-6">
            Build your first onboarding portal in minutes — free to start.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <div className="mt-16 pt-8 border-t border-neutral-800 grid grid-cols-2 gap-4">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="group">
                <div className="text-xs text-gray-500 mb-1">← Previous</div>
                <div className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium leading-snug">
                  {prev.title}
                </div>
              </Link>
            ) : <div />}
            {next && (
              <Link href={`/blog/${next.slug}`} className="group text-right">
                <div className="text-xs text-gray-500 mb-1">Next →</div>
                <div className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium leading-snug">
                  {next.title}
                </div>
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-6 mt-16">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src="/logo-dark.png" alt="Onbrd" className="h-8 w-auto opacity-60" />
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Onbrd</p>
        </div>
      </footer>
    </div>
  )
}
