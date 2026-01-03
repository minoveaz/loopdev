'use client';

import React, { useMemo, useEffect } from 'react';
import { AppShellProps } from './types';

export const useAppShell = (props: AppShellProps) => {
  const { config = {} } = props;

  const { 
    context = 'normal', 
    density = 'comfortable',
    showScrollbars = true,
    isLeftSidebarOpen = true,
    isRightSidebarOpen = true,
    navBehavior = 'auto',
    contextBehavior = 'auto',
    activeOverlay = null
  } = config;

  // 1. Determinar Modos de Panel
  const navMode = useMemo(() => {
    if (!props.navSlot || navBehavior === 'hidden') return 'hidden';
    if (isLeftSidebarOpen) return 'open';
    // Modo Rail: Solo si el contexto no es inmersivo o si se fuerza por comportamiento
    if (context !== 'inmersive' || navBehavior === 'always') return 'rail';
    return 'hidden';
  }, [props.navSlot, navBehavior, isLeftSidebarOpen, context]);

  const contextMode = useMemo(() => {
    if (!props.contextSlot || contextBehavior === 'hidden') return 'hidden';
    return isRightSidebarOpen ? 'open' : 'hidden';
  }, [props.contextSlot, contextBehavior, isRightSidebarOpen]);

  // 2. Gestión de Teclado (Escape - Topmost)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const isNavOpenDerived = navMode === 'open';
        const isContextOpenDerived = contextMode === 'open';

        // Prioridad: 1. Context (Topmost), 2. Nav
        if (activeOverlay === 'context' || (!activeOverlay && isContextOpenDerived)) {
          props.onRequestCloseContext?.('escape');
        } else if (activeOverlay === 'nav' || (!activeOverlay && isNavOpenDerived)) {
          props.onRequestCloseNav?.('escape');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navMode, contextMode, activeOverlay, props.onRequestCloseNav, props.onRequestCloseContext]);

  // 3. Clase de scroll dinámica
  const scrollbarClass = showScrollbars ? 'custom-scrollbar' : 'scrollbar-hide';

  // 4. Cálculo de variables de CSS (Tokens Industriales v1.1)
  const styleTokens = useMemo(() => {
    const isCompact = density === 'compact';
    const railWidth = 'var(--lpd-space-16)'; 
    const expandedNavWidth = 'var(--lpd-space-64)';
    const expandedContextWidth = 'var(--lpd-space-80)';

    return {
      '--app-shell-nav-width': navMode === 'open' ? expandedNavWidth : (navMode === 'rail' ? railWidth : '0px'),
      '--app-shell-context-width': contextMode === 'open' ? expandedContextWidth : '0px',
      '--app-shell-header-height': isCompact ? 'var(--lpd-space-12)' : 'var(--lpd-space-16)',
      '--app-shell-footer-height': isCompact ? 'var(--lpd-space-8)' : 'var(--lpd-space-10)',
      '--app-shell-main-padding': isCompact ? 'var(--lpd-space-4)' : 'var(--lpd-space-8)',
      // Z-Indexes Diferenciados
      '--app-shell-z-backdrop': '35',
      '--app-shell-z-nav': '45',
      '--app-shell-z-context': '50', 
      '--app-shell-z-header': '20',
      '--app-shell-z-overlay': '100',
    };
  }, [navMode, contextMode, density]);

  return {
    styleTokens,
    isNavRendered: navMode !== 'hidden',
    isContextRendered: contextMode !== 'hidden',
    isNavOpen: navMode === 'open',
    isContextOpen: contextMode === 'open',
    navMode,
    contextMode,
    context,
    scrollbarClass,
    activeOverlay
  };
};
