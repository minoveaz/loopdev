import { describe, expect, it } from 'vitest';
import { hasMarketingAccess } from './access';
import type { MarketingAccessGrant } from '@loopdev/contracts';

const ids = {
  userId: '00000000-0000-4000-9000-000000000001',
  organizationId: '00000000-0000-4000-9000-000000000002',
  brandId: '00000000-0000-4000-9000-000000000003',
  workspaceId: '00000000-0000-4000-9000-000000000004',
  otherBrandId: '00000000-0000-4000-9000-000000000005',
  otherWorkspaceId: '00000000-0000-4000-9000-000000000006',
};
const timestamp = '2026-08-10T00:00:00.000Z';

function grant(overrides: Partial<MarketingAccessGrant> = {}): MarketingAccessGrant {
  return {
    userId: ids.userId,
    organizationId: ids.organizationId,
    permission: 'read',
    grantedBy: ids.userId,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

describe('Marketing access resolver', () => {
  const now = new Date(timestamp);

  it('allows organization-wide and brand-specific access', () => {
    expect(hasMarketingAccess([grant()], { ...ids, permission: 'read', now })).toBe(true);
    expect(hasMarketingAccess([grant({ brandId: ids.brandId })], { ...ids, permission: 'read', now })).toBe(true);
    expect(hasMarketingAccess([grant({ brandId: ids.brandId })], { ...ids, brandId: ids.otherBrandId, permission: 'read', now })).toBe(false);
  });

  it('allows workspace-specific access and rejects another workspace', () => {
    expect(hasMarketingAccess([grant({ workspaceId: ids.workspaceId })], { ...ids, permission: 'read', now })).toBe(true);
    expect(hasMarketingAccess([grant({ workspaceId: ids.workspaceId })], { ...ids, workspaceId: ids.otherWorkspaceId, permission: 'read', now })).toBe(false);
  });

  it('requires the matching user, organization and permission', () => {
    expect(hasMarketingAccess([grant()], { ...ids, permission: 'edit', now })).toBe(false);
    expect(hasMarketingAccess([grant()], { ...ids, userId: ids.otherBrandId, permission: 'read', now })).toBe(false);
    expect(hasMarketingAccess([grant()], { ...ids, organizationId: ids.otherBrandId, permission: 'read', now })).toBe(false);
  });

  it('does not accept expired grants', () => {
    expect(hasMarketingAccess([grant({ expiresAt: '2026-08-09T23:59:59.000Z' })], { ...ids, permission: 'read', now })).toBe(false);
  });
});