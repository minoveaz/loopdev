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
    isLeftSidebarOpen: true,
    isRightSidebarOpen: true,
  }} = props;

  const { context = 'normal' } = config;

  // Lógica de visibilidad centralizada
  const isNavVisible = !!props.navSlot && (config.isLeftSidebarOpen || context !== 'inmersive');
  const isContextVisible = !!props.contextSlot && config.isRightSidebarOpen;
  const isNavCollapsed = !config.isLeftSidebarOpen;

  // Cálculo de variables de CSS (Tokens de Componente)
  const styleTokens = useMemo(() => ({
    '--app-shell-nav-width': config.isLeftSidebarOpen ? 'var(--lpd-space-64)' : (isNavVisible ? 'var(--lpd-space-16)' : 'var(--lpd-space-0)'),
    '--app-shell-context-width': isContextVisible ? 'var(--lpd-space-80)' : 'var(--lpd-space-0)',
    '--app-shell-header-height': 'var(--lpd-space-16)',
    '--app-shell-footer-height': 'var(--lpd-space-10)',
  }), [config.isLeftSidebarOpen, isNavVisible, isContextVisible]);

  return {
    styleTokens,
    isNavVisible,
    isContextVisible,
    isNavCollapsed,
    context
  };
};
