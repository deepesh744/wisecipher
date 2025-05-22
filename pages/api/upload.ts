import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { Fields, File as FormidableFile, Files } from 'formidable'
import { supabase } from '../../lib/supabase'
import { generateKey, encryptText } from '../../lib/encryption'
import { extractTextFromDocx } from '../../lib/textExtractors'
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import fs from 'fs'

// Tell Next.js not to parse the body (we’ll do it with formidable)
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Create a new IncomingForm instance
  const form = new formidable.IncomingForm()

  // Parse the incoming request
  form.parse(
    req,
    async (
      err: Error | null,
      fields: Fields,
      files: Files
    ) => {
      if (err || !files.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      // typescript knows files.file is FormidableFile | FormidableFile[]
      const fileList = Array.isArray(files.file) ? files.file : [files.file]
      const file = fileList[0] as FormidableFile

      // Read the raw buffer
      const buffer = fs.readFileSync(file.filepath)
      let text = ''

      if (file.mimetype === 'application/pdf') {
        // PDF parsing
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const txt = await page.getTextContent()
          text += txt.items.map((item: any) => item.str).join(' ')
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

      // Encrypt & store
      const key = generateKey()
      const encryptedText = encryptText(text, key)
      const rawUser = fields.user_id;
      const user_id =
        typeof rawUser === 'string'
        ? rawUser
        : Array.isArray(rawUser) && rawUser.length > 0
          ? rawUser[0]
          : 'demo-user';

      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            user_id,
            filename: file.originalFilename,
            enc_content: encryptedText,
            enc_key: key,
          },
        ])
      if (dbError) return res.status(500).json({ error: dbError.message })

      res.status(200).json({ ok: true })
    }
  )
}
