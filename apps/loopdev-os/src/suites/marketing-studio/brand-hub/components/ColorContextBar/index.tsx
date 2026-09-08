'use client';

import React from 'react';
import { LpdText, Button, cn } from '@loopdev/ui';
import { ColorContextBarProps } from './types';

/**
 * @component ColorContextBar
 * @description Operational bar for theme, view mode and search filters.
 */
export const ColorContextBar: React.FC<ColorContextBarProps> = ({
  theme,
  onThemeChange,
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}) => {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'core', label: 'Core' },
    { id: 'semantic', label: 'Semantic' },
    { id: 'neutral', label: 'Neutral' },
  ];

  return (
    <div className="border-border-technical bg-background-surface/50 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-4 shadow-sm backdrop-blur-sm">
      {/* LEFT: FILTERS & SEARCH */}
      <div className="flex min-w-[300px] flex-1 items-center gap-6">
        {/* CATEGORY TABS */}
        <div className="bg-background-subtle border-border-technical/50 flex rounded-lg border p-1">
          {categories.map((cat) => (
            <Button
              type="button"
              key={cat.id}
              variant="ghost"
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all',
                activeCategory === cat.id
                  ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                  : 'text-text-muted hover:text-text-main',
              )}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative max-w-xs flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH TOKENS (e.g. brand.primary)..."
            className="text-text-main placeholder:text-text-muted/40 w-full border-none bg-transparent font-mono text-[11px] focus:ring-0"
          />
          <div className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2 pr-2 opacity-20">
            <span className="font-mono text-[10px]">⌘F</span>
          </div>
        </div>
      </div>

      {/* RIGHT: CONTEXT SELECTORS */}
      <div className="flex items-center gap-4">
        {/* THEME TOGGLE */}
        <div className="border-border-technical/50 flex items-center gap-2 border-r px-3 py-1.5 pr-4">
          <div className="flex flex-col items-end pr-2">
            <LpdText
              size="nano"
              className="text-text-muted font-mono uppercase tracking-tighter opacity-40"
            >
              Context
            </LpdText>
            <LpdText
              size="nano"
              className="text-text-muted font-mono uppercase tracking-tighter opacity-40"
            >
              Theme
            </LpdText>
          </div>
          <div className="bg-background-subtle border-border-technical/30 flex rounded-lg border p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onThemeChange('light')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                theme === 'light'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-muted opacity-40 hover:opacity-100',
              )}
            >
              <span className="material-symbols-outlined text-sm">light_mode</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onThemeChange('dark')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                theme === 'dark'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-muted opacity-40 hover:opacity-100',
              )}
            >
              <span className="material-symbols-outlined text-sm">dark_mode</span>
            </Button>
          </div>
          <LpdText size="nano" weight="bold" className="text-primary pl-1 font-mono">
            {`{ ${theme.toUpperCase()} }`}
          </LpdText>
        </div>

        {/* VIEW MODE */}
        <div className="flex items-center gap-2">
          <div className="bg-background-subtle border-border-technical/30 flex rounded-lg border p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-muted opacity-40 hover:opacity-100',
              )}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                viewMode === 'table'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-muted opacity-40 hover:opacity-100',
              )}
            >
              <span className="material-symbols-outlined text-sm">table_rows</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
