import Navbar from './Navbar';
import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full py-6 px-2">{children}</main>
      </div>
      <Head>
        <title>WiseCipher — AI Jargon Decoder</title>
        <meta
          name="description"
          content="WiseCipher instantly decodes legal, financial, medical & technical documents into plain-English summaries, highlights risks, obligations, and deadlines."
        />
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:title" content="WiseCipher — AI Jargon Decoder" />
        <meta property="og:description" content="Instantly turn complex documents into actionable insights." />
      </Head>

      <header className="fixed top-0 w-full bg-white shadow-md z-20">
        <div className="container mx-auto flex items-center justify-between p-6">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <img src="/logo.svg" alt="WiseCipher logo" className="h-8 w-8" />
              <span className="font-bold text-xl">WiseCipher</span>
            </a>
          </Link>
          <nav className="space-x-6">
            <Link href="#how-it-works"><a className="hover:text-blue-600">How It Works</a></Link>
            <Link href="#pricing"><a className="hover:text-blue-600">Pricing</a></Link>
            <a href="#early-access" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Request Early Access
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-24">{children}</main>
    </>
  );
}
