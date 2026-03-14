import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsApi } from '@/lib/api-client';
import { CreateBrandInput } from '@loopdev/contracts';

export const useBrands = () => {
  const queryClient = useQueryClient();

  // Query: Obtener listado
  const useBrandsList = () => {
    return useQuery({
      queryKey: ['brands'],
      queryFn: () => brandsApi.getAll(),
    });
  };

  // Mutation: Crear marca
  const useCreateBrand = () => {
    return useMutation({
      mutationFn: (newBrand: CreateBrandInput) => brandsApi.create(newBrand),
      onSuccess: () => {
        // Invalida la caché para refrescar la lista automáticamente
        queryClient.invalidateQueries({ queryKey: ['brands'] });
      },
    });
  };

  return {
    useBrandsList,
    useCreateBrand,
  };
};
