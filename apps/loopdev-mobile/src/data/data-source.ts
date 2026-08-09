import type { HomeDataSource } from './contracts/home';
import { fixturesHomeDataSource } from './adapters/fixtures/home';
import { supabaseHomeDataSource } from './adapters/supabase/home';
import { resolveDataEnvironment } from './environment';

export function createHomeDataSource(environment = process.env.EXPO_PUBLIC_DATA_ENV): HomeDataSource {
  const selectedEnvironment = resolveDataEnvironment(environment);

  if (selectedEnvironment === 'fixtures') return fixturesHomeDataSource;
  if (selectedEnvironment === 'supabase') return supabaseHomeDataSource;
  throw new Error(`Mobile data adapter not implemented: ${selectedEnvironment}`);
}