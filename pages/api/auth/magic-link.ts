import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  //const { error } = await supabase.auth.signInWithOtp({ email });
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo }
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ ok: true });
}
