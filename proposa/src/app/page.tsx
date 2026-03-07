import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Stop spending hours on proposals
          </h2>
          <p className="mt-4 text-lg text-indigo-200">
            Your competitors are already using AI. The average service business spends 20+ hours per month on proposals.
            Proposa gives you that time back.
          </p>
          <a
            href="/app"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-indigo-600 shadow-lg transition hover:bg-indigo-50"
          >
            Generate your first proposal free
          </a>
          <div className="mx-auto mt-10 max-w-md">
            <p className="mb-3 text-sm text-indigo-200">Or join the waitlist:</p>
            <WaitlistForm source="bottom_cta" />
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Free proposal resources</h2>
          <p className="mt-2 text-slate-600">Templates, guides, and tips for European service businesses.</p>
          <Link
            href="/blog"
            className="mt-6 inline-block rounded-lg border border-indigo-600 px-6 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Read the blog
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
