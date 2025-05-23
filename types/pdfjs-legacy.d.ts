// types/pdf-parse.d.ts
// Provide a minimal declaration so TypeScript accepts pdf-parse

interface PdfParseData {
  text: string;
  info?: any;
  metadata?: any;
  version?: any;
  numpages?: number;
  numrender?: number;
}

declare module 'pdf-parse' {
  import { Buffer } from 'buffer';
  /**
   * Parse a PDF `Buffer` and return its extracted text and info.
   */
  function pdfParse(data: Buffer | Uint8Array): Promise<PdfParseData>;
  export default pdfParse;
}