'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { LpdText, Skeleton } from '@loopdev/ui';
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
      <div className="flex flex-col items-center justify-center p-20 text-center opacity-40">
        <LpdText size="sm" className="font-mono uppercase tracking-widest border border-dashed border-border-technical p-12 rounded-3xl">
          // typography_system_not_initialized
        </LpdText>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32">
      
      {/* HEADER SECTION (Standardized) */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight uppercase">
              Visual System _TYPOGRAPHY
            </LpdText>
            {system.aiOptimized && (
              <div className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-600 text-[10px] font-bold uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
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
          <LpdText size="lg" weight="bold" className="text-text-main tracking-tight">Active Typefaces</LpdText>
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
          <LpdText size="lg" weight="bold" className="text-text-main tracking-tight">Typographic Hierarchy</LpdText>
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