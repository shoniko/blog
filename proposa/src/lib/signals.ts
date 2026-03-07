'use client'

import { useEffect, useState } from 'react'

interface SignalData {
  event: string
  properties: Record<string, string | number | boolean>
  timestamp: string
  sessionId: string
}

let sessionId: string | null = null

function getSessionId(): string {
  if (sessionId) return sessionId
  if (typeof window !== 'undefined') {
    sessionId = sessionStorage.getItem('proposa_session') || crypto.randomUUID()
    sessionStorage.setItem('proposa_session', sessionId)
  }
  return sessionId || 'unknown'
}

export function trackEvent(event: string, properties: Record<string, string | number | boolean> = {}) {
  const signal: SignalData = {
    event,
    properties,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  }

  // Store locally for dashboard
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('proposa_signals') || '[]')
    existing.push(signal)
    // Keep last 1000 events
    if (existing.length > 1000) existing.splice(0, existing.length - 1000)
    localStorage.setItem('proposa_signals', JSON.stringify(existing))
  }

  // Also send to API (fire and forget)
  fetch('/api/signals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signal),
  }).catch(() => {})
}

// Track which industries and languages are most requested
export function trackCompanyProfile(profile: {
  industry: string
  tone: string
  language: string
}) {
  trackEvent('company_profile_submitted', {
    industry: profile.industry,
    tone: profile.tone,
    language: profile.language,
  })
}

// Track brief characteristics — what are people actually trying to propose?
export function trackBriefSubmitted(brief: {
  clientName: string
  briefLength: number
  budget: string
  hasDeadline: boolean
}) {
  trackEvent('brief_submitted', {
    briefLength: brief.briefLength,
    budget: brief.budget || 'not_specified',
    hasDeadline: brief.hasDeadline,
  })
}

// Track proposal outcomes — did they copy/download/edit?
export function trackProposalAction(action: 'copy' | 'download' | 'edit' | 'new_proposal') {
  trackEvent('proposal_action', { action })
}

// Track landing page engagement
export function trackLandingAction(action: 'cta_hero' | 'cta_pricing' | 'cta_bottom' | 'pricing_tier_click', tier?: string) {
  trackEvent('landing_action', { action, tier: tier || '' })
}

// Track where people drop off
export function trackStepView(step: 'company' | 'brief' | 'proposal') {
  trackEvent('step_view', { step })
}

// Waitlist / feature request collection
export function trackFeatureRequest(feature: string, email: string) {
  trackEvent('feature_request', { feature, email })
}

// Track time spent on each step
export function useStepTimer(step: string) {
  const [startTime] = useState(() => Date.now())

  useEffect(() => {
    return () => {
      const duration = Math.round((Date.now() - startTime) / 1000)
      trackEvent('step_duration', { step, durationSeconds: duration })
    }
  }, [step, startTime])
}
