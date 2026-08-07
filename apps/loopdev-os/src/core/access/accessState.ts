import type { OrganizationMembershipStatus } from '@loopdev/contracts';

export type AccessState = 'loading' | 'session-expired' | 'no-organization-access' | 'membership-pending' | 'authorized';

export function resolveAccessState({
  isAuthLoading,
  hasSession,
  membershipStatuses,
}: {
  isAuthLoading: boolean;
  hasSession: boolean;
  membershipStatuses: readonly OrganizationMembershipStatus[];
}): AccessState {
  if (isAuthLoading) return 'loading';
  if (!hasSession) return 'session-expired';
  if (membershipStatuses.includes('active')) return 'authorized';
  if (membershipStatuses.includes('pending')) return 'membership-pending';
  return 'no-organization-access';
}

export function canAccessOrganizationRoute(state: AccessState): boolean {
  return state === 'authorized';
}

export function canAccessSuiteRoute({
  accessState,
  hasPermission,
  isSuiteEnabled,
}: {
  accessState: AccessState;
  hasPermission: boolean;
  isSuiteEnabled: boolean;
}): boolean {
  return accessState === 'authorized' && hasPermission && isSuiteEnabled;
}
