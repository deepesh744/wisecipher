import mammoth from "mammoth";
import { Buffer } from "buffer";

/**
 * Extract raw text from a DOCX file using Mammoth.
 * Accepts either a Node.js Buffer or an ArrayBuffer.
 */
export async function extractTextFromDocx(
  input: Buffer | ArrayBuffer
): Promise<string> {
  let arrayBuffer: ArrayBuffer;

  if (Buffer.isBuffer(input)) {
    // Convert Node.js Buffer to a pure ArrayBuffer slice for Mammoth
    const buf = input as Buffer;
    const fullArrayBuffer = buf.buffer as ArrayBuffer;
    arrayBuffer = fullArrayBuffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength
    );
  } else {
    // Already an ArrayBuffer, use directly
    arrayBuffer = input;
  }

  // Let Mammoth extract the raw text
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}
