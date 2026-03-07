import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SIGNALS_FILE = path.join(process.cwd(), 'signals.json')

interface SignalData {
  event: string
  properties: Record<string, string | number | boolean>
  timestamp: string
  sessionId: string
}

async function readSignals(): Promise<SignalData[]> {
  try {
    const data = await fs.readFile(SIGNALS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function appendSignal(signal: SignalData): Promise<void> {
  const signals = await readSignals()
  signals.push(signal)
  // Keep last 10,000 signals
  if (signals.length > 10000) signals.splice(0, signals.length - 10000)
  await fs.writeFile(SIGNALS_FILE, JSON.stringify(signals, null, 2))
}

// POST — receive a signal event
export async function POST(request: NextRequest) {
  try {
    const signal: SignalData = await request.json()
    await appendSignal(signal)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to store signal' }, { status: 500 })
  }
}

// GET — return aggregated stats for the dashboard
export async function GET() {
  const signals = await readSignals()

  // Funnel counts
  const stepViews = signals.filter((s) => s.event === 'step_view')
  const funnel = {
    company: stepViews.filter((s) => s.properties.step === 'company').length,
    brief: stepViews.filter((s) => s.properties.step === 'brief').length,
    proposal: stepViews.filter((s) => s.properties.step === 'proposal').length,
  }

  // Industry distribution
  const industries: Record<string, number> = {}
  signals
    .filter((s) => s.event === 'company_profile_submitted')
    .forEach((s) => {
      const ind = String(s.properties.industry)
      industries[ind] = (industries[ind] || 0) + 1
    })

  // Language distribution
  const languages: Record<string, number> = {}
  signals
    .filter((s) => s.event === 'company_profile_submitted')
    .forEach((s) => {
      const lang = String(s.properties.language)
      languages[lang] = (languages[lang] || 0) + 1
    })

  // Budget distribution
  const budgets: Record<string, number> = {}
  signals
    .filter((s) => s.event === 'brief_submitted')
    .forEach((s) => {
      const b = String(s.properties.budget)
      budgets[b] = (budgets[b] || 0) + 1
    })

  // Proposal actions
  const actions: Record<string, number> = {}
  signals
    .filter((s) => s.event === 'proposal_action')
    .forEach((s) => {
      const a = String(s.properties.action)
      actions[a] = (actions[a] || 0) + 1
    })

  // Landing page CTA clicks
  const landingActions: Record<string, number> = {}
  signals
    .filter((s) => s.event === 'landing_action')
    .forEach((s) => {
      const a = String(s.properties.action)
      landingActions[a] = (landingActions[a] || 0) + 1
    })

  // Pricing tier clicks
  const tierClicks: Record<string, number> = {}
  signals
    .filter((s) => s.event === 'landing_action' && s.properties.action === 'pricing_tier_click')
    .forEach((s) => {
      const t = String(s.properties.tier)
      tierClicks[t] = (tierClicks[t] || 0) + 1
    })

  // Waitlist signups
  const waitlist = signals
    .filter((s) => s.event === 'waitlist_signup')
    .map((s) => ({
      email: s.properties.email,
      feature: s.properties.feature,
      timestamp: s.timestamp,
    }))

  // Feature requests
  const featureRequests: Record<string, number> = {}
  signals
    .filter((s) => s.event === 'waitlist_signup' && s.properties.feature)
    .forEach((s) => {
      const f = String(s.properties.feature)
      featureRequests[f] = (featureRequests[f] || 0) + 1
    })

  // Average brief length
  const briefLengths = signals
    .filter((s) => s.event === 'brief_submitted')
    .map((s) => Number(s.properties.briefLength))
  const avgBriefLength = briefLengths.length > 0
    ? Math.round(briefLengths.reduce((a, b) => a + b, 0) / briefLengths.length)
    : 0

  // Total unique sessions
  const uniqueSessions = new Set(signals.map((s) => s.sessionId)).size

  return NextResponse.json({
    totalEvents: signals.length,
    uniqueSessions,
    funnel,
    industries,
    languages,
    budgets,
    actions,
    landingActions,
    tierClicks,
    waitlist,
    featureRequests,
    avgBriefLength,
    lastUpdated: signals.length > 0 ? signals[signals.length - 1].timestamp : null,
  })
}
