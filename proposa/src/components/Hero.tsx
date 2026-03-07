'use client'

import Link from 'next/link'
import WaitlistForm from './WaitlistForm'
import { trackLandingAction } from '@/lib/signals'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTJ2NEgyNFYwSDEydjRIMFY2aDEyVjRoMTJWNmgxMlY0aDEyem0tMiAyNnYtMkgyNHYyaDEweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            Built for European service businesses
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Win more deals.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Write fewer proposals.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
            Paste a client brief. Get a professional, tailored proposal in minutes — not hours.
            Proposa uses AI to generate proposals that match your voice, your services, and your pricing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/app"
              onClick={() => trackLandingAction('cta_hero')}
              className="rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 hover:shadow-indigo-400/30"
            >
              Try it free
            </Link>
            <a
              href="#pricing"
              onClick={() => trackLandingAction('cta_pricing')}
              className="rounded-lg border border-slate-600 px-6 py-3 text-base font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              View pricing
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">No credit card required. 5 free proposals.</p>

          <div className="mx-auto mt-10 max-w-md">
            <p className="mb-3 text-sm text-slate-400">Or join the waitlist for launch updates:</p>
            <WaitlistForm source="hero" compact />
          </div>
        </div>
      </div>
    </section>
  )
}
