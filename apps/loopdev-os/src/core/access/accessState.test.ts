import { describe, expect, it } from 'vitest';
import { canAccessOrganizationRoute, canAccessSuiteRoute, resolveAccessState } from './accessState';

describe('organization access routing', () => {
  it.each([
    [{ isAuthLoading: true, hasSession: false, membershipStatuses: [] }, 'loading'],
    [{ isAuthLoading: false, hasSession: false, membershipStatuses: [] }, 'session-expired'],
    [{ isAuthLoading: false, hasSession: true, membershipStatuses: [] }, 'no-organization-access'],
    [{ isAuthLoading: false, hasSession: true, membershipStatuses: ['pending'] }, 'membership-pending'],
    [{ isAuthLoading: false, hasSession: true, membershipStatuses: ['pending', 'active'] }, 'authorized'],
    [{ isAuthLoading: false, hasSession: true, isPlatformAdministrator: true, membershipStatuses: [] }, 'authorized'],
    [{ isAuthLoading: false, hasSession: true, membershipStatuses: ['suspended', 'revoked'] }, 'no-organization-access'],
  ] as const)('resolves %o as %s', (input, expected) => {
    expect(resolveAccessState(input)).toBe(expected);
  });

  it('only permits organization routes for active memberships', () => {
    expect(canAccessOrganizationRoute('authorized')).toBe(true);
    expect(canAccessOrganizationRoute('membership-pending')).toBe(false);
    expect(canAccessOrganizationRoute('no-organization-access')).toBe(false);
    expect(canAccessOrganizationRoute('session-expired')).toBe(false);
  });

  it('denies a suite route when either its permission or workspace is unavailable', () => {
    expect(canAccessSuiteRoute({ accessState: 'authorized', hasPermission: true, isSuiteEnabled: true })).toBe(true);
    expect(canAccessSuiteRoute({ accessState: 'authorized', hasPermission: false, isSuiteEnabled: true })).toBe(false);
    expect(canAccessSuiteRoute({ accessState: 'authorized', hasPermission: true, isSuiteEnabled: false })).toBe(false);
    expect(canAccessSuiteRoute({ accessState: 'membership-pending', hasPermission: true, isSuiteEnabled: true })).toBe(false);
  });
});
