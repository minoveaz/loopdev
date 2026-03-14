import React from 'react';
import { ModuleToolbarProps } from './types';

export const MODULE_TOOLBAR_FIXTURES: Record<string, ModuleToolbarProps> = {
  default: {
    left: (
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 bg-background-subtle rounded animate-pulse" />
        <div className="h-7 w-20 bg-background-subtle rounded animate-pulse" />
      </div>
    ),
    center: (
      <div className="flex items-center gap-1 p-1 bg-background-subtle rounded-lg">
        <div className="h-6 w-8 bg-white dark:bg-white/10 rounded shadow-sm" />
        <div className="h-6 w-8 rounded" />
      </div>
    ),
    right: (
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 bg-primary/10 rounded border border-primary/20" />
      </div>
    )
  },
  withSelection: {
    selection: {
      count: 12,
      onClear: () => console.log('Clear selection'),
    },
    right: (
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 bg-danger/10 text-danger rounded border border-danger/20" />
      </div>
    )
  },
  empty: {}
};
