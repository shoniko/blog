'use client'

import { useState } from 'react'
import Link from 'next/link'
import CompanyForm, { CompanyProfile } from '@/components/CompanyForm'
import BriefForm, { ClientBrief } from '@/components/BriefForm'
import ProposalView from '@/components/ProposalView'

type Step = 'company' | 'brief' | 'proposal'

export default function AppPage() {
  const [step, setStep] = useState<Step>('company')
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)
  const [proposal, setProposal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompanySubmit = (profile: CompanyProfile) => {
    setCompanyProfile(profile)
    setStep('brief')
  }

  const handleBriefSubmit = async (brief: ClientBrief) => {
    if (!companyProfile) return

    setStep('proposal')
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyProfile, clientBrief: brief }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate proposal')
      }

      const data = await response.json()
      setProposal(data.proposal)
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('brief')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStep('company')
    setCompanyProfile(null)
    setProposal('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Proposa
          </Link>
          <div className="flex items-center gap-6">
            <nav className="flex gap-1">
              {(['company', 'brief', 'proposal'] as const).map((s, i) => (
                <div key={s} className="flex items-center">
                  {i > 0 && <div className="mx-2 h-px w-6 bg-slate-300" />}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      step === s
                        ? 'bg-indigo-600 text-white'
                        : i < ['company', 'brief', 'proposal'].indexOf(step)
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 'company' && <CompanyForm onSubmit={handleCompanySubmit} />}
        {step === 'brief' && (
          <BriefForm onSubmit={handleBriefSubmit} onBack={() => setStep('company')} />
        )}
        {step === 'proposal' && (
          <ProposalView
            proposal={proposal}
            isLoading={isLoading}
            onBack={() => setStep('brief')}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}
