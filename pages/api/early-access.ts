// pages/api/early-access.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body as { email?: string }
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid email.' })
  }

  const { error } = await supabaseAdmin
    .from('access_requests')
    .insert({ email })

  if (error) {
    console.error('Waitlist insert error:', error)
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json({ ok: true })
}
