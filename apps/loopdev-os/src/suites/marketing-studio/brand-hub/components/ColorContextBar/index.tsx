'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
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
  onCategoryChange
}) => {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'core', label: 'Core' },
    { id: 'semantic', label: 'Semantic' },
    { id: 'neutral', label: 'Neutral' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-4 rounded-2xl border border-border-technical bg-background-surface/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      
      {/* LEFT: FILTERS & SEARCH */}
      <div className="flex items-center gap-6 flex-1 min-w-[300px]">
        {/* CATEGORY TABS */}
        <div className="flex bg-background-subtle rounded-lg p-1 border border-border-technical/50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                activeCategory === cat.id 
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                  : "text-text-muted hover:text-text-main"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH TOKENS..."
            className="w-full bg-transparent border-none text-[11px] font-mono text-text-main placeholder:text-text-muted/40 focus:ring-0"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 opacity-20 pointer-events-none">
            <span className="text-[10px] font-mono">⌘F</span>
          </div>
        </div>
      </div>

      {/* RIGHT: CONTEXT SELECTORS */}
      <div className="flex items-center gap-4">
        {/* THEME TOGGLE */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-r border-border-technical/50 pr-4">
          <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-tighter opacity-40 pr-2">Context</LpdText>
          <div className="flex bg-background-subtle rounded-lg p-0.5 border border-border-technical/30">
            <button 
              onClick={() => onThemeChange('light')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                theme === 'light' ? "bg-white text-primary shadow-sm" : "text-text-muted opacity-40 hover:opacity-100"
              )}
            >
              <span className="material-symbols-outlined text-sm">light_mode</span>
            </button>
            <button 
              onClick={() => onThemeChange('dark')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                theme === 'dark' ? "bg-white text-primary shadow-sm" : "text-text-muted opacity-40 hover:opacity-100"
              )}
            >
              <span className="material-symbols-outlined text-sm">dark_mode</span>
            </button>
          </div>
          <LpdText size="nano" weight="bold" className="text-primary font-mono pl-1">
            {`{ ${theme.toUpperCase()} }`}
          </LpdText>
        </div>

        {/* VIEW MODE */}
        <div className="flex items-center gap-2">
          <div className="flex bg-background-subtle rounded-lg p-0.5 border border-border-technical/30">
            <button 
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-text-muted opacity-40 hover:opacity-100"
              )}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
            </button>
            <button 
              onClick={() => onViewModeChange('table')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'table' ? "bg-white text-primary shadow-sm" : "text-text-muted opacity-40 hover:opacity-100"
              )}
            >
              <span className="material-symbols-outlined text-sm">table_rows</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
