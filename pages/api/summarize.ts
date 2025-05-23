import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'
import { decryptText, encryptText } from '../../lib/encryption';
import { getOpenAISummary } from '../../lib/openai';
import { SUMMARY_PROMPT } from '../../utils/constants';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { docId } = req.body;
  const { data, error } = await supabaseAdmin.from('documents').select('enc_content, enc_key').eq('id', docId).single();
  if (error || !data) return res.status(404).json({ error: "Document not found" });

  // Decrypt text with stored key
  const text = decryptText(data.enc_content, data.enc_key);
  console.log('🛠️  Decrypted document text:', text.slice(0, 500));

  const prompt = `${SUMMARY_PROMPT}\n\n${text}`;
  console.log('🛠️  Prompt to OpenAI:', prompt.slice(0, 500));

  const openaiRes = await getOpenAISummary(SUMMARY_PROMPT, text);

  const summary = openaiRes.choices?.[0]?.message?.content || 'No summary';

  // Encrypt summary before storing
  const enc_summary = encryptText(summary, data.enc_key);
  await supabaseAdmin
   .from('documents')
   .update({ enc_summary })
   .eq('id', docId)

  res.status(200).json({ summary });
}
