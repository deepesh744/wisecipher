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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { docId } = req.body

  // 1) Load encrypted document
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('enc_content, enc_key')
    .eq('id', docId)
    .single()

  if (error || !data) {
    return res.status(404).json({ error: 'Document not found' })
  }

  // 2) Decrypt the text
  const text = decryptText(data.enc_content, data.enc_key)
  console.log('🛠️  Decrypted text (first 500 chars):', text.slice(0, 500))

  // 3) DigiSign‐only guard (unchanged)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length && lines.every(l => l.includes('DigiSign Verified'))) {
    return res.status(400).json({
      error:
        'It looks like you uploaded a DigiSign audit certificate, not the actual contract. Please upload the full contract PDF.',
    })
  }

  // === THIS IS THE FIX ===
  // Instead of passing a combined 'prompt' + text as system & user,
  // call the helper exactly as: (systemInstructions, userText)
  const ai = await getOpenAISummary(SUMMARY_PROMPT, text)
  const content = ai.choices?.[0]?.message?.content?.trim() ?? ''
  console.log('🛠️  GPT returned:', content.slice(0, 200))

  // 4) Parse GPT’s JSON output
  let jsonOut: {
    'Key Dates': string[]
    Obligations: string[]
    'Risks or Liabilities': string[]
  }

  try {
    jsonOut = JSON.parse(content)
  } catch (e) {
    console.error('❌ Failed to parse GPT JSON:', content)
    return res.status(500).json({
      error:
        'We got a non-JSON response from the AI. Please try again or upload a shorter document.',
    })
  }

  // 5) Encrypt & store the final summary
  const enc_summary = encryptText(JSON.stringify(jsonOut), data.enc_key)
  await supabaseAdmin
    .from('documents')
    .update({ enc_summary })
    .eq('id', docId)

  // 6) Return structured summary
  return res.status(200).json({ summary: jsonOut })
}
