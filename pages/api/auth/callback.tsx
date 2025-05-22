import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { access_token, refresh_token, error_description } = router.query;

    if (error_description) {
      console.error('Auth error:', error_description);
      void router.replace('/login');
      return;
    }

    if (access_token && refresh_token) {
      // Finalize the Supabase session
      void supabase.auth
        .setSession({
          access_token: String(access_token),
          refresh_token: String(refresh_token),
        })
        .then(({ error }) => {
          if (error) {
            console.error('Session error:', error.message);
            void router.replace('/login');
          } else {
            void router.replace('/dashboard');
          }
        });
    } else {
      // No tokens → send to login
      void router.replace('/login');
    }
  }, [router]);

  return <LoadingSpinner />;
}
