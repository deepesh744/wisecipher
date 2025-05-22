// components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Load current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Subscribe to login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    void router.push('/');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <Link href="/">
        <span className="text-xl font-bold">WiseCipher</span>
      </Link>
      <div>
        {user ? (
          <>
            <Link href="/dashboard" className="mr-4 hover:underline">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
