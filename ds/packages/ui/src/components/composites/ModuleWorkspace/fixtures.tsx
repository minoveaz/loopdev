import React from 'react';
import { ModuleWorkspaceProps } from './types';

/**
 * @file fixtures.ts
 * @description Datos de prueba realistas para el ModuleWorkspace.
 */

export const MODULE_WORKSPACE_FIXTURES: Record<string, Partial<ModuleWorkspaceProps>> = {
  default: {
    moduleId: 'brand-hub',
    a11y: {
      sidebarLabel: 'Module Navigation',
      inspectorLabel: 'Item Properties',
    },
    headerSlot: (
      <div className="flex items-center px-4 h-full gap-4">
        <span className="text-sm font-bold text-text-main">Brand Hub</span>
        <div className="h-4 w-px bg-border-technical" />
        <span className="text-xs text-text-muted">{`{ DRAFT }`}</span>
      </div>
    ),
    sidebarSlot: (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-background-subtle rounded animate-pulse" />
        <div className="h-8 bg-background-subtle rounded animate-pulse w-3/4" />
        <div className="h-8 bg-background-subtle rounded animate-pulse w-1/2" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-6 bg-background-subtle/50 rounded w-full" />
        ))}
      </div>
    ),
    toolbarSlot: (
      <div className="flex items-center gap-4 w-full">
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-background-subtle rounded" />
          <div className="h-7 w-20 bg-background-subtle rounded" />
        </div>
        <div className="ml-auto h-7 w-32 bg-background-subtle rounded" />
      </div>
    ),
    inspectorSlot: (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-background-subtle rounded" />
          <div className="h-24 bg-background-subtle rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-background-subtle rounded" />
          <div className="h-48 bg-background-subtle rounded" />
        </div>
      </div>
    ),
    children: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-48 bg-white dark:bg-white/5 border border-border-technical rounded-xl p-4 shadow-sm">
              <div className="h-4 w-1/3 bg-background-subtle rounded mb-4" />
              <div className="h-20 bg-background-subtle rounded mb-4" />
              <div className="h-4 w-full bg-background-subtle rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }
};