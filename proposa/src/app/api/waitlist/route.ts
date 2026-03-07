import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, feature, source } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (!isSupabaseConfigured()) {
      console.log('Waitlist signup (no DB):', email, feature, source)
      return NextResponse.json({ ok: true, count: 0 })
    }

    // Upsert — if email already exists, update feature/source
    const { error } = await supabase.from('waitlist').upsert(
      {
        email,
        feature: feature || null,
        source: source || 'landing',
      },
      { onConflict: 'email' }
    )

    if (error) throw error

    // Get total count
    const { count } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })

    return NextResponse.json({ ok: true, count: count || 0 })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
  }
}
