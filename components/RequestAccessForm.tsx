import { useState } from "react";

export default function RequestAccessForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In MVP, just print to console, add Plausible event, or send to Supabase 'access_requests' table
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto py-10">
      <label className="block mb-2 text-lg">Request Early Access</label>
      <input
        type="email"
        className="w-full border rounded px-4 py-2 mb-4"
        placeholder="you@email.com"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Request Access
      </button>
      {sent && <p className="mt-2 text-green-600">Thank you! We'll notify you soon.</p>}
    </form>
  );
}
