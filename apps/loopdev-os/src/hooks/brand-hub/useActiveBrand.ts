'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MOCK_BRANDS } from '@/data/mock-brands';

/**
 * @hook useActiveBrand
 * @description Recupera los detalles de una marca específica.
 * Modo DEV: Bypass a mocks para evitar loading infinito si no hay Supabase.
 */
export const useActiveBrand = (brandId: string | null) => {
  return useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      if (!brandId) return null;

      // SIMULACIÓN DE RED CERO
      const mockBrand = MOCK_BRANDS.find(b => b.id === brandId);
      if (mockBrand) return mockBrand;

      /*
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', brandId)
        .single();

      if (error) throw error;
      return data;
      */
     return null;
    },
    enabled: !!brandId,
    initialData: MOCK_BRANDS.find(b => b.id === brandId) // Carga instantánea
  });
};
