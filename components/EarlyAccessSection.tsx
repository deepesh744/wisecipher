// components/EarlyAccessSection.tsx
import { useState } from 'react'

export default function EarlyAccessSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    const res = await fetch('/api/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  return (
    <section id="early-access" className="py-16 bg-gray-100">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Waitlist</h2>
        <p className="mb-6 text-gray-700">
          Be first in line for full-stack AI decoding, semantic search, question-answering
          and actionable workflows. We’ll ping you the instant your enterprise sandbox is ready.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={status==='sending'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            {status==='sending' ? 'Joining…' : status==='success' ? 'You’re in!' : 'Join Waitlist'}
          </button>
        </form>
        {status==='error' && (
          <p className="mt-4 text-red-600">Oops, something went wrong. Try again?</p>
        )}
      </div>
    </section>
  )
}
