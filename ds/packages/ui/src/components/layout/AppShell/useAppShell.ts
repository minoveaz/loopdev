'use client';

import React, { useMemo } from 'react';
import { AppShellProps } from './types';

/**
 * @hook useAppShell
 * @description Lógica de infraestructura para el chasis OS.
 * Maneja dimensiones dinámicas y estados de visibilidad híbridos.
 */
export const useAppShell = (props: AppShellProps) => {
  const { config = {
    context: 'normal',
    density: 'comfortable',
    isLeftSidebarOpen: true,
    isRightSidebarOpen: true,
    showScrollbars: true,
  }} = props;

  const { 
    context = 'normal', 
    density = 'comfortable',
    showScrollbars = true 
  } = config;

  // Lógica de visibilidad centralizada
  const isNavVisible = !!props.navSlot && (config.isLeftSidebarOpen || context !== 'inmersive');
  const isContextVisible = !!props.contextSlot && config.isRightSidebarOpen;
  const isNavCollapsed = !config.isLeftSidebarOpen;

  // Clase de scroll dinámica
  const scrollbarClass = showScrollbars ? 'custom-scrollbar' : 'scrollbar-hide';

  // Cálculo de variables de CSS (Tokens de Componente)
  const styleTokens = useMemo(() => {
    const isCompact = density === 'compact';
    
    return {
      '--app-shell-nav-width': config.isLeftSidebarOpen ? 'var(--lpd-space-64)' : (isNavVisible ? 'var(--lpd-space-16)' : 'var(--lpd-space-0)'),
      '--app-shell-context-width': isContextVisible ? 'var(--lpd-space-80)' : 'var(--lpd-space-0)',
      '--app-shell-header-height': isCompact ? 'var(--lpd-space-12)' : 'var(--lpd-space-16)',
      '--app-shell-footer-height': isCompact ? 'var(--lpd-space-8)' : 'var(--lpd-space-10)',
      '--app-shell-main-padding': isCompact ? 'var(--lpd-space-4)' : 'var(--lpd-space-8)',
    };
  }, [config.isLeftSidebarOpen, isNavVisible, isContextVisible, density]);

  return {
    styleTokens,
    isNavVisible,
    isContextVisible,
    isNavCollapsed,
    context,
    scrollbarClass
  };
};
