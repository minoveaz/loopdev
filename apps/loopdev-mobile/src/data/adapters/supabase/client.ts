import { createClient } from '@supabase/supabase-js';

export function createSupabaseMobileClient() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase mobile environment is not configured');
  return createClient(url, anonKey);
}