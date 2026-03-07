import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts } from '../content'

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Not found' }

  return {
    title: `${post.title} — Proposa Blog`,
    description: post.description,
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">Proposa</Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900">Blog</Link>
            <Link
              href="/app"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Try free
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-600">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span>{post.readingTime}</span>
        </div>

        <article className="mt-8">
          <div className="prose prose-slate prose-lg max-w-none">
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-4xl font-bold text-slate-900">{line.slice(2)}</h1>
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="mt-10 text-2xl font-bold text-slate-900">{line.slice(3)}</h2>
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="mt-6 text-xl font-semibold text-slate-900">{line.slice(4)}</h3>
              }
              if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\*(.*)/)
                if (match) {
                  return (
                    <li key={i} className="ml-4 text-slate-700">
                      <strong>{match[1]}</strong>{match[2]}
                    </li>
                  )
                }
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 text-slate-700">{line.slice(2)}</li>
              }
              if (line.startsWith('| ')) {
                return <p key={i} className="font-mono text-sm text-slate-700">{line}</p>
              }
              if (line.startsWith('**Bad') || line.startsWith('**Good') || line.startsWith('**Instead') || line.startsWith('**Write') || line.startsWith('**The data') || line.startsWith('**Fix')) {
                const match = line.match(/\*\*(.+?)\*\*\s*(.*)/)
                if (match) {
                  return <p key={i} className="text-slate-700"><strong className="text-slate-900">{match[1]}</strong> {match[2]}</p>
                }
              }
              if (line.startsWith('---')) {
                return <hr key={i} className="my-8 border-slate-200" />
              }
              if (line.trim() === '') {
                return <br key={i} />
              }
              // Handle links in text
              if (line.includes('[') && line.includes('](/')) {
                const parts = line.split(/(\[.+?\]\(.+?\))/)
                return (
                  <p key={i} className="text-slate-700">
                    {parts.map((part, j) => {
                      const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/)
                      if (linkMatch) {
                        return (
                          <Link key={j} href={linkMatch[2]} className="text-indigo-600 hover:text-indigo-500">
                            {linkMatch[1]}
                          </Link>
                        )
                      }
                      // Handle bold within text
                      if (part.includes('**')) {
                        const boldParts = part.split(/(\*\*.+?\*\*)/)
                        return boldParts.map((bp, k) => {
                          if (bp.startsWith('**') && bp.endsWith('**')) {
                            return <strong key={k}>{bp.slice(2, -2)}</strong>
                          }
                          return bp
                        })
                      }
                      return part
                    })}
                  </p>
                )
              }
              return <p key={i} className="text-slate-700">{line}</p>
            })}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-center text-white">
          <h3 className="text-2xl font-bold">Stop spending hours on proposals</h3>
          <p className="mt-3 text-indigo-200">
            Paste your client&apos;s brief and get a professional proposal in minutes.
          </p>
          <Link
            href="/app"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Try Proposa free
          </Link>
        </div>
      </main>
    </div>
  )
}
