import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Strictly use the free tier; all config in env variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true }
});
