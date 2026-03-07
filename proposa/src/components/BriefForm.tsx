'use client'

import { useState } from 'react'

export interface ClientBrief {
  clientName: string
  briefText: string
  budget: string
  deadline: string
}

interface Props {
  onSubmit: (brief: ClientBrief) => void
  onBack: () => void
}

export default function BriefForm({ onSubmit, onBack }: Props) {
  const [brief, setBrief] = useState<ClientBrief>({
    clientName: '',
    briefText: '',
    budget: '',
    deadline: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(brief)
  }

  const update = (field: keyof ClientBrief, value: string) => {
    setBrief((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Client brief</h2>
        <p className="mt-1 text-slate-500">
          Paste the RFP, client email, or describe the project. The more detail, the better the proposal.
        </p>
      </div>

      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-slate-700">
          Client / company name
        </label>
        <input
          id="clientName"
          type="text"
          required
          value={brief.clientName}
          onChange={(e) => update('clientName', e.target.value)}
          placeholder="e.g., Müller Bau AG"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label htmlFor="briefText" className="block text-sm font-medium text-slate-700">
          Project brief or RFP
        </label>
        <textarea
          id="briefText"
          required
          rows={8}
          value={brief.briefText}
          onChange={(e) => update('briefText', e.target.value)}
          placeholder={`Paste the client's email, RFP document, or describe the project here.\n\nExample:\n"We need a new company website with a product catalog, customer portal, and integration with our SAP system. The site should support German and English. We want to launch by Q3 2026. Please include ongoing maintenance in your proposal."`}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-slate-700">
            Estimated budget range (optional)
          </label>
          <select
            id="budget"
            value={brief.budget}
            onChange={(e) => update('budget', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Not specified</option>
            <option value="under-5k">Under &euro;5,000</option>
            <option value="5k-15k">&euro;5,000 &ndash; &euro;15,000</option>
            <option value="15k-50k">&euro;15,000 &ndash; &euro;50,000</option>
            <option value="50k-100k">&euro;50,000 &ndash; &euro;100,000</option>
            <option value="100k-plus">&euro;100,000+</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-slate-700">
            Desired timeline (optional)
          </label>
          <input
            id="deadline"
            type="text"
            value={brief.deadline}
            onChange={(e) => update('deadline', e.target.value)}
            placeholder="e.g., Q3 2026, 3 months, ASAP"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-500"
        >
          Generate proposal
        </button>
      </div>
    </form>
  )
}
