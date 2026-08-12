'use client';

import { useQuery } from '@tanstack/react-query';
import type { MarketingCampaign } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';
import { useWorkspace } from '@/hooks/useWorkspace';

export function useMarketingCampaigns() {
  const { activeOrganizationId } = useOrganization();
  const { workspaces } = useWorkspace();
  const marketingWorkspace = workspaces.find((workspace) => workspace.suiteKey === 'marketing');
  const workspaceId = marketingWorkspace?.id ?? null;

  return useQuery<MarketingCampaign[]>({
    queryKey: ['marketing-campaigns', activeOrganizationId, workspaceId],
    enabled: !!activeOrganizationId && !!workspaceId,
    queryFn: async () => {
      const params = new URLSearchParams({
        organizationId: activeOrganizationId!,
        workspaceId: workspaceId!,
      });
      const response = await fetch(`/api/marketing/campaigns?${params.toString()}`);
      if (!response.ok) throw new Error('Unable to load marketing campaigns');
      return response.json() as Promise<MarketingCampaign[]>;
    },
    staleTime: 30_000,
  });
}
