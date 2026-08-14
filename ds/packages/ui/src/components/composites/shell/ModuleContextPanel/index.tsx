'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { ModuleContextPanelProps } from './types';

const widthClasses = {
  narrow: 'w-56',
  standard: 'w-72',
  wide: 'w-80',
  'extra-wide': 'w-[26rem]',
} as const;

export const ModuleContextPanel: React.FC<ModuleContextPanelProps> = ({
  children,
  footer,
  label,
  width = 'standard',
  onClose,
  className = '',
}) => (
  <aside
    aria-label={label}
    data-testid="module-context-panel"
    className={`border-border-technical bg-shell-canvas z-20 flex h-full min-h-0 shrink-0 self-stretch flex-col overflow-hidden border-l max-lg:max-h-64 max-lg:h-auto max-lg:w-full max-lg:border-b max-lg:border-l-0 ${widthClasses[width]} ${className}`}
  >
    <div className="border-border-technical flex min-h-12 shrink-0 items-center justify-between gap-3 border-b px-4">
      <h2 className="text-primary text-lpd-lg font-semibold leading-tight">{label}</h2>
      {onClose ? (
        <button
          type="button"
          aria-label={`Close ${label}`}
          onClick={onClose}
          className="text-text-muted hover:bg-shell-surface hover:text-text-main focus-visible:outline-primary flex size-8 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline focus-visible:outline-2"
        >
          <X size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
    {footer ? <div className="border-border-technical shrink-0 border-t p-3">{footer}</div> : null}
  </aside>
);

export * from './types';
