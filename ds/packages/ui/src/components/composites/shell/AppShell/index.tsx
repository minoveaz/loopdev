'use client';

import React, { useEffect, useState } from 'react';
import { AppShellProps } from './types';
import { useAppShell } from './useAppShell';

/**
 * @component AppShell
 * @category Layouts
 * @version 1.1.0
 * @description Chasis Industrial de la plataforma LoopDev OS.
 * Implementa la jerarquía asimétrica y comportamiento híbrido Push/Overlay con semántica ARIA.
 */
export const AppShell: React.FC<AppShellProps> = (props) => {
  const {
    navSlot,
    headerSlot,
    children,
    contextSlot,
    overlaySlot,
    bannerSlot,
    footerSlot,
    mobileBottomSlot,
    onToggleLeftSidebar,
    onToggleRightSidebar,
  } = props;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isViewportReady, setIsViewportReady] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      setIsViewportReady(true);
    };
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);
  const {
    styleTokens,
    isNavRendered,
    isContextRendered,
    isNavOpen,
    isContextOpen,
    navMode,
    scrollbarClass,
    activeOverlay,
  } = useAppShell(props);
  const isMobileNavVisible = isViewportReady && isMobileViewport && isMobileNavOpen;

  return (
    <div
      style={styleTokens as React.CSSProperties}
      className={`flex h-screen w-full bg-shell-canvas text-slate-900 dark:text-white overflow-hidden font-sans @container transition-colors duration-300 relative ${isNavOpen || isContextOpen ? 'shell-overlay-active' : ''}`}
    >
      {/* Accesibilidad: Primer elemento del DOM para navegación por teclado */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-[5000] shadow-2xl font-bold uppercase text-[10px] tracking-widest"
      >
        Skip to main content
      </a>

      {/* 0. BACKDROP */}
      {((isMobileViewport ? isMobileNavVisible : isNavOpen) || isContextOpen) && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={() => {
            if (activeOverlay === 'context' || (!activeOverlay && isContextOpen)) {
              props.onRequestCloseContext?.('backdrop');
            } else {
              if (window.matchMedia?.('(max-width: 1023px)').matches) {
                setIsMobileNavOpen(false);
              }
              props.onRequestCloseNav?.('backdrop');
            }
          }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[var(--app-shell-z-backdrop)] @lg:hidden animate-in fade-in duration-300 pointer-events-auto"
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      {isNavRendered && (
        <nav
          id="app-shell-nav"
          aria-label="Global Navigation"
          className={`
            flex-shrink-0 border-r border-black/5 dark:border-white/5 bg-white dark:bg-background-dark transition-all duration-300 
            overflow-hidden 
            fixed inset-y-0 left-0 shadow-2xl z-[100]
            ${isMobileNavVisible ? 'translate-x-0' : '-translate-x-full'}
            @lg:relative @lg:translate-x-0 @lg:shadow-none @lg:z-10
            ${navMode === 'rail' ? 'select-none' : ''}
          `}
          style={{
            width: isMobileViewport ? 'min(82vw, 320px)' : 'var(--app-shell-nav-width)',
            zIndex: isMobileViewport ? 100 : undefined,
          }}
        >
          <div
            className={`h-full flex flex-col overflow-y-auto ${scrollbarClass} overflow-x-hidden`}
          >
            {navSlot}
          </div>
        </nav>
      )}

      {isMobileViewport && isMobileNavVisible && isNavRendered && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileNavOpen(false)}
          style={{ pointerEvents: 'auto', zIndex: 5000 }}
          className="fixed left-[calc(min(82vw,320px)-48px)] top-3 z-[200] flex size-9 items-center justify-center rounded-md bg-white/90 text-slate-600 shadow-sm dark:bg-background-dark/90 dark:text-slate-300 lg:hidden"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            close
          </span>
        </button>
      )}

      {/* 2. RIGHT SECTION */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {bannerSlot && <div className="w-full shrink-0 z-30">{bannerSlot}</div>}

        <header
          role="banner"
          style={{ height: 'var(--app-shell-header-height)' }}
          className="w-full shrink-0 relative z-[var(--app-shell-z-header)] select-none"
        >
          {navSlot && onToggleLeftSidebar && !mobileBottomSlot && (
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={isMobileNavVisible}
              aria-controls="app-shell-nav"
              onClick={() => {
                setIsMobileNavOpen((open) => !open);
                if (!isMobileViewport) {
                  onToggleLeftSidebar();
                }
              }}
              className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                menu
              </span>
            </button>
          )}
          {headerSlot}
        </header>

        <div className="flex flex-1 min-h-0 overflow-hidden relative bg-shell-canvas">
          <main
            id="main-content"
            role="main"
            style={{
              pointerEvents: isMobileNavVisible || isContextOpen ? 'none' : undefined,
            }}
            className={`flex-1 overflow-hidden relative ${isMobileNavVisible || isContextOpen ? 'z-0 max-lg:pointer-events-none max-lg:overflow-hidden' : 'z-10'} flex flex-col pb-16 lg:pb-0`}
          >
            {children}
          </main>

          {/* CONTEXT PANEL */}
          {isContextRendered && (
            <aside
              id="app-shell-context"
              role="complementary"
              aria-label="Context Panel"
              style={{ width: 'var(--app-shell-context-width)' }}
              className={`
                border-l border-black/5 dark:border-white/5 bg-white dark:bg-background-dark flex-shrink-0 overflow-y-auto ${scrollbarClass} 
                transition-all duration-300 z-[var(--app-shell-z-context)] overflow-hidden
                absolute right-0 inset-y-0 shadow-2xl
                ${isContextOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                @lg:relative @lg:translate-x-0 @lg:opacity-100 @lg:shadow-none @lg:z-10
              `}
            >
              {contextSlot}
            </aside>
          )}
        </div>

        {footerSlot && (
          <footer
            role="contentinfo"
            style={{ height: 'var(--app-shell-footer-height)' }}
            className="border-t border-black/5 dark:border-white/5 bg-white dark:bg-background-dark shrink-0 flex items-center px-4 z-[var(--app-shell-z-header)] select-none"
          >
            {footerSlot}
          </footer>
        )}
      </div>

      <div className="fixed inset-0 z-[var(--app-shell-z-overlay)] pointer-events-none [&>*]:pointer-events-auto">
        {overlaySlot}
      </div>

      {mobileBottomSlot && (
        <nav
          aria-label="Mobile suite navigation"
          className="fixed inset-x-0 bottom-0 z-[var(--app-shell-z-header)] border-t border-black/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-background-dark/95 lg:hidden"
        >
          {typeof mobileBottomSlot === 'function'
            ? mobileBottomSlot(() => setIsMobileNavOpen(true))
            : mobileBottomSlot}
        </nav>
      )}
    </div>
  );
};
