// lib/textExtractors.ts
import mammoth from "mammoth";
import { Buffer } from "buffer";

/**
 * Extract raw text from a DOCX buffer using Mammoth.
 * Uses the `buffer` option in Node.js for easier parsing.
 */
export async function extractTextFromDocx(
  input: Buffer | ArrayBuffer
): Promise<string> {
  // In Node, mammoth.extractRawText expects a Buffer
  let nodeBuffer: Buffer;

  if (Buffer.isBuffer(input)) {
    nodeBuffer = input as Buffer;
  } else {
    // Convert ArrayBuffer to Buffer if ever used in-browser
    nodeBuffer = Buffer.from(input as ArrayBuffer);
  }

  // Directly pass the Node.js Buffer to Mammoth
  const { value } = await mammoth.extractRawText({ buffer: nodeBuffer });
  return value;
}
