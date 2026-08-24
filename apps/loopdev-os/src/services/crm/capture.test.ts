import { describe, expect, it } from 'vitest';
import { isLeadAssigneeRoleAllowed, normalizeProductKey } from './leads';

describe('CRM lead conversion product key normalization', () => {
  it('normalizes free-text interest/product values into a stable key', () => {
    expect(normalizeProductKey('  Seguro de Salud  ')).toBe('seguro-de-salud');
    expect(normalizeProductKey('Home')).toBe('home');
  });

  it('treats equivalent free-text values as the same conversion key', () => {
    expect(normalizeProductKey('seguro salud')).toBe(normalizeProductKey('  Seguro   Salud'));
  });
});

describe('CRM lead assignment authorization', () => {
  it('allows only active operational members', () => {
    expect(isLeadAssigneeRoleAllowed('agent', 'active')).toBe(true);
    expect(isLeadAssigneeRoleAllowed('admin', 'active')).toBe(true);
    expect(isLeadAssigneeRoleAllowed('viewer', 'active')).toBe(false);
    expect(isLeadAssigneeRoleAllowed('agent', 'suspended')).toBe(false);
  });

  it('does not treat a missing member role as an allowed assignment', () => {
    expect(isLeadAssigneeRoleAllowed(undefined, 'active')).toBe(false);
  });
});
