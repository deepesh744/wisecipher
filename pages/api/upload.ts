// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { IncomingForm, Fields,File as FormidableFile,Files} from 'formidable'
import fs from 'fs'
import { supabase } from '../../lib/supabase'
import { generateKey, encryptText } from '../../lib/encryption'
import { extractTextFromDocx } from '../../lib/textExtractors'
import pdfParse from 'pdf-parse'
import { createWorker } from "tesseract.js";

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔔 /api/upload called')
  if (req.method !== 'POST') return res.status(405).end()

  // 1) Grab & verify the JWT
  const authHeader = req.headers.authorization || ''
  console.log('Authorization header:', authHeader)
  const token = authHeader.replace(/^Bearer\s*/, '')
  if (!token) {
    console.error('❌ Missing auth token')
    return res.status(401).json({ error: 'Missing auth token' })
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token)
  console.log('Auth getUser:', { user, userError })
  if (userError || !user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // 2) Create the service-role client
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('Service-role key present?', !!SERVICE_KEY)
  if (!SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SERVICE_KEY
  )

  // 3) Parse the multipart form
  const form = new IncomingForm();
  let files: Files
  try {
    ;({ files } = await new Promise<{ files: Files }>((resolve, reject) => {
      form.parse(req, (err, _fields, files) => (err ? reject(err) : resolve({ files })))
    }))
  } catch (err: any) {
    console.error('❌ Form parse error', err)
    return res.status(400).json({ error: 'Invalid form data' })
  }

  const file = Array.isArray(files.file) ? files.file[0] : files.file
  if (!file) {
    console.error('❌ No file in form')
    return res.status(400).json({ error: 'No file uploaded' })
  }
  console.log('📄 Received file:', file.originalFilename, file.mimetype)

  // 4) Extract text
  const buffer = fs.readFileSync(file.filepath)
  let text = ''

  if (file.mimetype === 'application/pdf') {
    // 1) Try fast text‐layer extraction
    try {
      const data = await pdfParse(buffer)
      text = data.text.trim()
      console.log('📝 PDF-layer text length:', text.length)
    } catch (e: any) {
      console.warn('⚠️ PDF parse error, will attempt OCR', e)
      text = ''
      // return res.status(500).json({ error: 'Failed to parse PDF' })
    }

    // 2) If that text is too short, fall back to OCR
    if (text.length < 200) {
      console.log('⚙️ Falling back to OCR with Tesseract.js');
    
      // cast to `any` so TS stops complaining
      const worker: any = await createWorker();
    
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
    
      const { data: { text: ocrText } } = await worker.recognize(buffer);
      text = ocrText.trim();
      console.log('📝 OCR text length:', text.length);
    
      await worker.terminate();
    }
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await extractTextFromDocx(buffer)
  } else if (file.mimetype === 'text/plain') {
    text = buffer.toString()
    console.log('📝 TXT text length:', text.length)
  } else {
    console.error('❌ Unsupported file type:', file.mimetype)
    return res.status(400).json({ error: 'Unsupported file type' })
  }

  // If still no text, bail out early
  if (!text || text.length < 50) {
    console.error('❌ No usable text extracted')
    return res.status(400).json({
      error:
        'Could not extract text from this document. Please upload a text-based PDF, DOCX, or a higher-quality scan.',
    })
  }

  console.log('📝 Extracted text length:', text.length)

  // 5) Encrypt
  const key = generateKey()
  const encryptedText = encryptText(text, key)

  // 6) Insert via admin client
  const { data: inserted, error: dbError } = await supabaseAdmin
    .from('documents')
    .insert([
      {
        user_id: user.id,
        filename: file.originalFilename,
        enc_content: encryptedText,
        enc_key: key,
      },
    ])
    .select() // return the inserted row(s)

  console.log('DB insert result:', { inserted, dbError })
  if (dbError) {
    return res.status(500).json({ error: dbError.message })
  }

  // 7) Success!
  return res.status(200).json({ ok: true, document: inserted![0] })
}
