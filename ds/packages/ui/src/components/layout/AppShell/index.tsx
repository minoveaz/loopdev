import React from 'react';
import { AppShellProps } from './types';
import { useAppShell } from './useAppShell';

/**
 * @component AppShell
 * @category Layouts
 * @version 1.0.0
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
    isNavVisible, 
    isContextVisible, 
  } = useAppShell(props);

  return (
    <div 
      style={styleTokens as React.CSSProperties}
      className="flex h-screen w-full bg-[var(--lpd-color-bg-base)] dark:bg-[var(--lpd-color-bg-space)] text-[var(--lpd-color-text-base)] overflow-hidden font-sans select-none @container transition-colors duration-300 relative"
    >
      {/* 0. BACKDROP */}
      {(isNavVisible || isContextVisible) && (
        <div 
          role="presentation"
          aria-hidden="true"
          onClick={() => {
            if (props.config?.isLeftSidebarOpen) onToggleLeftSidebar?.();
            if (props.config?.isRightSidebarOpen) onToggleRightSidebar?.();
          }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[35] @lg:hidden animate-in fade-in duration-300 pointer-events-auto"
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      {isNavVisible && (
        <aside 
          role="navigation"
          aria-label="Global Navigation"
          className={`
            flex-shrink-0 border-r border-[var(--lpd-color-brand-outline)] dark:border-[var(--lpd-color-border-glass)] bg-[var(--lpd-color-bg-surface)] dark:bg-[var(--lpd-color-bg-space)] transition-all duration-300 
            overflow-hidden 
            
            /* Mobile/Tablet: OVERLAY */
            absolute inset-y-0 left-0 shadow-2xl z-[45]
            ${props.config?.isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            
            /* Desktop: PUSH */
            @lg:relative @lg:translate-x-0 @lg:shadow-none @lg:z-10
          `}
          style={{ width: 'var(--app-shell-nav-width)' }}
        >
          <div className="h-full flex flex-col overflow-y-auto custom-scrollbar overflow-x-hidden">
            {navSlot}
          </div>
        </aside>
      )}

      {/* 2. RIGHT SECTION */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {bannerSlot && <div className="w-full shrink-0 z-30">{bannerSlot}</div>}

        <header 
          role="banner"
          style={{ height: 'var(--app-shell-header-height)' }}
          className="w-full border-b border-[var(--lpd-color-brand-outline)] dark:border-[var(--lpd-color-border-glass)] flex items-center px-6 bg-[var(--lpd-color-bg-surface)]/80 dark:bg-[var(--lpd-color-bg-space)]/80 backdrop-blur-md shrink-0 relative z-20"
        >
          {headerSlot}
        </header>

        <div className="flex flex-1 min-h-0 overflow-hidden relative bg-[var(--lpd-color-bg-subtle)] dark:bg-[var(--lpd-color-bg-space)]">
          <main role="main" className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            <div className="p-4 @lg:p-8">
              {children}
            </div>
          </main>

          {/* CONTEXT PANEL */}
          {contextSlot && (
            <aside 
              role="complementary"
              aria-label="Context Panel"
              style={{ width: 'var(--app-shell-context-width)' }}
              className={`
                border-l border-[var(--lpd-color-brand-outline)] dark:border-[var(--lpd-color-border-glass)] bg-[var(--lpd-color-bg-surface)] dark:bg-[var(--lpd-color-bg-space)] flex-shrink-0 overflow-y-auto custom-scrollbar 
                transition-all duration-300 z-[45] overflow-hidden
                
                /* Mobile/Tablet: OVERLAY */
                absolute right-0 inset-y-0 shadow-2xl
                ${isContextVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}

                /* Desktop: PUSH */
                @lg:relative @lg:translate-x-0 @lg:opacity-100 @lg:shadow-none @lg:z-10
              `}
            >
              <div className="w-80">
                {contextSlot}
              </div>
            </aside>
          )}
        </div>

        {footerSlot && (
          <footer 
            role="contentinfo"
            style={{ height: 'var(--app-shell-footer-height)' }}
            className="border-t border-[var(--lpd-color-brand-outline)] dark:border-[var(--lpd-color-border-glass)] bg-[var(--lpd-color-bg-surface)] dark:bg-[var(--lpd-color-bg-space)] shrink-0 flex items-center px-4 z-20"
          >
            {footerSlot}
          </footer>
        )}
      </div>

      <div className="pointer-events-none fixed inset-0 z-[100]">
        {overlaySlot}
      </div>
    </div>
  );
};
