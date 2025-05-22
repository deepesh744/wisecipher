import { useState } from "react";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "./LoadingSpinner";

export default function LoginMagicLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setSent(true);
    setLoading(false);
  };

  return (
    <form className="max-w-md mx-auto my-12" onSubmit={handleSend}>
      <label className="block mb-2 text-lg">Email Magic Link Login</label>
      <input
        type="email"
        className="w-full border rounded px-4 py-2 mb-4"
        placeholder="you@email.com"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? <LoadingSpinner /> : "Send Magic Link"}
      </button>
      {sent && <p className="mt-2 text-green-600">Check your email for a login link.</p>}
    </form>
  );
}
