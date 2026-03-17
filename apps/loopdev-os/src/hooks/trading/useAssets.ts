'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Asset } from '@loopdev/ui';

/**
 * @hook useAssets
 * @description Industrial hook for fetching certified trading assets from Supabase.
 */
export const useAssets = () => {
  return useQuery({
    queryKey: ['trading', 'assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quant_assets')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('symbol', { ascending: true });

      if (error) {
        console.error('Error fetching certified assets:', error);
        throw error;
      }
      
      return data as Asset[];
    },
    // Assets are stable, so we can keep them in cache for a long time
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
