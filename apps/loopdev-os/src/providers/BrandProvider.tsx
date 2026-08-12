'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BrandSchema, type Brand } from '@loopdev/contracts';
import { createClient } from '@/lib/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';

export type BrandContextType = {
  brands: Brand[];
  activeBrand: Brand | null;
  activeBrandId: string | null;
  setActiveBrandId: (brandId: string | null) => void;
  shouldSelectBrand: boolean;
  isLoading: boolean;
};

export const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { activeOrganizationId } = useOrganization();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [requestedBrandId, setRequestedBrandId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBrands = async () => {
      if (!activeOrganizationId) {
        setBrands([]);
        setRequestedBrandId(null);
        return;
      }

      setIsLoading(true);
      const { data, error } = await createClient()
        .from('brands')
        .select('id, organization_id, name, description, status, logo_url, logos, typography, rules_engine, created_at, updated_at')
        .eq('organization_id', activeOrganizationId)
        .order('updated_at', { ascending: false });

      if (!isMounted) return;
      if (error) {
        console.warn('Brands are not available yet:', error.message);
        setBrands([]);
      } else {
        setBrands((data ?? []).map((row) => BrandSchema.safeParse({
          id: row.id, organizationId: row.organization_id,
          name: row.name, description: row.description ?? undefined, status: row.status,
          logoUrl: row.logo_url, logos: row.logos ?? undefined, typography: row.typography ?? undefined,
          rulesEngine: row.rules_engine ?? undefined, createdAt: row.created_at, updatedAt: row.updated_at,
        })).flatMap((result) => result.success ? [result.data] : []));
      }
      setIsLoading(false);
    };

    void loadBrands();
    return () => { isMounted = false; };
  }, [activeOrganizationId]);

  const activeBrandId = useMemo(() => {
    if (!activeOrganizationId || brands.length === 0) return null;
    if (brands.length === 1) return brands[0].id;
    if (requestedBrandId && brands.some(({ id }) => id === requestedBrandId)) return requestedBrandId;
    const stored = window.localStorage.getItem(`loopdev.activeBrandId:${activeOrganizationId}`);
    return brands.some(({ id }) => id === stored) ? stored : null;
  }, [activeOrganizationId, brands, requestedBrandId]);

  const setActiveBrandId = useCallback((brandId: string | null) => {
    if (!activeOrganizationId) return;
    if (brandId !== null && !brands.some(({ id }) => id === brandId)) return;
    setRequestedBrandId(brandId);
    if (brandId) window.localStorage.setItem(`loopdev.activeBrandId:${activeOrganizationId}`, brandId);
    else window.localStorage.removeItem(`loopdev.activeBrandId:${activeOrganizationId}`);
  }, [activeOrganizationId, brands]);

  const activeBrand = useMemo(() => brands.find(({ id }) => id === activeBrandId) ?? null, [activeBrandId, brands]);

  return <BrandContext.Provider value={{ brands, activeBrand, activeBrandId, setActiveBrandId, shouldSelectBrand: brands.length > 1, isLoading }}>{children}</BrandContext.Provider>;
}
