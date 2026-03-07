'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalEvents: number
  uniqueSessions: number
  funnel: { company: number; brief: number; proposal: number }
  industries: Record<string, number>
  languages: Record<string, number>
  budgets: Record<string, number>
  actions: Record<string, number>
  landingActions: Record<string, number>
  tierClicks: Record<string, number>
  waitlist: Array<{ email: string; feature: string; timestamp: string }>
  featureRequests: Record<string, number>
  avgBriefLength: number
  lastUpdated: string | null
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

function BarChart({ data, label }: { data: Record<string, number>; label: string }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map(([, v]) => v), 1)

  if (entries.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
        <p className="mt-4 text-sm text-slate-400">No data yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
      <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      <div className="mt-4 space-y-3">
        {entries.map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{key}</span>
              <span className="font-medium">{value}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SignalsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/signals')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Failed to load signals data.</p>
      </div>
    )
  }

  const funnelConversion = stats.funnel.company > 0
    ? Math.round((stats.funnel.proposal / stats.funnel.company) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-slate-900">Proposa</Link>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Signals Dashboard
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total events" value={stats.totalEvents} />
          <StatCard label="Unique sessions" value={stats.uniqueSessions} />
          <StatCard label="Waitlist signups" value={stats.waitlist.length} />
          <StatCard
            label="Funnel conversion"
            value={`${funnelConversion}%`}
            sub="Company form → Proposal generated"
          />
        </div>

        {/* Funnel */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
          <h3 className="text-sm font-semibold text-slate-700">Conversion funnel</h3>
          <div className="mt-4 flex items-end gap-4">
            {[
              { label: 'Company form', value: stats.funnel.company },
              { label: 'Brief form', value: stats.funnel.brief },
              { label: 'Proposal generated', value: stats.funnel.proposal },
              { label: 'Copied', value: stats.actions.copy || 0 },
              { label: 'Downloaded', value: stats.actions.download || 0 },
            ].map((step) => {
              const max = Math.max(stats.funnel.company, 1)
              const height = Math.max((step.value / max) * 200, 20)
              return (
                <div key={step.label} className="flex flex-1 flex-col items-center">
                  <span className="mb-2 text-lg font-bold text-slate-900">{step.value}</span>
                  <div
                    className="w-full rounded-t-lg bg-indigo-500"
                    style={{ height: `${height}px` }}
                  />
                  <span className="mt-2 text-center text-xs text-slate-500">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Distribution charts */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BarChart data={stats.industries} label="Industries" />
          <BarChart data={stats.languages} label="Languages" />
          <BarChart data={stats.budgets} label="Budget ranges" />
          <BarChart data={stats.tierClicks} label="Pricing tier clicks" />
          <BarChart data={stats.featureRequests} label="Feature requests" />
          <BarChart data={stats.landingActions} label="Landing page CTAs" />
        </div>

        {/* Avg brief length */}
        <div className="mt-8">
          <StatCard
            label="Average brief length"
            value={`${stats.avgBriefLength} chars`}
            sub="Longer briefs = better proposals. Consider guiding users to write more."
          />
        </div>

        {/* Waitlist table */}
        {stats.waitlist.length > 0 && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
            <h3 className="text-sm font-semibold text-slate-700">Waitlist signups ({stats.waitlist.length})</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Feature interest</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.waitlist.slice(-20).reverse().map((entry, i) => (
                    <tr key={i}>
                      <td className="py-2 text-slate-900">{String(entry.email)}</td>
                      <td className="py-2 text-slate-600">{String(entry.feature) || '—'}</td>
                      <td className="py-2 text-slate-400">{new Date(entry.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Decision signals */}
        <div className="mt-8 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-6">
          <h3 className="text-sm font-semibold text-indigo-700">What the signals tell you</h3>
          <ul className="mt-3 space-y-2 text-sm text-indigo-600">
            <li>If <strong>IT & Software</strong> dominates industries → double down on dev agency templates and SEO</li>
            <li>If <strong>German</strong> dominates languages → prioritize DACH marketing, German blog content</li>
            <li>If <strong>15k-50k</strong> dominates budgets → your ICP is mid-market, adjust pricing messaging</li>
            <li>If <strong>Growth tier</strong> gets most clicks → it&apos;s correctly positioned as the sweet spot</li>
            <li>If funnel drops off at <strong>Brief form</strong> → make it easier, add examples, reduce fields</li>
            <li>If <strong>copy</strong> &gt;&gt; <strong>download</strong> → people prefer to paste into email, deprioritize PDF export</li>
            <li>If <strong>CRM integration</strong> tops feature requests → build Pipedrive/HubSpot integration next</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
