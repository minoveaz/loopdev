'use client';

import React from 'react';
import type { ModuleContextPanelProps } from './types';

const widthClasses = {
  narrow: 'w-56',
  standard: 'w-72',
  wide: 'w-80',
} as const;

export const ModuleContextPanel: React.FC<ModuleContextPanelProps> = ({
  children,
  footer,
  label,
  width = 'standard',
  className = '',
}) => (
  <aside
    aria-label={label}
    data-testid="module-context-panel"
    className={`border-border-technical bg-shell-canvas flex min-h-0 shrink-0 flex-col overflow-hidden border-l max-lg:max-h-64 max-lg:w-full max-lg:border-b max-lg:border-l-0 ${widthClasses[width]} ${className}`}
  >
    <div className="border-border-technical flex min-h-12 shrink-0 items-center border-b px-4">
      <h2 className="text-primary text-lpd-lg font-semibold leading-tight">{'{' + label + '}'}</h2>
    </div>
    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
    {footer ? <div className="border-border-technical shrink-0 border-t p-3">{footer}</div> : null}
  </aside>
);

export * from './types';
