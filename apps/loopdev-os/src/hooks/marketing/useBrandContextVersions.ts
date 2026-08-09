'use client';

import { useQuery } from '@tanstack/react-query';
import type { BrandContextVersion } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';

export function useBrandContextVersions(brandId: string | null) {
  const { activeOrganizationId } = useOrganization();
  return useQuery<BrandContextVersion[]>({
    queryKey: ['brand-context-versions', activeOrganizationId, brandId],
    enabled: Boolean(activeOrganizationId && brandId),
    queryFn: async () => {
      const response = await fetch(`/api/marketing/brands/${brandId}/versions?organizationId=${activeOrganizationId}`);
      if (!response.ok) throw new Error('Unable to load brand context versions');
      return response.json() as Promise<BrandContextVersion[]>;
    },
  });
}
