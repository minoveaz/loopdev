'use client';

import React from 'react';
import type { ModuleContextSidebarProps } from './types';

const widthClasses = {
  narrow: 'w-48',
  standard: 'w-64',
  wide: 'w-72',
} as const;

export const ModuleContextSidebar: React.FC<ModuleContextSidebarProps> = ({
  children,
  footer,
  label,
  width = 'standard',
  className = '',
}) => (
  <aside
    aria-label={label}
    data-testid="module-context-sidebar"
    className={`border-border-technical bg-shell-canvas flex min-h-0 shrink-0 flex-col overflow-hidden border-r max-lg:max-h-64 max-lg:w-full max-lg:border-b max-lg:border-r-0 ${widthClasses[width]} ${className}`}
  >
    <div className="border-border-technical flex h-14 shrink-0 items-center border-b px-6">
      <h2 className="text-primary text-lpd-lg font-semibold leading-tight">{'{' + label + '}'}</h2>
    </div>
    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
    {footer ? <div className="border-border-technical shrink-0 border-t p-3">{footer}</div> : null}
  </aside>
);

export const ContextPanel = ModuleContextSidebar;

export * from './types';
