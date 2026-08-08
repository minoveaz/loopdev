import { createBrowserClient } from '@supabase/ssr';
import { multiTabAuth } from './supabase/client';
import type { Database } from '@/types/database.types';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: multiTabAuth },
);
