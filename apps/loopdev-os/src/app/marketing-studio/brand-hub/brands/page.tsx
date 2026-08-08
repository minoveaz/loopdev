'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LpdText, Icon, ModuleCard, Skeleton } from '@loopdev/ui';
import { useBrands } from '@/hooks/brand-hub/useBrands';

/**
 * @page BrandsDirectory
 * @description Directorio maestro de marcas.
 * Visualización en grid industrial conectada a Supabase.
 */
export default function BrandsDirectoryPage() {
  const router = useRouter();
  const { data: brands = [], isLoading } = useBrands();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Grid de Marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {brands.map((brand) => (
          <ModuleCard
            key={brand.id}
            title={brand.name}
            statusBadge={brand.status.toUpperCase()}
            statusTone={brand.status === 'published' ? 'success' : (brand.status === 'draft' ? 'warning' : 'neutral')}
            footerContent={
              <div className="flex flex-col">
                <LpdText size="nano" className="text-text-muted opacity-60 font-mono uppercase">Last Update</LpdText>
                <LpdText size="xs" className="text-text-main font-medium">{brand.updatedAt}</LpdText>
              </div>
            }
            onClick={() => router.push(`/marketing-studio/brand-hub/brands/${brand.id}/overview`)}
          />
        ))}

        {/* Action Card: Create New */}
        <button 
          onClick={() => console.log('New Brand Flow')}
          className="flex flex-col items-center justify-center p-6 border border-dashed border-border-technical rounded-2xl bg-white/2 hover:bg-primary/5 hover:border-primary/30 transition-all group min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-full bg-background-subtle group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
            <Icon name="add" className="text-text-muted group-hover:text-primary" />
          </div>
          <LpdText size="sm" weight="bold" className="text-text-muted group-hover:text-primary">Create Brand</LpdText>
        </button>
      </div>
    </div>
  );
}