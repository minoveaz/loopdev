import { createBrowserClient } from '@supabase/ssr';
import { multiTabAuth } from './supabase/client';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: multiTabAuth },
);
