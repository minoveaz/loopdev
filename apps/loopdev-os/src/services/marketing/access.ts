import { MarketingAccessGrantSchema } from '@loopdev/contracts';
import type { MarketingAccessGrant, MarketingPermission } from '@loopdev/contracts';

export type MarketingAccessRequest = {
  userId: string;
  organizationId: string;
  workspaceId?: string | null;
  brandId?: string | null;
  permission: MarketingPermission;
  now?: Date;
};

function grantCoversRequest(grant: MarketingAccessGrant, request: MarketingAccessRequest) {
  const workspaceMatches = grant.workspaceId == null || grant.workspaceId === request.workspaceId;
  const brandMatches = grant.brandId == null || grant.brandId === request.brandId;

  return grant.userId === request.userId
    && grant.organizationId === request.organizationId
    && grant.permission === request.permission
    && workspaceMatches
    && brandMatches;
}

export function hasMarketingAccess(grants: MarketingAccessGrant[], request: MarketingAccessRequest): boolean {
  const now = request.now ?? new Date();

  return grants.some((candidate) => {
    const grant = MarketingAccessGrantSchema.parse(candidate);
    const isActive = grant.expiresAt == null || new Date(grant.expiresAt) > now;
    return isActive && grantCoversRequest(grant, request);
  });
}