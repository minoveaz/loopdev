'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Asset } from '@loopdev/ui';

/**
 * @hook useAssets
 * @description Industrial hook for fetching certified trading assets from Supabase.
 * Supports filtering by exchange provider.
 */
export const useAssets = (provider?: string) => {
  return useQuery({
    queryKey: ['trading', 'assets', provider],
    queryFn: async () => {
      let query = supabase
        .from('quant_assets')
        .select('*')
        .eq('is_active', true);

      if (provider) {
        // Filter assets that support the selected provider
        query = query.contains('providers', [provider.toLowerCase()]);
      }

      const { data, error } = await query
        .order('category', { ascending: true })
        .order('symbol', { ascending: true });

      if (error) {
        console.error('Error fetching certified assets:', error);
        throw error;
      }
      
      return data as Asset[];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
