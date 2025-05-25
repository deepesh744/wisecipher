import Navbar from './Navbar';
import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full py-6 px-2">{children}</main>
      </div>
  );
}
