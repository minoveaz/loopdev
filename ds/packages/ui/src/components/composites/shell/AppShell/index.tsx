'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const mobileNavTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
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
    navigationMode,
    scrollbarClass,
    activeOverlay,
  } = useAppShell(props);
  const isTopHeader = props.config?.headerPlacement === 'top';
  const isMobileNavVisible = isViewportReady && isMobileViewport && isMobileNavOpen;

  const closeMobileNav = (reason: 'backdrop' | 'escape' | 'route-change') => {
    setIsMobileNavOpen(false);
    props.onRequestCloseNav?.(reason);
    window.requestAnimationFrame(() => mobileNavTriggerRef.current?.focus());
  };

  const openMobileNav = () => {
    props.onRequestCloseContext?.('route-change');
    setIsMobileNavOpen(true);
  };

  return (
    <div
      style={styleTokens as React.CSSProperties}
      className={`flex h-screen min-h-0 w-full bg-shell-canvas text-slate-900 dark:text-white overflow-hidden max-lg:h-screen max-lg:min-h-0 max-lg:overflow-hidden font-sans text-lpd-sm leading-normal @container transition-colors duration-300 relative ${isNavOpen || isContextOpen ? 'shell-overlay-active' : ''}`}
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
            if (isMobileNavVisible) {
              closeMobileNav('backdrop');
            } else if (activeOverlay === 'context' || (!activeOverlay && isContextOpen)) {
              props.onRequestCloseContext?.('backdrop');
            } else {
              closeMobileNav('backdrop');
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
          className={`group/sidebar-nav
            flex-shrink-0 border-r border-black/5 dark:border-white/5 bg-white dark:bg-background-dark transition-all duration-300 
            overflow-hidden
            ${navigationMode === 'hover' ? '@lg:overflow-visible' : ''}
            fixed left-0 shadow-2xl z-[100]
            ${isMobileViewport ? (isMobileNavVisible ? '!translate-x-0' : '!-translate-x-full') : ''}
            ${isTopHeader ? 'bottom-0' : 'inset-y-0'}
            ${isTopHeader ? '@lg:translate-x-0 @lg:shadow-none' : '@lg:relative @lg:translate-x-0 @lg:shadow-none'}
            ${navMode === 'rail' || navigationMode === 'hover' ? 'select-none' : ''}
          `}
          style={{
            width: isMobileViewport ? 'min(82vw, 320px)' : 'var(--app-shell-nav-width)',
            top: isTopHeader ? 'var(--app-shell-header-height)' : '0px',
            left: isMobileViewport ? (isMobileNavVisible ? '0px' : '-100%') : undefined,
            transform: isMobileViewport ? 'none' : undefined,
            zIndex: isMobileViewport ? 'var(--app-shell-z-context)' : undefined,
          }}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (isMobileViewport && target.closest('[role="menuitem"], button')) {
              closeMobileNav('route-change');
            }
          }}
        >
          <div
            className={`h-full flex flex-col overflow-y-auto ${scrollbarClass} ${navigationMode === 'hover' ? '@lg:overflow-visible' : 'overflow-x-hidden'}`}
          >
              {navSlot}
          </div>
        </nav>
      )}

      {/* 2. RIGHT SECTION */}
      <div
        className={`flex flex-col flex-1 min-w-0 relative ${isTopHeader ? 'w-full' : ''}`}
        style={{
          paddingLeft: isTopHeader && !isMobileViewport ? 'var(--app-shell-nav-width)' : undefined,
          paddingTop: isTopHeader ? 'var(--app-shell-header-height)' : undefined,
        }}
      >
        {bannerSlot && <div className="w-full shrink-0 z-30">{bannerSlot}</div>}

        <header
          role="banner"
          style={{ height: 'var(--app-shell-header-height)' }}
          className={`w-full shrink-0 z-[var(--app-shell-z-header)] select-none ${isTopHeader ? 'fixed left-0 right-0 top-0' : 'relative'}`}
        >
          {navSlot && !mobileBottomSlot && (
            <button
              type="button"
              ref={mobileNavTriggerRef}
              aria-label={isMobileNavVisible ? 'Close navigation' : 'Toggle navigation'}
              title={isMobileNavVisible ? 'Close navigation' : 'Toggle navigation'}
              aria-expanded={isMobileNavVisible}
              aria-controls="app-shell-nav"
              onClick={() => {
                if (isMobileNavVisible) {
                  closeMobileNav('escape');
                } else {
                  openMobileNav();
                }
                if (!isMobileViewport && onToggleLeftSidebar) {
                  onToggleLeftSidebar();
                }
              }}
              style={
                isTopHeader
                  ? {
                      top: '0.5rem',
                      transform: 'none',
                    }
                  : undefined
              }
              className="group absolute left-2 top-1/2 z-[var(--app-shell-z-overlay)] flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-300 dark:hover:bg-primary/10 min-[1025px]:hidden"
            >
              <span className="material-symbols-outlined !text-slate-500 text-[22px] dark:!text-slate-300" aria-hidden="true">
                {isMobileNavVisible ? 'close' : 'menu'}
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
            className={`min-h-0 min-w-0 w-full max-w-full flex-1 overflow-hidden max-lg:h-full max-lg:overflow-x-hidden max-lg:overflow-y-hidden relative ${isMobileNavVisible || isContextOpen ? 'z-0 max-lg:pointer-events-none max-lg:overflow-hidden' : 'z-10'} flex flex-col ${mobileBottomSlot ? 'pb-16' : 'pb-0'} lg:pb-0`}
          >
            {children}
          </main>

          {/* CONTEXT PANEL */}
          {isContextRendered && (
            <aside
              id="app-shell-context"
              role="complementary"
              aria-label="Context Panel"
              style={
                isMobileViewport
                  ? {
                      width: '100vw',
                      position: 'fixed',
                      left: 0,
                      right: 0,
                      top: 'var(--app-shell-header-height)',
                      bottom: 0,
                    }
                  : { width: 'var(--app-shell-context-width)' }
              }
              className={`
                border-l border-black/5 dark:border-white/5 bg-white dark:bg-background-dark flex-shrink-0 overflow-y-auto ${scrollbarClass} 
                transition-all duration-300 z-[var(--app-shell-z-context)] overflow-hidden
                absolute right-0 inset-y-0 shadow-2xl
                ${isContextOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                max-lg:border-l-0 max-lg:w-full
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
          className={`fixed inset-x-0 bottom-0 ${isMobileNavVisible ? 'z-[var(--app-shell-z-backdrop)]' : 'z-[var(--app-shell-z-header)]'} border-t border-black/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-background-dark/95 lg:hidden`}
        >
          {typeof mobileBottomSlot === 'function'
            ? mobileBottomSlot(openMobileNav)
            : mobileBottomSlot}
        </nav>
      )}
    </div>
  );
};
