import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
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
        </div>
      </section>
      <Footer />
    </main>
  )
}
