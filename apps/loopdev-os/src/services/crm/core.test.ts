import { describe, expect, it } from 'vitest';
import { normalizeEmail, normalizePhone } from './core';

describe('CRM core normalization', () => {
  it('normalizes email for organization-scoped deduplication', () => {
    expect(normalizeEmail('  ANA@Example.COM ')).toBe('ana@example.com');
    expect(normalizeEmail('')).toBeNull();
  });

  it('normalizes common phone formatting without guessing a country code', () => {
    expect(normalizePhone(' +34 (600) 123-456 ')).toBe('+34600123456');
    expect(normalizePhone('')).toBeNull();
  });
});
