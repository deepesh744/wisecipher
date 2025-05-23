// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'
import { supabase } from '../../lib/supabase'         // your public client
import { generateKey, encryptText } from '../../lib/encryption'
import { extractTextFromDocx } from '../../lib/textExtractors'
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // 1) Grab & verify the JWT
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace(/^Bearer\s*/, '')
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' })
  }
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // 2) Spin up a server-side (service-role) client
  //    (make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local / Vercel)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 3) Parse the multipart/form-data using a promise
  const form = new formidable.IncomingForm()
  const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) return reject(err)
      resolve({ files })
    })
  })

  const file = Array.isArray(files.file) ? files.file[0] : files.file
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  // 4) Read & extract plaintext
  const buffer = fs.readFileSync(file.filepath)
  let text = ''
  if (file.mimetype === 'application/pdf') {
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((i: any) => i.str).join(' ')
    }
  } else if (
    file.mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    text = await extractTextFromDocx(buffer)
  } else if (file.mimetype === 'text/plain') {
    text = buffer.toString()
  } else {
    return res.status(400).json({ error: 'Unsupported file type' })
  }

  // 5) Encrypt the text
  const key = generateKey()
  const encryptedText = encryptText(text, key)

  // 6) Insert with the admin client
  const { error: dbError } = await supabaseAdmin
    .from('documents')
    .insert([
      {
        user_id: user.id,
        filename: file.originalFilename,
        enc_content: encryptedText,
        enc_key: key,
      },
    ])

  if (dbError) {
    return res.status(500).json({ error: dbError.message })
  }

  return res.status(200).json({ ok: true })
}
