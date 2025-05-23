// types/pdfjs-legacy.d.ts
declare module 'pdfjs-dist/legacy/build/pdf' {
  /**  
   * Returns a PDFDocumentProxy; you’ll still get full runtime behavior  
   * but TS won’t type‐check inside it.  
   */
  export function getDocument(src: any): any;
}
