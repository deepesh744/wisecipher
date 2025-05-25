// components/Layout.tsx
import Navbar from './Navbar'
import Head from 'next/head'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>WiseCipher — AI Jargon Decoder</title>
        <meta
          name="description"
          content="WiseCipher instantly decodes legal, financial, medical & technical documents into plain-English summaries, highlights risks, obligations, and deadlines."
        />
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:title" content="WiseCipher — AI Jargon Decoder" />
        <meta
          property="og:description"
          content="Instantly turn complex documents into actionable insights."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        {/* 
          Now main is full-width, with horizontal padding:
          - `px-4` on mobile
          - `md:px-8 lg:px-16` on medium+/large 
        */}
        <main className="flex-1 w-full px-4 md:px-8 lg:px-16 py-6">
          {children}
        </main>
      </div>
    </>
  )
}
