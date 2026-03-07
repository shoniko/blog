import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface SignalInput {
  event: string
  properties: Record<string, string | number | boolean>
  timestamp: string
  sessionId: string
}

// POST — receive a signal event
export async function POST(request: NextRequest) {
  try {
    const signal: SignalInput = await request.json()

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, storage: 'none' })
    }

    const { error } = await supabase.from('signals').insert({
      event: signal.event,
      properties: signal.properties,
      session_id: signal.sessionId,
      created_at: signal.timestamp,
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Signal store error:', err)
    return NextResponse.json({ error: 'Failed to store signal' }, { status: 500 })
  }
}

// Helper to count by property value from a set of rows
function countByProperty(
  rows: Array<{ properties: Record<string, unknown> }>,
  key: string
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    const val = String(row.properties[key] ?? 'unknown')
    counts[val] = (counts[val] || 0) + 1
  }
  return counts
}

// GET — return aggregated stats for the dashboard
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      totalEvents: 0,
      uniqueSessions: 0,
      funnel: { company: 0, brief: 0, proposal: 0 },
      industries: {},
      languages: {},
      budgets: {},
      actions: {},
      landingActions: {},
      tierClicks: {},
      waitlist: [],
      featureRequests: {},
      avgBriefLength: 0,
      lastUpdated: null,
      proposals: { total: 0, byIndustry: {}, byLanguage: {} },
    })
  }

  // Fetch aggregated data using targeted queries
  const [
    totalResult,
    sessionsResult,
    stepViewsResult,
    profilesResult,
    briefsResult,
    actionsResult,
    landingResult,
    waitlistSignups,
    proposalsResult,
  ] = await Promise.all([
    // Total events count
    supabase.from('signals').select('id', { count: 'exact', head: true }),
    // Unique sessions
    supabase.from('signals').select('session_id'),
    // Step views for funnel
    supabase.from('signals').select('properties').eq('event', 'step_view'),
    // Company profiles for industry/language
    supabase.from('signals').select('properties').eq('event', 'company_profile_submitted'),
    // Briefs for budget/length
    supabase.from('signals').select('properties').eq('event', 'brief_submitted'),
    // Proposal actions
    supabase.from('signals').select('properties').eq('event', 'proposal_action'),
    // Landing actions
    supabase.from('signals').select('properties').eq('event', 'landing_action'),
    // Waitlist from dedicated table
    supabase.from('waitlist').select('email, feature, created_at').order('created_at', { ascending: false }).limit(100),
    // Proposals stats
    supabase.from('proposals').select('industry, language, created_at'),
  ])

  const totalEvents = totalResult.count || 0

  // Unique sessions
  const sessionSet = new Set((sessionsResult.data || []).map((r) => r.session_id))
  const uniqueSessions = sessionSet.size

  // Funnel
  const stepViews = stepViewsResult.data || []
  const funnel = {
    company: stepViews.filter((s) => s.properties?.step === 'company').length,
    brief: stepViews.filter((s) => s.properties?.step === 'brief').length,
    proposal: stepViews.filter((s) => s.properties?.step === 'proposal').length,
  }

  // Industry + language distribution
  const profiles = profilesResult.data || []
  const industries = countByProperty(profiles, 'industry')
  const languages = countByProperty(profiles, 'language')

  // Budget distribution
  const briefs = briefsResult.data || []
  const budgets = countByProperty(briefs, 'budget')

  // Average brief length
  const briefLengths = briefs
    .map((s) => Number(s.properties?.briefLength || 0))
    .filter((n) => n > 0)
  const avgBriefLength = briefLengths.length > 0
    ? Math.round(briefLengths.reduce((a, b) => a + b, 0) / briefLengths.length)
    : 0

  // Proposal actions
  const actions = countByProperty(actionsResult.data || [], 'action')

  // Landing actions
  const landingRows = landingResult.data || []
  const landingActions = countByProperty(landingRows, 'action')
  const tierClicks = countByProperty(
    landingRows.filter((r) => r.properties?.action === 'pricing_tier_click'),
    'tier'
  )

  // Waitlist
  const waitlist = (waitlistSignups.data || []).map((w) => ({
    email: w.email,
    feature: w.feature,
    timestamp: w.created_at,
  }))

  // Feature requests from waitlist
  const featureRequests: Record<string, number> = {}
  for (const w of waitlist) {
    if (w.feature) {
      featureRequests[w.feature] = (featureRequests[w.feature] || 0) + 1
    }
  }

  // Proposals stats
  const proposalRows = proposalsResult.data || []
  const proposalsByIndustry: Record<string, number> = {}
  const proposalsByLanguage: Record<string, number> = {}
  for (const p of proposalRows) {
    if (p.industry) proposalsByIndustry[p.industry] = (proposalsByIndustry[p.industry] || 0) + 1
    if (p.language) proposalsByLanguage[p.language] = (proposalsByLanguage[p.language] || 0) + 1
  }

  // Last updated
  const { data: lastSignal } = await supabase
    .from('signals')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({
    totalEvents,
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
    lastUpdated: lastSignal?.created_at || null,
    proposals: {
      total: proposalRows.length,
      byIndustry: proposalsByIndustry,
      byLanguage: proposalsByLanguage,
    },
  })
}
