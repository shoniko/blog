'use client'

import Link from 'next/link'
import { trackLandingAction } from '@/lib/signals'

const tiers = [
  {
    name: 'Starter',
    price: '99',
    description: 'For freelancers and solo consultants.',
    features: [
      '10 proposals per month',
      '1 user',
      '3 languages',
      'Markdown export',
      'Email support',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '299',
    description: 'For growing agencies and teams.',
    features: [
      '50 proposals per month',
      '5 users',
      'All EU languages',
      'PDF + Markdown export',
      'Custom branding',
      'Proposal analytics',
      'Priority support',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '799',
    description: 'For established firms with volume.',
    features: [
      'Unlimited proposals',
      'Unlimited users',
      'All languages',
      'API access',
      'Custom templates',
      'CRM integration',
      'Dedicated account manager',
      'SSO / SAML',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Every plan includes a 14-day free trial. No credit card required.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 ${
                tier.highlighted
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 ring-2 ring-indigo-600'
                  : 'bg-white ring-1 ring-slate-200'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white">
                  Most popular
                </div>
              )}
              <h3
                className={`text-lg font-semibold ${
                  tier.highlighted ? 'text-white' : 'text-slate-900'
                }`}
              >
                {tier.name}
              </h3>
              <p
                className={`mt-1 text-sm ${
                  tier.highlighted ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                {tier.description}
              </p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-bold">&euro;{tier.price}</span>
                <span
                  className={`ml-1 text-sm ${
                    tier.highlighted ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  /month
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                        tier.highlighted ? 'text-indigo-200' : 'text-indigo-500'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                onClick={() => trackLandingAction('pricing_tier_click', tier.name)}
                className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition ${
                  tier.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            All prices exclude VAT. Annual billing saves 20%.
            <br />
            Need a custom plan? <a href="mailto:hello@proposa.eu" className="text-indigo-600 hover:text-indigo-500">Talk to us</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
