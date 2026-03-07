import Link from 'next/link'
import { posts } from './content'

export const metadata = {
  title: 'Blog — Proposa | Proposal Templates & Guides for European Businesses',
  description: 'Free proposal templates, writing guides, and tips for European service businesses. Win more deals with better proposals.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">Proposa</Link>
          <Link
            href="/app"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Try free
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">Proposal guides & templates</h1>
        <p className="mt-4 text-lg text-slate-600">
          Practical advice for writing proposals that win. Free templates included.
        </p>

        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block rounded-2xl border border-slate-200 p-8 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-600">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 group-hover:text-indigo-600">
                  {post.title}
                </h2>
                <p className="mt-2 text-slate-600">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
