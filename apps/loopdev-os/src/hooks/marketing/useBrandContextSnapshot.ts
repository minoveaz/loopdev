'use client';

import { useQuery } from '@tanstack/react-query';
import type { BrandContextSnapshot } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';

export function useBrandContextSnapshot(brandId: string | null) {
  const { activeOrganizationId } = useOrganization();

  return useQuery<BrandContextSnapshot | null>({
    queryKey: ['brand-context-snapshot', activeOrganizationId, brandId],
    enabled: Boolean(activeOrganizationId && brandId),
    queryFn: async () => {
      const params = new URLSearchParams({
        organizationId: activeOrganizationId!,
      });
      const response = await fetch(`/api/marketing/brands/${brandId}/context?${params.toString()}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Unable to load brand context snapshot');
      return response.json() as Promise<BrandContextSnapshot>;
    },
    staleTime: 30_000,
  });
}
