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
 * Splits a large string into chunks of up to `maxChars` characters,
 * breaking on line boundaries so as not to split sentences inside lines.
 */
function splitIntoChunks(str: string, maxChars = 15000): string[] {
  const chunks: string[] = []
  let buffer = ''
  for (const line of str.split('\n')) {
    // if adding this line would exceed the limit, flush current buffer
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
  // 1) Fetch encrypted content & key
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('enc_content, enc_key')
    .eq('id', docId)
    .single()

  if (error || !data) {
    return res.status(404).json({ error: 'Document not found' })
  }

  // 2) Decrypt the document text
  const text = decryptText(data.enc_content, data.enc_key)
  console.log('🛠️  Decrypted document text (first 500 chars):', text.slice(0, 500))

  // 3) DigiSign‐only guard
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const isAllDigiSign =
    lines.length > 0 && lines.every(line => line.includes('DigiSign Verified'))
  if (isAllDigiSign) {
    return res.status(400).json({
      error:
        'It looks like you uploaded a DigiSign audit certificate, not the actual contract. Please upload the full contract PDF so we can summarize it.',
    })
  }

  // 4) Split into manageable chunks
  const chunks = splitIntoChunks(text)
  console.log(`🛠️  Split document into ${chunks.length} chunk(s)`)

  // 5) Summarize each chunk
  const partialSummaries: string[] = []
  for (const [i, chunk] of chunks.entries()) {
    console.log(`🛠️  Summarizing chunk ${i + 1}/${chunks.length} (length ${chunk.length})`)
    const resp = await getOpenAISummary(SUMMARY_PROMPT, chunk)
    const chunkSummary = resp.choices?.[0]?.message?.content?.trim()
    if (chunkSummary) {
      partialSummaries.push(`Chunk ${i + 1} summary:\n${chunkSummary}`)
    }
  }

  if (partialSummaries.length === 0) {
    return res
      .status(500)
      .json({ error: 'GPT failed to produce any chunk summaries.' })
  }

  // 6) Combine all partial summaries into one final summary
  const combinePrompt = `
You have summaries of different sections of a lease. Combine them into a single coherent summary,
organized under bullet‐point headings for:
- Key dates (with context)
- Obligations (who, what, when)
- Risks or liabilities

Here are the per‐chunk summaries:
${partialSummaries.join('\n\n')}
`
  console.log('🛠️  Combining chunk summaries into final summary')
  const finalRes = await getOpenAISummary(combinePrompt, '')
  const finalSummary = finalRes.choices?.[0]?.message?.content?.trim() || 'No summary'

  // 7) Encrypt and store the final summary
  const enc_summary = encryptText(finalSummary, data.enc_key)
  await supabaseAdmin
    .from('documents')
    .update({ enc_summary })
    .eq('id', docId)

  // 8) Return plaintext summary
  res.status(200).json({ summary: finalSummary })
}
