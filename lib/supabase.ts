// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser‐safe client — allow Supabase to parse the hash on redirect
export const supabase = createClient(URL, ANON, {
  auth: {
    persistSession: true,
    // detectSessionInUrl: false <-- remove/omit this so it stays true by default
  }
});
