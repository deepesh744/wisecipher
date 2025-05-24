// pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { decryptText, encryptText } from '../../lib/encryption'
import { getOpenAISummary } from '../../lib/openai'
import { SUMMARY_PROMPT } from '../../utils/constants'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Break a long string into chunks up to maxChars, cutting on line boundaries.
 */
function splitIntoChunks(str: string, maxChars = 15000): string[] {
  const chunks: string[] = []
  let buffer = ''
  for (const line of str.split('\n')) {
    if (buffer.length + line.length + 1 > maxChars) {
      chunks.push(buffer)
      buffer = line + '\n'
    } else {
      buffer += line + '\n'
    }
  }
  if (buffer) chunks.push(buffer)
  return chunks
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { docId } = req.body

  // 1) Load & decrypt
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('enc_content, enc_key')
    .eq('id', docId)
    .single()
  if (error || !data) return res.status(404).json({ error: 'Document not found' })
  const text = decryptText(data.enc_content, data.enc_key)

  // 2) DigiSign-only guard
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length && lines.every(l => l.includes('DigiSign Verified'))) {
    return res.status(400).json({
      error:
        'It looks like you uploaded a DigiSign audit certificate, not the actual contract. Please upload the full contract PDF.',
    })
  }

  // 3) Chunk the text so we stay within the model’s context window
  const chunks = splitIntoChunks(text)
  console.log(`🛠️  Split document into ${chunks.length} chunk(s)`)

  // 4) Summarize each chunk into JSON and merge
  const allDates: string[] = []
  const allObligations: string[] = []
  const allRisks: string[] = []

  for (let i = 0; i < chunks.length; i++) {
    console.log(`🛠️  Summarizing chunk ${i+1}/${chunks.length}`)
    const resp = await getOpenAISummary(SUMMARY_PROMPT, chunks[i])
    const content = resp.choices?.[0]?.message?.content?.trim() || ''
    let part: { 'Key Dates': string[]; Obligations: string[]; 'Risks or Liabilities': string[] }
    try {
      part = JSON.parse(content)
    } catch (e) {
      console.error('❌ Failed to parse chunk JSON:', content)
      return res.status(500).json({ error: 'Failed to parse summary from AI.' })
    }
    allDates.push(...part['Key Dates'])
    allObligations.push(...part.Obligations)
    allRisks.push(...part['Risks or Liabilities'])
  }

  // 5) Build the final merged JSON summary
  const finalSummary = {
    'Key Dates': allDates,
    Obligations: allObligations,
    'Risks or Liabilities': allRisks,
  }

  // 6) Encrypt & persist
  const enc_summary = encryptText(JSON.stringify(finalSummary), data.enc_key)
  await supabaseAdmin
    .from('documents')
    .update({ enc_summary })
    .eq('id', docId)

  // 7) Return it
  res.status(200).json({ summary: finalSummary })
}
