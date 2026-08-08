'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Heading, LpdText, Skeleton, EmptyState, BrandLogo, Icon } from '@loopdev/ui';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';

// Industrial Components
import { LogoSystemSchema } from '@loopdev/contracts';
import { LogoShowcase } from '@/suites/marketing-studio/brand-hub/components/LogoShowcase';
import { LogoVariantCard } from '@/suites/marketing-studio/brand-hub/components/LogoVariantCard';
import { LogoScaleTest } from '@/suites/marketing-studio/brand-hub/components/LogoScaleTest';
import { BracketsShowcase } from '@/suites/marketing-studio/brand-hub/components/BracketsShowcase';

/**
 * @page BrandLogoPage
 * @description The centralized repository for all brand logo assets.
 * Manages Isotype, Lockups, and Contextual Variants with strict governance.
 */
export default function BrandLogoPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  // Data Acquisition
  const { data: brand, isLoading } = useActiveBrand(brandId);
  const parsedLogoSystem = LogoSystemSchema.safeParse(brand?.logos);
  const logoSystem = parsedLogoSystem.success ? parsedLogoSystem.data : undefined;

  // LOOPDEV CERTIFICATION CHECK
  const isLoopDev = brandId === 'a399ff27-fff1-406a-b82a-80dd76115dd2';

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto">
        <Skeleton className="h-16 w-1/3 rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!logoSystem) {
    return (
      <EmptyState
        title="Logo system unavailable"
        description="Approved logo variants will appear after the brand assets are configured."
        icon="image"
        variant="ghost"
      />
    );
  }

  const { primary, monochrome } = logoSystem;

  return (
    <div className="flex flex-col gap-16 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32">
      {/* HEADER */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Heading
              as="h1"
              size="2xl"
              weight="bold"
              className="text-text-main tracking-tight uppercase"
            >
              Visual System _LOGOS
            </Heading>
            <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase flex items-center gap-1.5">
              <Icon name="verified" size="sm" />
              {isLoopDev ? 'Certified Identity' : 'Official Assets'}
            </div>
          </div>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            The definitive source for all brand marks. Use these assets to ensure consistency across
            marketing, product, and communications.
          </LpdText>
        </div>
      </header>

      {/* 1. THE ISOTYPE (Hero) */}
      <section>
        <LogoShowcase
          logo={primary.isotype}
          logoNode={isLoopDev ? <BrandLogo variant="isotype" size="xl" /> : undefined}
          description="The infinite loop symbol is the core of our visual language, representing continuous learning and generative cycles."
        />
      </section>

      {/* 2. PRIMARY LOCKUPS */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-bold text-sm border border-primary/20">
            02
          </span>
          <Heading as="h2" size="xl" weight="bold" className="text-text-main tracking-tight">
            Primary Lockups
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LogoVariantCard
            logo={primary.horizontal}
            logoNode={
              isLoopDev ? <BrandLogo variant="full" size="md" colorMode="dark" /> : undefined
            }
            label="Horizontal Lockup"
            description="Primary usage for web headers & print."
            theme="dark"
          />
          <LogoVariantCard
            logo={primary.vertical}
            logoNode={
              isLoopDev ? <BrandLogo variant="full" size="md" colorMode="dark" /> : undefined
            }
            label="Vertical Lockup"
            description="For avatars, social media, & merch."
            theme="dark"
          />
        </div>
      </section>

      {/* 3. CONTEXTUAL VARIANTS */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-bold text-sm border border-primary/20">
            03
          </span>
          <Heading as="h2" size="xl" weight="bold" className="text-text-main tracking-tight">
            Context Variants
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LogoVariantCard
            logo={primary.horizontal || primary.isotype}
            logoNode={
              isLoopDev ? <BrandLogo variant="full" size="sm" colorMode="light" /> : undefined
            }
            label="Full Color (Light)"
            theme="light"
          />
          <LogoVariantCard
            logo={monochrome?.negative?.isotype}
            logoNode={
              isLoopDev ? <BrandLogo variant="full" size="sm" colorMode="dark" /> : undefined
            }
            label="Monochrome (Dark)"
            theme="dark"
          />
          <LogoVariantCard
            logo={monochrome?.positive?.isotype}
            logoNode={
              isLoopDev ? <BrandLogo variant="full" size="sm" colorMode="dark" /> : undefined
            }
            label="Monochrome (Brand)"
            theme="brand"
          />
        </div>
      </section>

      {/* 4. SCALE TEST */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-bold text-sm border border-primary/20">
            04
          </span>
          <Heading as="h2" size="xl" weight="bold" className="text-text-main tracking-tight">
            Scale Validation
          </Heading>
        </div>
        <LogoScaleTest
          logo={primary.isotype}
          logoNode={isLoopDev ? <BrandLogo variant="isotype" size="xs" /> : undefined}
        />
      </section>

      {/* 5. BRACKETS (Supporting Elements) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-bold text-sm border border-primary/20">
            05
          </span>
          <Heading as="h2" size="xl" weight="bold" className="text-text-main tracking-tight">
            Supporting Elements: Brackets
          </Heading>
        </div>
        <BracketsShowcase />
      </section>
    </div>
  );
}
