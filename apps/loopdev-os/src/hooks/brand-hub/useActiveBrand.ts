'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useOrganization } from '@/hooks/useOrganization';

/**
 * @hook useActiveBrand
 * @description Recupera los detalles de una marca específica.
 */
export const useActiveBrand = (brandId: string | null) => {
  const { activeOrganizationId } = useOrganization();

  return useQuery({
    queryKey: ['brand', activeOrganizationId, brandId],
    queryFn: async () => {
      if (!activeOrganizationId || !brandId) return null;

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('organization_id', activeOrganizationId)
        .eq('id', brandId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!activeOrganizationId && !!brandId,
  });
};
