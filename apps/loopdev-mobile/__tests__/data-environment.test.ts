import { createHomeDataSource } from '../src/data/data-source';
import { resolveDataEnvironment } from '../src/data/environment';

describe('mobile data environment', () => {
  it('defaults to fixtures for local development', () => {
    expect(resolveDataEnvironment(undefined)).toBe('fixtures');
    expect(createHomeDataSource()).toBeDefined();
  });

  it('maps deployment names to explicit adapters', () => {
    expect(resolveDataEnvironment('development')).toBe('supabase');
    expect(resolveDataEnvironment('production')).toBe('render-api');
  });

  it('rejects unknown environments', () => {
    expect(() => resolveDataEnvironment('random')).toThrow('Unsupported mobile data environment');
  });

  it('selects the Supabase adapter for development', () => {
    expect(createHomeDataSource('development')).toBeDefined();
  });
});