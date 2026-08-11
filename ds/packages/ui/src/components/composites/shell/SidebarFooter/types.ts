import type { NavMode } from '@loopdev/contracts';

/**
 * @file types.ts
 * @description Contratos de tipado para el cierre semántico SidebarFooter.
 */

export interface SidebarFooterProps {
  /** Indica si el sidebar está en modo contraído */
  isRail?: boolean;
  /** Callback para seleccionar el comportamiento persistente del sidebar */
  onNavModeChange?: (mode: Exclude<NavMode, 'hidden'>) => void;
  /** Modo actual del sidebar */
  navMode?: Exclude<NavMode, 'hidden'>;
  /** Mantiene estable el rail mientras el selector está abierto */
  onMenuOpenChange?: (open: boolean) => void;
  /** Expande el sidebar antes de que Radix monte el menú en portal */
  onMenuTrigger?: () => void;
  /** Mantiene expanded el sidebar mientras el cursor está sobre el footer */
  onFooterHoverChange?: (hovered: boolean) => void;
  /** Clase CSS adicional */
  className?: string;
}
