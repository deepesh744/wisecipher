// types/pdfjs-legacy.d.ts
declare module 'pdfjs-dist/legacy/build/pdf' {
  export function getDocument(src: any): any;
  export namespace GlobalWorkerOptions {
    let disableWorker: boolean;
  }
}
