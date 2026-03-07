import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Proposa, an expert B2B proposal writer for European service businesses. You generate professional, persuasive proposals that win deals.

Rules:
- Write in the specified language
- Match the specified tone exactly
- Use the company's actual services — never invent capabilities
- Structure proposals with clear Markdown headings
- Include realistic timelines and phased deliverables
- Format pricing as a clear breakdown with line items
- Include standard EU business terms (VAT note, payment terms, validity period)
- Be specific and concrete — avoid generic filler
- Keep it concise but thorough (800-1200 words)

Proposal structure:
1. # Proposal: [Project Title]
2. ## Executive Summary (2-3 sentences)
3. ## Understanding Your Needs (show you understood the brief)
4. ## Proposed Solution (scope of work with specific deliverables)
5. ## Timeline & Milestones (phased approach with dates)
6. ## Investment (pricing table with line items, subtotal, VAT note)
7. ## Why [Company Name] (2-3 differentiators)
8. ## Next Steps (clear CTA with validity period)
9. --- followed by contact details and legal line`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyProfile, clientBrief } = body

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          proposal: generateFallbackProposal(companyProfile, clientBrief),
          source: 'template',
        },
        { status: 200 }
      )
    }

    const client = new Anthropic({ apiKey })

    const budgetMap: Record<string, string> = {
      'under-5k': 'under EUR 5,000',
      '5k-15k': 'EUR 5,000 - EUR 15,000',
      '15k-50k': 'EUR 15,000 - EUR 50,000',
      '50k-100k': 'EUR 50,000 - EUR 100,000',
      '100k-plus': 'EUR 100,000+',
    }

    const userPrompt = `Generate a professional proposal with these details:

**Our Company:**
- Name: ${companyProfile.companyName}
- Industry: ${companyProfile.industry}
- Services: ${companyProfile.services}
- Tone: ${companyProfile.tone}
- Language: ${companyProfile.language}

**Client:**
- Client name: ${clientBrief.clientName}
- Budget range: ${budgetMap[clientBrief.budget] || 'Not specified'}
- Timeline: ${clientBrief.deadline || 'Not specified'}

**Project Brief:**
${clientBrief.briefText}

Generate the full proposal now in ${companyProfile.language}. Use Markdown formatting.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const proposal = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    return NextResponse.json({ proposal, source: 'ai' })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate proposal. Please try again.' },
      { status: 500 }
    )
  }
}

function generateFallbackProposal(
  company: { companyName: string; industry: string; services: string },
  brief: { clientName: string; briefText: string; budget: string; deadline: string }
): string {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `# Proposal for ${brief.clientName}

**Prepared by ${company.companyName}**
**Date: ${today}**

---

## Executive Summary

${company.companyName} is pleased to submit this proposal for the project described below. Based on our expertise in ${company.industry} and our core services (${company.services}), we are confident we can deliver outstanding results.

## Understanding Your Needs

${brief.briefText}

## Proposed Solution

Based on the brief above, we propose the following scope of work:

- **Discovery & Requirements** — Detailed analysis of your needs, stakeholder interviews, and technical assessment
- **Design & Architecture** — Solution design, prototyping, and approval process
- **Implementation** — Core development and build-out of the solution
- **Testing & QA** — Comprehensive quality assurance and user acceptance testing
- **Launch & Handover** — Go-live support, documentation, and knowledge transfer

## Timeline

${brief.deadline ? `Target: ${brief.deadline}` : 'To be determined based on scope confirmation.'}

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Discovery | 2 weeks | Requirements document, project plan |
| Design | 2-3 weeks | Solution design, prototypes |
| Implementation | 4-8 weeks | Working solution |
| Testing | 1-2 weeks | Test reports, bug fixes |
| Launch | 1 week | Go-live, documentation |

## Investment

Detailed pricing will be provided after the discovery phase. ${brief.budget ? `Your indicated budget range (${brief.budget}) has been noted and we will work within it.` : ''}

All prices are net and subject to applicable VAT. Payment terms: 30 days net.

## Why ${company.companyName}

- Deep expertise in ${company.industry}
- Proven track record with European clients
- End-to-end delivery from concept to launch

## Next Steps

1. Schedule a call to discuss this proposal
2. Confirm scope and timeline
3. Sign off and begin discovery phase

This proposal is valid until ${validUntil}.

---

**${company.companyName}** | ${today}
All prices exclude VAT. Terms subject to our standard service agreement.

---

*Note: This is a template-generated proposal. Connect your Anthropic API key for AI-powered, fully customized proposals.*`
}
