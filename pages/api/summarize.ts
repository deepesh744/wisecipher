import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { decryptText, encryptText } from '../../lib/encryption';
import { getOpenAISummary } from '../../lib/openai';
import { SUMMARY_PROMPT } from '../../utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { docId } = req.body;
  const { data, error } = await supabase.from('documents').select('*').eq('id', docId).single();
  if (error || !data) return res.status(404).json({ error: "Document not found" });

  // Decrypt text with stored key
  const text = decryptText(data.enc_content, data.enc_key);
  const openaiRes = await getOpenAISummary(SUMMARY_PROMPT, text);
  const summary = openaiRes.choices?.[0]?.message?.content || 'No summary';

  // Encrypt summary before storing
  const enc_summary = encryptText(summary, data.enc_key);
  await supabase.from('documents').update({ enc_summary }).eq('id', docId);

  res.status(200).json({ summary });
}
