'use client';

import React from 'react';
import { IconButton, Input, LpdText, TechnicalStatusBadge, NavGroup, ScrollArea, Button, Skeleton } from '../../../atoms';
import { ModuleSidebarProps, BrandItem } from './types';

/**
 * @component ModuleSidebar
 * @description Espina dorsal de navegación del módulo.
 * Soporta dos modos: Directorio (Module) y Ontología (Brand).
 */
export const ModuleSidebar: React.FC<ModuleSidebarProps> = (props) => {
  const { 
    mode, 
    brands = [], 
    searchValue, 
    onSearchChange, 
    onSelectBrand,
    navGroups = [],
    onBackToDirectory,
    onNavigate,
    activeRouteId,
    isLoading = false,
    className = '' 
  } = props;

  const renderSkeletons = () => (
    <div className="flex flex-col p-2 gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-2">
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-3 w-3/4 rounded" />
            <Skeleton className="h-2 w-1/4 rounded opacity-50" />
          </div>
          <Skeleton className="h-4 w-12 rounded-full opacity-30" />
        </div>
      ))}
    </div>
  );

  // --- MODO A: DIRECTORIO DE MARCAS ---
  if (mode === 'module') {
    return (
      <div className={`flex flex-col h-full min-h-0 bg-shell-canvas border-r border-border-technical ${className}`}>
        {/* Header: Search */}
        <div className="flex flex-col gap-3 p-4 border-b border-border-technical">
          <div className="flex items-center justify-between">
            <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest">
              // Brands Directory
            </LpdText>
            {isLoading ? <Skeleton className="h-3 w-12" /> : (
              <LpdText size="nano" className="font-mono text-text-muted opacity-60">
                {brands.length} ITEMS
              </LpdText>
            )}
          </div>
          <Input 
            placeholder="Filter by name..." 
            size="sm" 
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            fullWidth
            disabled={isLoading}
          />
        </div>

        {/* Body: List */}
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full flex flex-col">
            {isLoading ? renderSkeletons() : (
              <div className="flex flex-col p-2 gap-1 flex-1">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => onSelectBrand?.(brand.id)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-background-subtle group transition-colors text-left"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <LpdText size="sm" weight="medium" className="text-text-main truncate group-hover:text-primary transition-colors">
                        {brand.name}
                      </LpdText>
                      <LpdText size="nano" className="text-text-muted font-mono opacity-60">
                        ID: {brand.id.substring(0, 8)}
                      </LpdText>
                    </div>
                    <TechnicalStatusBadge 
                      label={brand.status} 
                      severity={brand.status === 'published' ? 'success' : 'warning'} 
                      variant="ghost"
                      className="scale-90 origin-right"
                    />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer: Action */}
        <div className="p-4 border-t border-border-technical bg-shell-canvas">
          <Button variant="outline" size="sm" startIcon="add" fullWidth disabled={isLoading}>
            New Brand
          </Button>
        </div>
      </div>
    );
  }

  // --- MODO B: ONTOLOGÍA DE MARCA ---
  return (
    <div className={`flex flex-col h-full min-h-0 bg-shell-canvas border-r border-border-technical ${className}`}>
      {/* Header: Context & Back */}
      <div className="flex items-center gap-2 p-4 border-b border-border-technical">
        <IconButton 
          icon="arrow_back" 
          size="sm" 
          variant="ghost" 
          onClick={onBackToDirectory}
          aria-label="Back to Directory"
          disabled={isLoading}
        />
        <div className="flex flex-col min-w-0">
          <LpdText size="xs" weight="bold" className="text-text-main truncate">
            Current Brand
          </LpdText>
          <LpdText size="nano" className="text-text-muted uppercase tracking-wider font-mono">
            Mode: Definition
          </LpdText>
        </div>
      </div>

      {/* Body: Navigation Tree */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="flex flex-col p-4 gap-6">
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-3 w-1/2 rounded opacity-40" />
                    <div className="pl-4 space-y-2 border-l border-border-technical">
                      <Skeleton className="h-2 w-3/4 rounded opacity-20" />
                      <Skeleton className="h-2 w-2/3 rounded opacity-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : navGroups.map((group) => (
              <NavGroup 
                key={group.id} 
                label={group.label}
                isRail={false}
              >
                <div className="pl-2 border-l border-border-technical ml-1 mt-1 flex flex-col gap-1">
                  {group.items.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => onNavigate?.(item.id)}
                      className={`text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        item.id === activeRouteId 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-text-muted hover:text-text-main hover:bg-background-subtle'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </NavGroup>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer: Meta */}
      <div className="p-3 border-t border-border-technical flex justify-between items-center opacity-60">
        <LpdText size="nano" className="font-mono">v1.0.4</LpdText>
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
};
