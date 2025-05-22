// pages/auth/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function AuthCallback() {
    const router = useRouter();
  
    useEffect(() => {
      // Check if there's an active session after redirect
      supabase.auth.getSession()
        .then(({ data: { session }, error }) => {
          if (error) {
            console.error('Auth callback error:', error.message);
            router.replace('/login');
          } else if (session) {
            router.replace('/dashboard');
          } else {
            router.replace('/login');
          }
        });
    }, [router]);
  
    return <LoadingSpinner />;
  }
