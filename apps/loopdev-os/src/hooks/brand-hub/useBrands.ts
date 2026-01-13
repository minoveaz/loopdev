'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BrandItem } from '@loopdev/ui/src/components/composites/workspace/ModuleSidebar/types';
import { MOCK_BRANDS } from '@/data/mock-brands';

/**
 * @hook useBrands
 * @description Recupera el listado maestro de marcas.
 * Modo DEV optimizado: Usa mocks instantáneos para evitar timeouts de red.
 */
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        
        // Fallback a mocks solo si la DB está vacía por ahora
        if (!data || data.length === 0) return MOCK_BRANDS;

        return data.map(b => ({
          id: b.id,
          name: b.name,
          status: b.status as any,
          updatedAt: new Date(b.updated_at).toLocaleDateString()
        })) as BrandItem[];
      } catch (e) {
        console.error('Supabase fetch error:', e);
        return MOCK_BRANDS; // Fallback de seguridad en caso de error de red/auth
      }
    },
    staleTime: Infinity // Evita refetching innecesario
  });
};
