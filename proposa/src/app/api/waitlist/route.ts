import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const WAITLIST_FILE = path.join(process.cwd(), 'waitlist.json')

interface WaitlistEntry {
  email: string
  feature: string
  timestamp: string
  source: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, feature, source } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const entry: WaitlistEntry = {
      email,
      feature: feature || '',
      timestamp: new Date().toISOString(),
      source: source || 'landing',
    }

    let existing: WaitlistEntry[] = []
    try {
      const data = await fs.readFile(WAITLIST_FILE, 'utf-8')
      existing = JSON.parse(data)
    } catch {
      existing = []
    }

    // Deduplicate by email
    if (!existing.some((e) => e.email === email)) {
      existing.push(entry)
      await fs.writeFile(WAITLIST_FILE, JSON.stringify(existing, null, 2))
    }

    return NextResponse.json({ ok: true, count: existing.length })
  } catch {
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
  }
}
