import mammoth from "mammoth";
// For PDF, will use pdfjs-dist, loaded in /api/parse

export async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}
