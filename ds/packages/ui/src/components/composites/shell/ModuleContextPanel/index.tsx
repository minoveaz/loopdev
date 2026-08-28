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
  footerSlot,
  label,
  visible = true,
  headerRows = 1,
  showFooter,
  footerRows = 1,
  contentScrollable = true,
  headerSlot,
  width = 'standard',
  presentation = 'inline',
  onClose,
  className = '',
}) => {
  const footerContent = footerSlot ?? footer;
  const shouldRenderFooter = showFooter ?? Boolean(footerContent);

  if (!visible) return null;

  return (
  <aside
    aria-label={label}
    data-testid="module-context-panel"
    data-width={width}
    data-presentation={presentation}
    data-content-scrollable={contentScrollable}
    className={`border-border-technical bg-shell-canvas z-20 flex h-full min-h-0 shrink-0 self-stretch flex-col overflow-hidden border-l max-lg:absolute max-lg:inset-0 max-lg:z-50 max-lg:h-full max-lg:w-full max-lg:border-b max-lg:border-l-0 ${widthClasses[width]} ${presentation === 'overlay' ? 'shadow-[-4px_0_16px_rgba(15,23,42,0.08)]' : ''} ${className}`}
  >
    <div className={`border-border-technical flex min-h-12 min-w-0 shrink-0 items-center justify-between gap-3 overflow-hidden border-b px-4 ${headerRows > 1 ? 'flex-wrap py-2' : ''}`}>
      <h2 className="text-primary min-w-0 truncate text-lpd-lg font-semibold leading-tight">{label}</h2>
      {headerSlot ? <div className="flex min-w-0 shrink-0 items-center">{headerSlot}</div> : null}
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
    <div className={`custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden ${contentScrollable ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>{children}</div>
    {shouldRenderFooter && footerContent ? <div className={`border-border-technical min-w-0 shrink-0 border-t p-3 ${footerRows > 1 ? 'flex flex-wrap gap-2' : ''}`}>{footerContent}</div> : null}
  </aside>
  );
};

export * from './types';
