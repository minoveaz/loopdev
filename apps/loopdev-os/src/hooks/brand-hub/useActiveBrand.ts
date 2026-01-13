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

      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('id', brandId)
          .single();

        if (error) throw error;
        return data;
      } catch (e) {
        // Fallback a mocks si falla la red o no existe en DB
        const mockBrand = MOCK_BRANDS.find(b => b.id === brandId);
        return mockBrand || null;
      }
    },
    enabled: !!brandId,
    // Eliminamos initialData estático para permitir que el loading state sea real si se desea, 
    // o lo mantenemos si queremos optimismo extremo. Lo quitaré para verificar la carga real.
  });
};
