import { ReactNode } from 'react';

export type LayoutContext = 'normal' | 'focus' | 'inmersive';
export type LayoutDensity = 'comfortable' | 'compact';

export interface AppShellProps {
  /** Slot para el Sidebar Izquierdo (Global Nav) - Altura completa */
  navSlot?: ReactNode;
  /** Slot para el Header Global - Parte superior derecha */
  headerSlot: ReactNode;
  /** Slot para el contenido principal (Canvas) */
  children: ReactNode;
  /** Slot para el Panel de Contexto (Antiguo Inspector) - Bajo el Header */
  contextSlot?: ReactNode;
  /** Slot para elementos de capa superior (Toasts, Modales) */
  overlaySlot?: ReactNode;
  /** Slot para anuncios globales (Mantenimiento, Offline) */
  bannerSlot?: ReactNode;
  /** Slot para la Status Bar inferior */
  footerSlot?: ReactNode;

  /** Configuración de estado visual */
  config?: {
    context?: LayoutContext;
    density?: LayoutDensity;
    isLeftSidebarOpen?: boolean;
    isRightSidebarOpen?: boolean;
    showScrollbars?: boolean;
    /** Comportamiento de la navegación: auto (basado en contexto), always (siempre visible), hidden (forzar oculto) */
    navBehavior?: 'auto' | 'always' | 'hidden';
    /** Comportamiento del panel de contexto */
    contextBehavior?: 'auto' | 'hidden';
    /** Determina qué panel tiene prioridad en modo overlay (mobile) */
    activeOverlay?: 'nav' | 'context' | null;
  };

  /** Handlers de interacción del chasis */
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  /** Callback cuando el sistema solicita cerrar un panel (backdrop, escape, etc) */
  onRequestCloseNav?: (reason: 'backdrop' | 'escape' | 'route-change') => void;
  onRequestCloseContext?: (reason: 'backdrop' | 'escape' | 'route-change') => void;
}