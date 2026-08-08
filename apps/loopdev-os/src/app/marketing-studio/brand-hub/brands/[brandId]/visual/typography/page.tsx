'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Heading, LpdText, TechnicalText, Skeleton, EmptyState, Icon } from '@loopdev/ui';
import { useBrandHub } from '@/suites/marketing-studio/brand-hub/context';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';

// Industrial Components
import { TypefaceCard } from '@/suites/marketing-studio/brand-hub/components/TypefaceCard';
import { TypeScaleTable } from '@/suites/marketing-studio/brand-hub/components/TypeScaleTable';

/**
 * @page BrandTypographyPage
 * @description The operational console for managing the brand's typographic system.
 * Fetches real-time configuration from Supabase via useActiveBrand hook.
 */
export default function BrandTypographyPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const { setSelectedEntity, setInspectorOpen } = useBrandHub();
  
  // Data Acquisition (The Spine connection)
  const { data: brand, isLoading } = useActiveBrand(brandId);
  const system = brand?.typography;

  const handleFontClick = (type: 'primary' | 'secondary') => {
    if (!system) return;
    const font = type === 'primary' ? system.primary : system.secondary;
    if (!font) return;

    setSelectedEntity({
      type: 'brand.typeface',
      id: `font-${type}`,
      name: `${font.family} (${type})`
    });
    setInspectorOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto">
        <Skeleton className="h-16 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 gap-8">
          <Skeleton className="h-[300px] w-full rounded-3xl" />
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!system) {
    return (
      <EmptyState
        title="Typography system unavailable"
        description="Approved font families and scales will appear after the brand system is configured."
        icon="text_fields"
        variant="ghost"
      />
    );
  }

  return (
    <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32">
      
      {/* HEADER SECTION (Standardized) */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Heading as="h1" size="2xl" weight="bold" className="text-text-main tracking-tight uppercase">
              Visual System _TYPOGRAPHY
            </Heading>
            {system.aiOptimized && (
              <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase flex items-center gap-1.5">
                <Icon name="auto_awesome" size="sm" />
                AI Optimized
              </div>
            )}
          </div>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            The typographic system is built for clarity and scalability. These definitions are consumed by AI agents to generate readable layouts automatically.
          </LpdText>
        </div>
      </header>

      {/* SECTION 1: Typeface Definition (The Cards) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Heading as="h2" size="lg" weight="bold" className="text-text-main tracking-tight">Active Typefaces</Heading>
          <div className="flex gap-2">
             <span className="px-2 py-1 rounded bg-background-subtle border border-border-technical text-[10px] font-mono text-text-muted">
               Ratio: {system.scaleRatio} (Calculated)
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Primary Font */}
          <div>
             <TypefaceCard 
               font={system.primary} 
               variant="brand" 
               onClick={() => handleFontClick('primary')}
             />
          </div>

          {/* Secondary (Code/Technical) */}
          {system.secondary && (
            <div>
              <TypefaceCard 
                font={system.secondary} 
                variant="technical" 
                onClick={() => handleFontClick('secondary')}
              />
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: Hierarchy (The Math) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Heading as="h2" size="lg" weight="bold" className="text-text-main tracking-tight">Typographic Hierarchy</Heading>
          <LpdText size="sm" className="text-text-muted">
            Calculated dynamically based on base size ({system.baseSize}px) and scale ratio.
          </LpdText>
        </div>

        <TypeScaleTable 
          baseSize={system.baseSize}
          scaleRatio={system.scaleRatio}
          primaryFont={system.primary.family}
        />
      </section>

    </div>
  );
}
