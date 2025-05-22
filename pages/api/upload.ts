import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { Fields, File as FormidableFile, Files } from 'formidable'
import { supabase } from '../../lib/supabase'
import { generateKey, encryptText } from '../../lib/encryption'
import { extractTextFromDocx } from '../../lib/textExtractors'
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import fs from 'fs'

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // STEP A: Verify the user is logged in, get user.id from session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // STEP B: Parse the incoming multipart form
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, _fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const buffer = fs.readFileSync(file.filepath);
    let text = '';

    // STEP C: Extract plaintext
    if (file.mimetype === 'application/pdf') {
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const txt = await page.getTextContent();
        text += txt.items.map((i: any) => i.str).join(' ');
      }
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractTextFromDocx(buffer);
    } else if (file.mimetype === 'text/plain') {
      text = buffer.toString();
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // STEP D: Encrypt & persist
    const key = generateKey();
    const encryptedText = encryptText(text, key);

    const { error: dbError } = await supabase
      .from('documents')
      .insert([
        {
          user_id: user.id,            // <-- use the authenticated user's ID
          filename: file.originalFilename,
          enc_content: encryptedText,
          enc_key: key,
        },
      ]);

    if (dbError) {
      return res.status(500).json({ error: dbError.message });
    }

    res.status(200).json({ ok: true });
  });
}