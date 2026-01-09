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
      // SIMULACIÓN DE RED CERO: Retorno inmediato para fluidez de UI
      // Descomentar el bloque de abajo cuando Supabase esté 100% configurado
      return MOCK_BRANDS;

      /*
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error || !data) throw error;

        return data.map(b => ({
          id: b.id,
          name: b.name,
          status: b.status as any,
          updatedAt: new Date(b.updated_at).toLocaleDateString()
        })) as BrandItem[];
      } catch (e) {
        return MOCK_BRANDS;
      }
      */
    },
    staleTime: Infinity // Evita refetching innecesario
  });
};
