import type * as PDFJS from 'pdfjs-dist';
declare module 'pdfjs-dist/legacy/build/pdf' {
  // Export the same shape as the main package
  const PDFJSNamespace: typeof PDFJS;
  export = PDFJSNamespace;
}