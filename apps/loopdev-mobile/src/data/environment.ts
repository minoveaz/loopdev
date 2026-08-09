export type DataEnvironment = 'fixtures' | 'supabase' | 'render-api';

export function resolveDataEnvironment(value: string | undefined): DataEnvironment {
  if (!value || value === 'local' || value === 'fixtures') return 'fixtures';
  if (value === 'development' || value === 'supabase') return 'supabase';
  if (value === 'staging' || value === 'production' || value === 'render-api') return 'render-api';
  throw new Error(`Unsupported mobile data environment: ${value}`);
}