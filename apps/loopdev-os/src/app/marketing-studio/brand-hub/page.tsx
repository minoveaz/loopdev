'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heading, LpdText, TechnicalText, SectionHeader, ModuleCard, Skeleton, EmptyState, Button, Icon } from '@loopdev/ui';
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
            <Heading as="h2" size="2xl" weight="bold" className="text-text-main uppercase tracking-tight">
              Module_Overview
            </Heading>
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
        <SectionHeader
          icon={<Icon name="verified_user" size="sm" className="text-primary" />}
          title="Recent Identities"
        />

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
                    <TechnicalText size="nano" className="text-text-muted opacity-60 uppercase">Last Update</TechnicalText>
                    <LpdText size="xs" className="text-text-main font-medium">{brand.updatedAt}</LpdText>
                  </div>
                }
                onClick={() => router.push(`/marketing-studio/brand-hub/brands/${brand.id}/overview`)}
              />
            ))
          )}
          
          {/* Card de "Crear Nueva" */}
          <Button
            variant="secondary"
            onClick={() => console.log('New Brand Flow')}
            className="flex flex-col items-center justify-center p-6 border border-dashed border-border-technical rounded-2xl bg-white/2 hover:bg-primary/5 hover:border-primary/30 transition-all group aspect-square"
          >
            <div className="w-12 h-12 rounded-full bg-background-subtle group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
              <Icon name="add" className="text-text-muted group-hover:text-primary" />
            </div>
            <LpdText size="sm" weight="bold" className="text-text-muted group-hover:text-primary">Create Brand</LpdText>
          </Button>
        </div>
      </section>

      {/* Telemetry Placeholders (Future) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Health signals', 'Governance activity', 'Content telemetry'].map((title) => (
          <EmptyState
            key={title}
            title={title}
            description="Telemetry will appear when this workspace has activity."
            icon="monitoring"
            size="sm"
            variant="ghost"
          />
        ))}
      </section>
    </div>
  );
}
