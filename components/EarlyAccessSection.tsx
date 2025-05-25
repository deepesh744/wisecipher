// components/EarlyAccessSection.tsx
import { useState } from 'react'

export default function EarlyAccessSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to join waitlist')
      }
      setStatus('success')
      setEmail('')
    } catch (err: any) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <section id="early-access" className="py-16 bg-white">
      <div className="max-w-lg mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Early Access Waitlist</h2>
        <p className="text-gray-600 mb-6">
          Enter your email below and we’ll let you know as soon as WiseCipher goes live.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            className="flex-1 px-4 py-2 border rounded"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading'
              ? 'Joining…'
              : status === 'success'
              ? '🎉 Joined!'
              : 'Join Waitlist'}
          </button>
        </form>
        {status === 'error' && (
          <p className="mt-3 text-red-600">{errorMsg}</p>
        )}
        {status === 'success' && (
          <p className="mt-3 text-green-600">
            Thanks! You’re on the list. We’ll be in touch soon.
          </p>
        )}
      </div>
    </section>
  )
}
