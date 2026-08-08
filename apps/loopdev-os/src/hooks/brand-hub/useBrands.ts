'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BrandItem } from '@loopdev/ui';
import type { BrandStatus } from '@loopdev/contracts';
import { useOrganization } from '@/hooks/useOrganization';

/**
 * @hook useBrands
 * @description Recupera el listado maestro de marcas.
 */
export const useBrands = () => {
  const { activeOrganizationId } = useOrganization();

  return useQuery({
    queryKey: ['brands', activeOrganizationId],
    queryFn: async () => {
      if (!activeOrganizationId) return [] as BrandItem[];

      const { data, error } = await supabase
        .from('brands')
        .select('id, name, status, updated_at')
        .eq('organization_id', activeOrganizationId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map(b => ({
        id: b.id,
        name: b.name,
        status: b.status as BrandStatus,
        updatedAt: new Date(b.updated_at).toLocaleDateString()
      })) as BrandItem[];
    },
    enabled: !!activeOrganizationId,
    staleTime: 60_000
  });
};
