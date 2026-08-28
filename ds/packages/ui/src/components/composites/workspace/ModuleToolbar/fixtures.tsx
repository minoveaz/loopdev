import React from 'react';
import { ModuleToolbarProps } from './types';

export const MODULE_TOOLBAR_FIXTURES: Record<string, ModuleToolbarProps> = {
  default: {
    leftSlot: (
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 bg-background-subtle rounded animate-pulse" />
        <div className="h-7 w-20 bg-background-subtle rounded animate-pulse" />
      </div>
    ),
    centerSlot: (
      <div className="flex items-center gap-1 p-1 bg-background-subtle rounded-lg">
        <div className="h-6 w-8 bg-white dark:bg-white/10 rounded shadow-sm" />
        <div className="h-6 w-8 rounded" />
      </div>
    ),
    rightSlot: (
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
    rightSlot: (
      <div className="flex items-center gap-2">
        <div className="h-7 w-24 bg-danger/10 text-danger rounded border border-danger/20" />
      </div>
    )
  },
  empty: {}
};
