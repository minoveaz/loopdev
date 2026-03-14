'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';
import { useBrandHub } from '@/suites/marketing-studio/brand-hub/context';
import { LpdText, Skeleton } from '@loopdev/ui';

// Components
import { ColorContextBar } from '@/suites/marketing-studio/brand-hub/components/ColorContextBar';
import { TokenGroupSection } from '@/suites/marketing-studio/brand-hub/components/TokenGroupSection';

/**
 * @page BrandColorsPage
 * @description Enterprise-grade environment for managing semantic color tokens.
 */
export default function BrandColorsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const { data: brand, isLoading } = useActiveBrand(brandId);
  
  // Use Global Context for Operational State
  const { 
    setInspectorOpen, 
    selectedEntity, 
    setSelectedEntity,
    previewTheme,
    setPreviewTheme,
    viewMode,
    setViewMode
  } = useBrandHub();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Sync brand data to context if needed (handled by layout mostly)
  
  // FILTERING LOGIC
  const filteredTokens = useMemo(() => {
    if (!brand?.palette?.tokens) return [];
    
    return brand.palette.tokens.filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(search.toLowerCase()) || 
                           token.group.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || token.group === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [brand, search, activeCategory]);

  const coreTokens = filteredTokens.filter(t => t.group === 'core');
  const semanticTokens = filteredTokens.filter(t => t.group === 'semantic');
  const neutralTokens = filteredTokens.filter(t => t.group === 'neutral' || t.group === 'surface');

  // HANDLERS
  const handleTokenClick = (token: any) => {
    setSelectedEntity({
      type: 'color.token',
      id: token.id,
      name: `Token: ${token.name}`
    });
    setInspectorOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!brand?.palette) {
    return (
      <div className="p-12 text-center border border-dashed border-border-technical rounded-3xl m-8 opacity-40">
        <LpdText size="sm" className="font-mono uppercase tracking-widest">// color_palette_not_initialized</LpdText>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-8 max-w-7xl mx-auto animate-in fade-in duration-700 pb-32">
      
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight uppercase">
              Visual System _COLORS
            </LpdText>
            <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase">
              v1.5 Semantic
            </div>
          </div>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            Manage semantic color tokens that resolve automatically per theme and medium. 
            Changes here propagate across all platform interfaces and generated content.
          </LpdText>
        </div>

        {/* LEGIBILITY GUIDE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border border-border-technical/50 bg-background-subtle/20">
          <div className="flex flex-col gap-1">
            <LpdText size="nano" weight="bold" className="text-text-main uppercase tracking-widest">Legibility Guide</LpdText>
            <LpdText size="nano" className="text-text-muted leading-tight">
              We audit contrast using WCAG 2.1 standards. These thresholds are enforced automatically in preflight and validation to ensure brand accessibility.
            </LpdText>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <LpdText size="nano" weight="bold" className="text-text-main">BODY_TEXT (AA)</LpdText>
              </div>
              <LpdText size="nano" className="text-text-muted">Ratio &gt; 4.5:1. Safe for small text.</LpdText>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <LpdText size="nano" weight="bold" className="text-text-main">HEADLINES (AA_LG)</LpdText>
              </div>
              <LpdText size="nano" className="text-text-muted">Ratio &gt; 3.0:1. Only for large titles.</LpdText>
            </div>
          </div>
        </div>
      </header>

      {/* OPERATIONAL BAR */}
      <ColorContextBar
        theme={previewTheme}
        onThemeChange={setPreviewTheme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* MAIN SURFACE */}
      <main className="flex flex-col gap-16">
        {viewMode === 'grid' ? (
          <>
            <TokenGroupSection 
              title="Core Brand Palette" 
              description="Primary identifiers and high-frequency brand colors."
              tokens={coreTokens} 
              theme={previewTheme}
              selectedTokenId={selectedEntity?.id}
              onTokenClick={handleTokenClick}
            />
            <TokenGroupSection 
              title="Semantic Tokens" 
              description="Context-aware colors for status, feedback, and functional roles."
              tokens={semanticTokens} 
              theme={previewTheme}
              selectedTokenId={selectedEntity?.id}
              onTokenClick={handleTokenClick}
            />
            <TokenGroupSection 
              title="Neutrals & Surfaces" 
              description="Scale for backgrounds, borders, and UI structural elements."
              tokens={neutralTokens} 
              theme={previewTheme}
              selectedTokenId={selectedEntity?.id}
              onTokenClick={handleTokenClick}
            />
          </>
        ) : (
          <div className="p-12 text-center border border-border-technical rounded-3xl opacity-40 bg-background-surface">
            <LpdText size="sm" className="font-mono uppercase tracking-widest">// table_view_mode_under_construction</LpdText>
          </div>
        )}

        {filteredTokens.length === 0 && search && (
          <div className="p-20 text-center flex flex-col items-center gap-4 bg-background-surface/30 rounded-3xl border border-dashed border-border-technical">
            <span className="material-symbols-outlined text-4xl text-text-muted/20">search_off</span>
            <LpdText size="sm" className="text-text-muted italic">No tokens found matching "{search}"</LpdText>
          </div>
        )}
      </main>

    </div>
  );
}
