import { ReactNode } from 'react';

export type LayoutContext = 'normal' | 'focus' | 'inmersive';
export type LayoutDensity = 'comfortable' | 'compact';

export interface AppShellProps {
  /** Slot para el Sidebar Izquierdo (Global Nav) - Altura completa */
  navSlot: ReactNode;
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
  };

  /** Handlers de interacción del chasis */
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
}