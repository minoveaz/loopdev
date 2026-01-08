import { ReactNode } from 'react';
import { NavRouteRef, ModuleAccessState, NavBadge } from '@loopdev/contracts';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo interactivo NavSidebarItem.
 */

export type NavItemStatus = ModuleAccessState | 'coming-soon';

export interface NavSidebarItemProps {
  /** Nombre del icono (Lucide) */
  icon: string;
  /** Etiqueta de texto del módulo */
  label: string;
  /** Estado de activación del ítem */
  isActive?: boolean;
  /** Modo compacto del sidebar */
  isRail?: boolean;
  /** Estado de acceso y disponibilidad */
  status?: NavItemStatus;
  /** Datos de telemetría (badges) */
  telemetry?: NavBadge;
  /** Color de acento de la suite para el indicador lateral */
  accentColor?: string;
  
  /** Callback de navegación */
  onNavigate?: (route: NavRouteRef) => void;
  /** Acción específica (si no es navegación de módulo) */
  onAction?: (actionId: string) => void;
  /** Referencia de ruta para el callback */
  route?: NavRouteRef;
  /** ID de acción para el callback */
  actionId?: string;
  
  /** Clase CSS adicional */
  className?: string;
}
