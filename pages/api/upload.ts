import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable-serverless';
import { supabase } from '../../lib/supabase';
import { generateKey, encryptText } from '../../lib/encryption';
import { extractTextFromDocx } from '../../lib/textExtractors';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import fs from 'fs';

// Disable Next.js bodyParser for file uploads
export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) return res.status(400).json({ error: 'No file uploaded' });

    const file = files.file as formidable.File;
    const buffer = fs.readFileSync(file.filepath);
    let text = '';
    if (file.mimetype === 'application/pdf') {
      // PDF parsing
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const txt = await page.getTextContent();
        text += txt.items.map((item: any) => item.str).join(' ');
      }
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await extractTextFromDocx(buffer);
    } else if (file.mimetype === 'text/plain') {
      text = buffer.toString();
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Generate a random AES key for this file
    const key = generateKey();
    const encryptedText = encryptText(text, key);

    // Save encrypted text + key (encrypted) to Supabase (never store plain text)
    // Store user_id via session/JWT from Supabase, in prod use JWT
    const user_id = fields.user_id || "demo-user"; // replace with real auth!
    const { data, error } = await supabase
      .from('documents')
      .insert([{ user_id, filename: file.originalFilename, enc_content: encryptedText, enc_key: key }]);
    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ ok: true });
  });
}
