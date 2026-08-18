import { describe, expect, it } from 'vitest';
import { normalizeProductKey } from './leads';

describe('CRM lead conversion product key normalization', () => {
  it('normalizes free-text interest/product values into a stable key', () => {
    expect(normalizeProductKey('  Seguro de Salud  ')).toBe('seguro-de-salud');
    expect(normalizeProductKey('Home')).toBe('home');
  });

  it('treats equivalent free-text values as the same conversion key', () => {
    expect(normalizeProductKey('seguro salud')).toBe(normalizeProductKey('  Seguro   Salud'));
  });
});
