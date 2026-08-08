'use client';

import { createBrowserClient } from '@supabase/ssr';

export const multiTabAuth = {
  lock: <Result,>(_name: string, _acquireTimeout: number, callback: () => Promise<Result>) => callback(),
};

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: multiTabAuth },
  );
}