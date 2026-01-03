import { ReactNode } from 'react';

/** @deprecated: Use 'layout' for agnostic UI and 'overlay' for behavior */
export type WorkspaceMode = 'normal' | 'focus' | 'inmersive';
export type WorkspaceLayout = 'default' | 'focus' | 'wide';
export type WorkspaceDensity = 'comfortable' | 'compact';
export type CloseReason = 'backdrop' | 'escape' | 'programmatic' | 'route-change';
export type Panel = 'sidebar' | 'inspector';

export interface ModuleWorkspaceProps {
  /** Identificador único del módulo para telemetría y permisos */
  moduleId: string;
  
  /** 
   * Variante de layout agnóstica 
   * 'default': Sidebars visibles
   * 'focus': Sidebars contraídos/minimalistas
   * 'wide': Canvas expandido
   */
  layout?: WorkspaceLayout;

  /** @deprecated: Use 'layout'. Internally mapped for backward compatibility. */
  mode?: WorkspaceMode;

  /** @deprecated: Internally detected via overlay.breakpoint. Use only for lab overrides. */
  isMobile?: boolean;
  
  /** Variante de densidad del contenido */
  density?: WorkspaceDensity;

  /** Slots de Nivel 2 (Específicos del Módulo) */
  headerSlot?: ReactNode;
  sidebarSlot?: ReactNode;
  toolbarSlot?: ReactNode;
  inspectorSlot?: ReactNode;
  /** Contenido principal / Router Outlet */
  children: ReactNode;

  /** Estado Controlado (Opcional) */
  sidebarOpen?: boolean;
  inspectorOpen?: boolean;

  /** Estado No Controlado (Defaults) */
  defaultSidebarOpen?: boolean;
  defaultInspectorOpen?: boolean;

  /** Políticas de comportamiento para paneles en modo overlay */
  overlay?: {
    /** Breakpoint de activación (ej: '1024px') */
    breakpoint?: string;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    /** Forzar comportamiento overlay independientemente del ancho */
    force?: boolean;
  };

  /** Overrides de Tokens CSS (Escritura de variables) */
  config?: {
    sidebarWidth?: string;
    inspectorWidth?: string;
    sidebarOverlayWidth?: string;
    inspectorOverlayWidth?: string;
    toolbarHeight?: string;
    headerHeight?: string;
    scrollbars?: 'auto' | 'hidden' | 'visible';
    /** Custom Z-index scale */
    zBackdrop?: number;
    zPanel?: number;
    zPanelTop?: number;
  };

  /** Callbacks de estado e interacción */
  onSidebarOpenChange?: (open: boolean) => void;
  onInspectorOpenChange?: (open: boolean) => void;
  onRequestClose?: (panel: Panel, reason: CloseReason) => void;

  /** Accesibilidad y Etiquetas ARIA */
  a11y?: {
    moduleLabel?: string;
    sidebarLabel?: string;
    inspectorLabel?: string;
    toolbarLabel?: string;
    /** Labels específicos para cuando actúan como diálogos (modal) */
    sidebarDialogLabel?: string;
    inspectorDialogLabel?: string;
  };
}