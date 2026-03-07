'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/signals'

interface Props {
  source?: string
  compact?: boolean
}

export default function WaitlistForm({ source = 'landing', compact = false }: Props) {
  const [email, setEmail] = useState('')
  const [feature, setFeature] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, feature, source }),
      })

      if (!res.ok) throw new Error()

      trackEvent('waitlist_signup', { email, feature, source })
      setStatus('success')
      setEmail('')
      setFeature('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ${compact ? '' : 'text-center'}`}>
        You&apos;re on the list! We&apos;ll reach out soon.
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Join waitlist'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/20"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Get early access'}
        </button>
      </div>
      <select
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
        className="block w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-300/20"
      >
        <option value="" className="text-slate-900">What matters most to you?</option>
        <option value="ai-proposals" className="text-slate-900">AI-generated proposals</option>
        <option value="multilingual" className="text-slate-900">Multilingual support</option>
        <option value="templates" className="text-slate-900">Industry templates</option>
        <option value="crm-integration" className="text-slate-900">CRM integration</option>
        <option value="team-collaboration" className="text-slate-900">Team collaboration</option>
        <option value="analytics" className="text-slate-900">Proposal analytics</option>
      </select>
      {status === 'error' && (
        <p className="text-sm text-red-300">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
