import { describe, expect, it } from 'vitest';
import { maskApiKey } from './exchangeVault';

describe('Quant exchange vault service', () => {
  it('never returns a full API key to a caller', () => {
    expect(maskApiKey('abcdefghijklmnop')).toBe('abcd...mnop');
    expect(maskApiKey('short')).toBe('Configured');
  });
});
