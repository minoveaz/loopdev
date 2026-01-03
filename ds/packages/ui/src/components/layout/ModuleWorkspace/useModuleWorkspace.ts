'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ModuleWorkspaceProps, Panel, CloseReason } from './types';

/**
 * @hook useModuleWorkspace
 * @description Cerebro Industrial v1.3.0. 
 * Implementa determinismo, gestión de topmost panel y tokenización completa.
 */
export const useModuleWorkspace = (props: ModuleWorkspaceProps) => {
  const { 
    config = {}, 
    layout = 'default', 
    mode, // compatibility mapping
    density = 'comfortable',
    overlay = {} 
  } = props;

  // 1. Configuración de Tokens por defecto
  const {
    sidebarWidth = '280px',
    inspectorWidth = '320px',
    sidebarOverlayWidth = 'min(300px, 85vw)',
    inspectorOverlayWidth = 'min(320px, 85vw)',
    toolbarHeight = '48px',
    headerHeight = '64px',
    scrollbars = 'auto',
    zBackdrop = 40,
    zPanel = 50,
    zPanelTop = 60
  } = config;

  const {
    breakpoint = '1024px',
    closeOnBackdrop = true,
    closeOnEscape = true,
    force = false
  } = overlay;

  // 2. Detección de Breakpoint Determinista
  const [isOverlayModeInternal, setIsOverlayModeInternal] = useState(false);
  const isOverlayMode = force || props.isMobile === true || isOverlayModeInternal;

  useEffect(() => {
    if (force || props.isMobile !== undefined) return;
    
    const mql = window.matchMedia(`(max-width: ${breakpoint})`);
    const onChange = (e: MediaQueryListEvent) => setIsOverlayModeInternal(e.matches);
    
    setIsOverlayModeInternal(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint, force, props.isMobile]);

  // 3. Gestión de Estados (Controlled vs Uncontrolled)
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(props.defaultSidebarOpen ?? true);
  const [internalInspectorOpen, setInternalInspectorOpen] = useState(props.defaultInspectorOpen ?? false);

  const isSidebarOpen = props.sidebarOpen !== undefined ? props.sidebarOpen : internalSidebarOpen;
  const isInspectorOpen = props.inspectorOpen !== undefined ? props.inspectorOpen : internalInspectorOpen;

  // 4. Centralización de Prioridad (Topmost Logic) - CON RESILIENCIA
  const activeOverlayPanel = useMemo((): Panel | null => {
    if (!isOverlayMode) return null;
    // Prioridad industrial: Inspector > Sidebar
    if (props.inspectorSlot && isInspectorOpen) return 'inspector';
    if (props.sidebarSlot && isSidebarOpen) return 'sidebar';
    return null;
  }, [isOverlayMode, isInspectorOpen, isSidebarOpen, props.inspectorSlot, props.sidebarSlot]);

  // Handler de cierre unificado con notificación de callbacks
  const requestClosePanel = useCallback((panel: Panel, reason: CloseReason) => {
    props.onRequestClose?.(panel, reason);
    
    if (panel === 'sidebar') {
      if (props.sidebarOpen === undefined) setInternalSidebarOpen(false);
      props.onSidebarOpenChange?.(false);
    } else {
      if (props.inspectorOpen === undefined) setInternalInspectorOpen(false);
      props.onInspectorOpenChange?.(false);
    }
  }, [props.onRequestClose, props.onSidebarOpenChange, props.onInspectorOpenChange, props.sidebarOpen, props.inspectorOpen]);

  // 5. Mapeo de compatibilidad (Agnostic Layout)
  const effectiveLayout = mode === 'focus' ? 'focus' : (mode === 'inmersive' ? 'wide' : layout);

  // 7. Escritura de CSS Tokens (Zero Hardcoding)
  const styleTokens = useMemo(() => {
    const isCompact = density === 'compact';
    
    return {
      '--lpd-workspace-sidebar-w': isSidebarOpen ? sidebarWidth : '0px',
      '--lpd-workspace-sidebar-overlay-w': sidebarOverlayWidth,
      '--lpd-workspace-inspector-w': isInspectorOpen ? inspectorWidth : '0px',
      '--lpd-workspace-inspector-overlay-w': inspectorOverlayWidth,
      '--lpd-workspace-header-h': props.headerSlot ? (mode === 'inmersive' ? '40px' : headerHeight) : '0px',
      '--lpd-workspace-toolbar-h': props.toolbarSlot ? toolbarHeight : '0px',
      '--lpd-workspace-main-padding': isCompact ? 'var(--lpd-space-4)' : 'var(--lpd-space-8)',
      '--lpd-workspace-z-backdrop': String(zBackdrop),
      '--lpd-workspace-z-panel': String(zPanel),
      '--lpd-workspace-z-panel-top': String(zPanelTop),
    } as React.CSSProperties;
  }, [
    isSidebarOpen, isInspectorOpen, props.headerSlot, props.toolbarSlot, 
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
    hasSidebar: !!props.sidebarSlot,
    hasInspector: !!props.inspectorSlot,
    hasHeader: !!props.headerSlot,
    hasToolbar: !!props.toolbarSlot,
    requestClosePanel,
    setInternalSidebarOpen,
    setInternalInspectorOpen
  };
};