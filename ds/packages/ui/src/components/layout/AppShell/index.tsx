'use client';

import React from 'react';
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
    onToggleLeftSidebar,
    onToggleRightSidebar
  } = props;

  const { 
    styleTokens, 
    isNavRendered, 
    isContextRendered,
    isNavOpen,
    isContextOpen,
    navMode,
    scrollbarClass,
    activeOverlay
  } = useAppShell(props);

  return (
    <div 
      style={styleTokens as React.CSSProperties}
      className={`flex h-screen w-full bg-white dark:bg-laboratory text-slate-900 dark:text-white overflow-hidden font-sans @container transition-colors duration-300 relative ${isNavOpen || isContextOpen ? 'shell-overlay-active' : ''}`}
    >
      {/* Accesibilidad: Primer elemento del DOM para navegación por teclado */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-[5000] shadow-2xl font-bold uppercase text-[10px] tracking-widest"
      >
        Skip to main content
      </a>

      {/* 0. BACKDROP */}
      {(isNavOpen || isContextOpen) && (
        <div 
          role="presentation"
          aria-hidden="true"
          onClick={() => {
            if (activeOverlay === 'context' || (!activeOverlay && isContextOpen)) {
              props.onRequestCloseContext?.('backdrop');
            } else {
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
            absolute inset-y-0 left-0 shadow-2xl z-[var(--app-shell-z-nav)]
            ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}
            @lg:relative @lg:translate-x-0 @lg:shadow-none @lg:z-10
            ${navMode === 'rail' ? 'select-none' : ''}
          `}
          style={{ width: 'var(--app-shell-nav-width)' }}
        >
          <div className={`h-full flex flex-col overflow-y-auto ${scrollbarClass} overflow-x-hidden`}>
            {navSlot}
          </div>
        </nav>
      )}

      {/* 2. RIGHT SECTION */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {bannerSlot && <div className="w-full shrink-0 z-30">{bannerSlot}</div>}

        <header 
          role="banner"
          style={{ height: 'var(--app-shell-header-height)' }}
          className="w-full shrink-0 relative z-[var(--app-shell-z-header)] select-none"
        >
          {headerSlot}
        </header>

        <div className="flex flex-1 min-h-0 overflow-hidden relative bg-white dark:bg-background-dark">
          <main 
            id="main-content"
            role="main" 
            className={`flex-1 overflow-y-auto ${scrollbarClass} relative z-10 ${(isNavOpen || isContextOpen) ? '@max-lg:pointer-events-none @max-lg:overflow-hidden' : ''}`}
          >
            <div style={{ padding: 'var(--app-shell-main-padding)' }}>
              {children}
            </div>
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
    </div>
  );
};