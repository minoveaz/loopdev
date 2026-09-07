'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ModuleContextPanelProps } from './types';

const widthClasses = {
  narrow: 'w-56',
  standard: 'w-72',
  wide: 'w-80',
  'extra-wide': 'w-[26rem]',
  drawer: 'w-full sm:max-w-md md:max-w-lg',
  'drawer-wide': 'w-full sm:max-w-lg md:max-w-2xl',
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

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!visible) return null;

  const isOverlay = presentation === 'overlay';

  const panelMarkup = (
    <>
      {/* 1. Backdrop Overlay (Untitled UI Slide-Over Pattern) */}
      {isOverlay && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* 2. Slide-Over Panel Chassis */}
      <aside
        aria-label={label}
        data-testid="module-context-panel"
        data-width={width}
        data-presentation={presentation}
        data-content-scrollable={contentScrollable}
        className={`border-border-subtle bg-white dark:bg-surface-dark flex min-h-0 flex-col overflow-hidden border-l ${
          isOverlay
            ? `fixed inset-y-0 right-0 z-50 h-full max-w-full shadow-2xl animate-in slide-in-from-right duration-300 ease-out shadow-[-4px_0_16px_rgba(15,23,42,0.08)] ${widthClasses[width]}`
            : `z-30 h-full shrink-0 self-stretch max-lg:absolute max-lg:inset-0 max-lg:z-50 max-lg:h-full max-lg:w-full max-lg:border-b max-lg:border-l-0 ${widthClasses[width]}`
        } ${className}`}
      >
        {/* Header with iOS native pattern on mobile and Untitled UI on desktop */}
        <div
          className={`border-border-subtle bg-slate-50/70 dark:bg-white/5 flex min-h-14 min-w-0 shrink-0 items-center justify-between gap-3 overflow-hidden border-b px-4 sm:px-5 py-3 ${
            headerRows > 1 ? 'flex-wrap' : ''
          }`}
        >
          {/* 1. Mobile iOS Navigation Bar (< sm) */}
          <div className="flex sm:hidden w-full items-center justify-between">
            {onClose ? (
              <button
                type="button"
                aria-label={`Cancel ${label}`}
                onClick={onClose}
                className="text-primary text-sm font-medium hover:opacity-70 active:opacity-40 transition-opacity py-1 px-0.5"
              >
                Cancelar
              </button>
            ) : (
              <div className="w-14" />
            )}

            <h2 className="text-text-main truncate text-sm font-semibold tracking-tight text-center px-2">
              {label}
            </h2>

            {headerSlot ? (
              <div className="flex items-center justify-end">{headerSlot}</div>
            ) : (
              <div className="w-14" />
            )}
          </div>

          {/* 2. Desktop Layout (>= sm) */}
          <div className="hidden sm:flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <h2 className="text-text-main min-w-0 truncate text-sm font-semibold tracking-tight">
                {label}
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {headerSlot ? <div className="flex min-w-0 shrink-0 items-center">{headerSlot}</div> : null}
              {onClose ? (
                <button
                  type="button"
                  aria-label={`Close ${label}`}
                  onClick={onClose}
                  className="text-text-muted hover:bg-slate-100 dark:hover:bg-white/10 hover:text-text-main focus-visible:ring-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-subtle/80 bg-white dark:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:ring-2"
                >
                  <X size={15} strokeWidth={1.75} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div
          className={`custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden p-5 ${
            contentScrollable ? 'overflow-y-auto' : 'overflow-y-hidden'
          }`}
        >
          {children}
        </div>

        {/* Footer with Untitled UI actions bar */}
        {shouldRenderFooter && footerContent ? (
          <div
            className={`border-border-subtle bg-slate-50/70 dark:bg-white/5 min-w-0 shrink-0 border-t p-4 ${
              footerRows > 1 ? 'flex flex-wrap gap-2' : ''
            }`}
          >
            {footerContent}
          </div>
        ) : null}
      </aside>
    </>
  );

  if (isOverlay && mounted && typeof document !== 'undefined') {
    return createPortal(panelMarkup, document.body);
  }

  return panelMarkup;
};

export * from './types';
