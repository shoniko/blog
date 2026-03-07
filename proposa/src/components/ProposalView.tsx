'use client'

import { useState } from 'react'
import { trackProposalAction } from '@/lib/signals'

interface Props {
  proposal: string
  isLoading: boolean
  onBack: () => void
  onReset: () => void
}

export default function ProposalView({ proposal, isLoading, onBack, onReset }: Props) {
  const [copied, setCopied] = useState(false)
  const [editedProposal, setEditedProposal] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const displayText = isEditing ? editedProposal : proposal

  const getTextWithWatermark = (text: string) => {
    return text + '\n\n---\n*Generated with Proposa — proposa.eu*'
  }

  const handleCopy = async () => {
    trackProposalAction('copy')
    await navigator.clipboard.writeText(getTextWithWatermark(displayText))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => {
    trackProposalAction('edit')
    setEditedProposal(proposal)
    setIsEditing(true)
  }

  const handleDownload = () => {
    trackProposalAction('download')
    const blob = new Blob([getTextWithWatermark(displayText)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'proposal.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="mt-6 text-lg font-medium text-slate-900">Generating your proposal...</p>
        <p className="mt-1 text-sm text-slate-500">This usually takes 15-30 seconds.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your proposal</h2>
          <p className="mt-1 text-slate-500">Review, edit, and export.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Download .md
          </button>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editedProposal}
          onChange={(e) => setEditedProposal(e.target.value)}
          rows={30}
          className="block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <div className="prose prose-slate max-w-none">
            {proposal.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="mt-8 first:mt-0 text-2xl font-bold text-slate-900">{line.slice(2)}</h1>
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="mt-6 text-xl font-semibold text-slate-900">{line.slice(3)}</h2>
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="mt-4 text-lg font-semibold text-slate-900">{line.slice(4)}</h3>
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 text-slate-700">{line.slice(2)}</li>
              }
              if (line.startsWith('| ')) {
                return <p key={i} className="font-mono text-sm text-slate-700">{line}</p>
              }
              if (line.startsWith('---')) {
                return <hr key={i} className="my-6 border-slate-200" />
              }
              if (line.trim() === '') {
                return <br key={i} />
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-slate-900">{line.slice(2, -2)}</p>
              }
              return <p key={i} className="text-slate-700">{line}</p>
            })}
          </div>
          <div className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            Generated with <a href="https://proposa.eu" className="text-indigo-500 hover:text-indigo-600">Proposa</a> — AI-powered proposals for European service businesses
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Edit brief
        </button>
        <button
          onClick={() => { trackProposalAction('new_proposal'); onReset() }}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-500"
        >
          New proposal
        </button>
      </div>
    </div>
  )
}
