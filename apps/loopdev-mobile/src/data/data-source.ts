import type { PlatformHomeDataSource } from '@loopdev/contracts';
import { fixturesHomeDataSource } from './adapters/fixtures/home';
import { supabaseHomeDataSource } from './adapters/supabase/home';
import { resolveDataEnvironment } from './environment';

export function createHomeDataSource(environment = process.env.EXPO_PUBLIC_DATA_ENV): PlatformHomeDataSource {
  const selectedEnvironment = resolveDataEnvironment(environment);

  if (selectedEnvironment === 'fixtures') return fixturesHomeDataSource;
  if (selectedEnvironment === 'supabase') return supabaseHomeDataSource;
  throw new Error(`Mobile data adapter not implemented: ${selectedEnvironment}`);
}