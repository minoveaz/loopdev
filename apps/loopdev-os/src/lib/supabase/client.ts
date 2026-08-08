'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export const multiTabAuth = {
  lock: <Result,>(_name: string, _acquireTimeout: number, callback: () => Promise<Result>) => callback(),
};

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: multiTabAuth },
  );
}
