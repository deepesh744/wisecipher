import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = req.body;
  // Enforce user check in production, only allow delete of their own doc
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ ok: true });
}
