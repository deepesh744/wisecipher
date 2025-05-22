// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Extract auth tokens or error from the URL query
    const {
      access_token,
      refresh_token,
      error_description,
    } = router.query as {
      access_token?: string;
      refresh_token?: string;
      error_description?: string;
    };

    if (error_description) {
      console.error('Auth error:', error_description);
      void router.replace('/login');
      return;
    }

    if (access_token && refresh_token) {
      // Set the session manually using the v2 SDK
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then((result) => {
          if (result.error) {
            console.error('Session error:', result.error.message);
            void router.replace('/login');
          } else {
            void router.replace('/dashboard');
          }
        })
        .catch((e: Error) => {
          console.error('Session exception:', e.message);
          void router.replace('/login');
        });
    } else {
      // No tokens found; redirect to login
      void router.replace('/login');
    }
  }, [router]);

  return <LoadingSpinner />;
}
