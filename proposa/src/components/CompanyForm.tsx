'use client'

import { useState } from 'react'

export interface CompanyProfile {
  companyName: string
  industry: string
  services: string
  tone: string
  language: string
}

interface Props {
  onSubmit: (profile: CompanyProfile) => void
}

export default function CompanyForm({ onSubmit }: Props) {
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: '',
    industry: '',
    services: '',
    tone: 'professional',
    language: 'english',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(profile)
  }

  const update = (field: keyof CompanyProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">About your business</h2>
        <p className="mt-1 text-slate-500">Tell us about your company so proposals sound like you.</p>
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
          Company name
        </label>
        <input
          id="companyName"
          type="text"
          required
          value={profile.companyName}
          onChange={(e) => update('companyName', e.target.value)}
          placeholder="e.g., Schmidt Digital GmbH"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-slate-700">
          Industry
        </label>
        <select
          id="industry"
          required
          value={profile.industry}
          onChange={(e) => update('industry', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">Select your industry</option>
          <option value="IT & Software Development">IT & Software Development</option>
          <option value="Marketing & Advertising Agency">Marketing & Advertising Agency</option>
          <option value="Management Consulting">Management Consulting</option>
          <option value="Architecture & Engineering">Architecture & Engineering</option>
          <option value="Construction & Trades">Construction & Trades</option>
          <option value="Legal Services">Legal Services</option>
          <option value="Accounting & Finance">Accounting & Finance</option>
          <option value="Design & Creative">Design & Creative</option>
          <option value="Training & Education">Training & Education</option>
          <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="services" className="block text-sm font-medium text-slate-700">
          Services you offer
        </label>
        <textarea
          id="services"
          required
          rows={3}
          value={profile.services}
          onChange={(e) => update('services', e.target.value)}
          placeholder="e.g., Web development, mobile apps, cloud migration, UI/UX design. Typical project sizes: EUR 10K-100K."
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-slate-700">
            Proposal tone
          </label>
          <select
            id="tone"
            value={profile.tone}
            onChange={(e) => update('tone', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="professional">Professional & formal</option>
            <option value="friendly">Friendly & approachable</option>
            <option value="technical">Technical & precise</option>
            <option value="bold">Bold & confident</option>
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-700">
            Proposal language
          </label>
          <select
            id="language"
            value={profile.language}
            onChange={(e) => update('language', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="english">English</option>
            <option value="german">Deutsch</option>
            <option value="french">Fran&ccedil;ais</option>
            <option value="spanish">Espa&ntilde;ol</option>
            <option value="dutch">Nederlands</option>
            <option value="italian">Italiano</option>
            <option value="portuguese">Portugu&ecirc;s</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-500"
      >
        Continue to brief
      </button>
    </form>
  )
}
