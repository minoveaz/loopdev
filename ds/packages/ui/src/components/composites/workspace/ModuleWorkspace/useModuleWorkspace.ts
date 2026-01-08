'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ModuleWorkspaceProps, Panel, CloseReason } from './types';
import { useLayout } from '../../../../providers/layout-provider';

/**
 * @hook useModuleWorkspace
 * @description Cerebro industrial del espacio de trabajo de nivel 2.
 * Gestiona estados de paneles, modos de visualización y tokens de CSS reactivos.
 */
export const useModuleWorkspace = (props: ModuleWorkspaceProps) => {
  const { 
    moduleId,
    mode = 'normal',
    density = 'comfortable',
    config = {},
    overlay = {},
    sidebarOpen: controlledSidebarOpen,
    inspectorOpen: controlledInspectorOpen,
    onSidebarChange,
    onInspectorChange,
    onRequestClose,
    isMobile: manualIsMobile,
    headerSlot,
    toolbarSlot,
    sidebarSlot,
    inspectorSlot
  } = props;

  const { setSidebarVariant } = useLayout();

  // 1. Configuración de Dimensiones Industriales (v3.9)
  const {
    sidebarWidth = '280px',
    inspectorWidth = '320px',
    sidebarOverlayWidth = 'min(300px, 85vw)',
    inspectorOverlayWidth = 'min(320px, 85vw)',
    headerHeight = '48px',
    toolbarHeight = '44px',
    zBackdrop = 40,
    zPanel = 50,
    zPanelTop = 60,
    scrollbars = 'auto'
  } = config;

  const {
    breakpoint = '1024px',
    closeOnBackdrop = true,
    closeOnEscape = true,
    force = false
  } = overlay;

  // 2. Detección Responsiva Determinista
  const [isOverlayModeInternal, setIsOverlayModeInternal] = useState(false);
  const isOverlayMode = force || manualIsMobile === true || isOverlayModeInternal;

  useEffect(() => {
    if (force || manualIsMobile !== undefined) return;
    
    const mql = window.matchMedia(`(max-width: ${breakpoint})`);
    const onChange = (e: MediaQueryListEvent) => setIsOverlayModeInternal(e.matches);
    
    setIsOverlayModeInternal(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint, force, manualIsMobile]);

  // 3. Gestión de Estados (Controlado vs No Controlado)
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(true);
  const [internalInspectorOpen, setInternalInspectorOpen] = useState(false);

  const isSidebarOpen = controlledSidebarOpen !== undefined ? controlledSidebarOpen : internalSidebarOpen;
  const isInspectorOpen = controlledInspectorOpen !== undefined ? controlledInspectorOpen : internalInspectorOpen;

  // 4. Sincronización de Modos (Focus/Immersive -> Close Panels)
  useEffect(() => {
    // Si entramos en modo focus o immersive, debemos cerrar los paneles si no son controlados
    // Si son controlados, el consumidor es responsable, pero podemos emitir el evento de cierre.
    if (mode === 'focus' || mode === 'immersive') {
      if (controlledSidebarOpen === undefined) setInternalSidebarOpen(false);
      onSidebarChange?.(false);

      if (controlledInspectorOpen === undefined) setInternalInspectorOpen(false);
      onInspectorChange?.(false);
    }
  }, [mode, controlledSidebarOpen, controlledInspectorOpen, onSidebarChange, onInspectorChange]);

  // Lógica de Modos de Visualización (Focus Hierarchy) - Global Shell
  useEffect(() => {
    if (mode === 'normal' || mode === 'focus') {
      setSidebarVariant('collapsed');
    }
    // El modo inmersivo se encarga de ocultar todo (implementado en el Body)
  }, [mode, setSidebarVariant]);

  // Handler de cierre unificado
  const requestClosePanel = useCallback((panel: Panel, reason: CloseReason) => {
    onRequestClose?.(panel, reason);
    
    if (panel === 'sidebar') {
      if (controlledSidebarOpen === undefined) setInternalSidebarOpen(false);
      onSidebarChange?.(false);
    } else {
      if (controlledInspectorOpen === undefined) setInternalInspectorOpen(false);
      onInspectorChange?.(false);
    }
  }, [onRequestClose, onSidebarChange, onInspectorChange, controlledSidebarOpen, controlledInspectorOpen]);

  // Handler de apertura unificado (para overlays)
  const requestOpenPanel = useCallback((panel: Panel) => {
    if (panel === 'sidebar') {
      if (controlledSidebarOpen === undefined) setInternalSidebarOpen(true);
      onSidebarChange?.(true);
    } else {
      if (controlledInspectorOpen === undefined) setInternalInspectorOpen(true);
      onInspectorChange?.(true);
    }
  }, [onSidebarChange, onInspectorChange, controlledSidebarOpen, controlledInspectorOpen]);

  // Centralización de Prioridad (Topmost Logic)
  const activeOverlayPanel = useMemo((): Panel | null => {
    if (!isOverlayMode) return null;
    // Prioridad industrial: Inspector > Sidebar
    if (inspectorSlot && isInspectorOpen) return 'inspector';
    if (sidebarSlot && isSidebarOpen) return 'sidebar';
    return null;
  }, [isOverlayMode, isInspectorOpen, isSidebarOpen, inspectorSlot, sidebarSlot]);

  // 5. Generación de CSS Tokens (Zero Hardcoding)
  const styleTokens = useMemo(() => {
    const isCompact = density === 'compact';
    const isImmersive = mode === 'immersive';
    // Nota: Ya no forzamos 'false' aquí visualmente porque hemos sincronizado el estado lógico arriba.
    
    return {
      '--lpd-workspace-sidebar-w': isSidebarOpen ? sidebarWidth : '0px',
      '--lpd-workspace-sidebar-overlay-w': sidebarOverlayWidth,
      '--lpd-workspace-inspector-w': isInspectorOpen ? inspectorWidth : '0px',
      '--lpd-workspace-inspector-overlay-w': inspectorOverlayWidth,
      '--lpd-workspace-header-h': props.headerSlot && !isImmersive ? headerHeight : '0px',
      '--lpd-workspace-toolbar-h': props.toolbarSlot && !isImmersive ? toolbarHeight : '0px',
      '--lpd-workspace-main-padding': isCompact ? 'var(--lpd-space-4)' : 'var(--lpd-space-8)',
      '--lpd-workspace-z-backdrop': String(zBackdrop),
      '--lpd-workspace-z-panel': String(zPanel),
      '--lpd-workspace-z-panel-top': String(zPanelTop),
    } as React.CSSProperties;
  }, [
    isSidebarOpen, isInspectorOpen, headerSlot, toolbarSlot, 
    mode, sidebarWidth, sidebarOverlayWidth, 
    inspectorWidth, inspectorOverlayWidth, headerHeight, toolbarHeight, 
    density, zBackdrop, zPanel, zPanelTop
  ]);

  return {
    isSidebarOpen,
    isInspectorOpen,
    isOverlayMode,
    activeOverlayPanel,
    styleTokens,
    scrollbarClass: scrollbars === 'hidden' ? 'scrollbar-hide' : 'custom-scrollbar',
    hasSidebar: !!sidebarSlot,
    hasInspector: !!inspectorSlot,
    hasHeader: !!headerSlot,
    hasToolbar: !!toolbarSlot,
    requestClosePanel,
    requestOpenPanel,
    setInternalSidebarOpen,
    setInternalInspectorOpen,
    closeOnBackdrop,
    closeOnEscape
  };
};