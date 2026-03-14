import React from 'react';

/**
 * Modos de visualización soportados por el Workspace.
 * - normal: Todo visible (según configuración).
 * - focus: Paneles laterales colapsados.
 * - immersive: Todo el chrome oculto (Zen mode).
 */
export type WorkspaceMode = 'normal' | 'focus' | 'immersive';

/**
 * Paneles laterales gestionables.
 */
export type Panel = 'sidebar' | 'inspector' | 'flyout';

/**
 * Razón del cierre de un panel (útil para analytics).
 */
export type CloseReason = 'toggle' | 'backdrop' | 'escape' | 'route_change' | 'programmatic';

export interface ModuleWorkspaceProps {
  /** ID único del módulo (ej: 'brand-hub', 'crm-leads') */
  moduleId: string;

  // --- SLOTS (Contenido) ---
  
  /** Cabecera específica del módulo (Breadcrumbs, Título, Acciones primarias) */
  headerSlot?: React.ReactNode;
  
  /** Barra de herramientas operativa del Canvas (Filtros, Vistas) */
  toolbarSlot?: React.ReactNode;
  
  /** Navegación interna del módulo (Izquierda) */
  sidebarSlot?: React.ReactNode;

  /** Panel de contexto semántico (Entre Sidebar y Canvas) */
  flyoutSlot?: React.ReactNode;
  
  /** Panel de propiedades o asistente (Derecha) */
  inspectorSlot?: React.ReactNode;
  
  /** Área de trabajo principal (Canvas) */
  children: React.ReactNode;

  // --- ESTADO (Controlado o No Controlado) ---

  /** Estado de visibilidad del Sidebar */
  sidebarOpen?: boolean;

  /** Estado de visibilidad del Flyout */
  flyoutOpen?: boolean;
  
  /** Estado de visibilidad del Inspector */
  inspectorOpen?: boolean;
  
  /** Callback al cambiar visibilidad del Sidebar */
  onSidebarChange?: (open: boolean) => void;

  /** Callback al cambiar visibilidad del Flyout */
  onFlyoutChange?: (open: boolean) => void;
  
  /** Callback al cambiar visibilidad del Inspector */
  onInspectorChange?: (open: boolean) => void;
  
  /** Callback general de solicitud de cierre (para overlays) */
  onRequestClose?: (panel: Panel, reason: CloseReason) => void;

  // --- CONFIGURACIÓN ---

  /** Modo de foco activo */
  mode?: WorkspaceMode;
  
  /** Densidad del layout */
  density?: 'compact' | 'comfortable';

  /** Forzar modo móvil (útil para dev/test) */
  isMobile?: boolean;

  /** Configuración de accesibilidad */
  a11y?: {
    moduleLabel?: string;
    sidebarLabel?: string;
    flyoutLabel?: string;
    inspectorLabel?: string;
    sidebarDialogLabel?: string;
    inspectorDialogLabel?: string;
  };
  
  /** Configuración visual y de comportamiento */
  config?: {
    sidebarWidth?: string;
    flyoutWidth?: string;
    inspectorWidth?: string;
    sidebarOverlayWidth?: string;
    inspectorOverlayWidth?: string;
    headerHeight?: string;
    toolbarHeight?: string;
    scrollbars?: 'auto' | 'hidden';
    zBackdrop?: number;
    zPanel?: number;
    zPanelTop?: number;
  };
  
  /** Configuración de overlays */
  overlay?: {
    breakpoint?: string;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    force?: boolean;
  };
  
  className?: string;
}