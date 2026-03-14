'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LpdText, ModuleCard, Skeleton, Button, Icon } from '@loopdev/ui';
import { useBrands } from '@/hooks/brand-hub/useBrands';

/**
 * @page BrandHubOverview
 * @description Tablero operativo global del módulo Brand Hub.
 */
export default function BrandHubOverview() {
  const router = useRouter();
  const { data: brands = [], isLoading } = useBrands();

  return (
    <div className="flex flex-col gap-12">
      {/* Header del Dashboard */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-text-main uppercase tracking-tight">
              Module_Overview
            </h2>
            <LpdText size="sm" className="text-text-muted max-w-xl">
              Welcome to the Brand Oracle. Monitor the health of your identities and govern compliance.
            </LpdText>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/marketing-studio/brand-hub/brands')}>
            View All Brands
          </Button>
        </div>
      </header>

      {/* Grid de Marcas Recientes (Active) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border-technical">
          <Icon name="verified_user" size="sm" className="text-primary" />
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest">
            Recent Identities
          </LpdText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)
          ) : (
            brands.slice(0, 3).map((brand) => (
              <ModuleCard
                key={brand.id}
                title={brand.name}
                statusBadge={brand.status.toUpperCase()}
                statusTone={brand.status === 'published' ? 'success' : 'warning'}
                footerContent={
                  <div className="flex flex-col">
                    <LpdText size="nano" className="text-text-muted opacity-60 font-mono uppercase">Last Update</LpdText>
                    <LpdText size="xs" className="text-text-main font-medium">{brand.updatedAt}</LpdText>
                  </div>
                }
                onClick={() => router.push(`/marketing-studio/brand-hub/brands/${brand.id}/overview`)}
              />
            ))
          )}
          
          {/* Card de "Crear Nueva" */}
          <button 
            onClick={() => console.log('New Brand Flow')}
            className="flex flex-col items-center justify-center p-6 border border-dashed border-border-technical rounded-2xl bg-white/2 hover:bg-primary/5 hover:border-primary/30 transition-all group aspect-square"
          >
            <div className="w-12 h-12 rounded-full bg-background-subtle group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
              <Icon name="add" className="text-text-muted group-hover:text-primary" />
            </div>
            <LpdText size="sm" weight="bold" className="text-text-muted group-hover:text-primary">Create Brand</LpdText>
          </button>
        </div>
      </section>

      {/* Telemetry Placeholders (Future) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 border border-dashed border-border-technical rounded-2xl flex items-center justify-center opacity-20 font-mono text-micro uppercase tracking-widest">
            // telemetry_block_0{i}
          </div>
        ))}
      </section>
    </div>
  );
}