import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { decryptText } from '../../lib/encryption';
import { QA_PROMPT } from '../../utils/constants';

export const config = { api: { bodyParser: false } };

// OpenAI streaming
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { docId, question } = JSON.parse(req.body);
  const { data, error } = await supabase.from('documents').select('*').eq('id', docId).single();
  if (error || !data) return res.status(404).json({ error: "Document not found" });

  const text = decryptText(data.enc_content, data.enc_key);

  // Streaming API using OpenAI (manually for MVP)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: QA_PROMPT + "\n\n" + text },
        { role: "user", content: question }
      ],
      stream: true,
    }),
  });

  // Stream response chunks to client
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
  }
  res.end();
}
