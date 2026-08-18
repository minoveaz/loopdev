import {
  NavigationSchema,
  NavMode,
  AccessMap,
  TelemetryMap,
  NavRouteRef,
  LayoutContext, // Importamos el tipo de contexto oficial
} from '@loopdev/contracts';
import type { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de propiedades para el componente SuiteSidebar.
 */

export interface SuiteSidebarProps {
  /** Esquema completo de navegación de la suite */
  schema: NavigationSchema;
  /** Modo actual del Sidebar (controlado por AppShell) */
  navMode: NavMode;
  /** Fuerza el contenido expandido cuando el sidebar se usa como drawer mobile */
  mobileMode?: boolean;
  /** Contexto de enfoque global de la aplicación */
  context?: LayoutContext;
  /** ID del módulo activo (para Momentum y Focus) */
  activeModuleId?: string;
  /** Mapa de permisos en tiempo real */
  accessMap: AccessMap;
  /** Mapa de telemetría para badges */
  telemetry?: TelemetryMap;
  /** Callback para seleccionar Expanded, Collapsed o Expand on hover */
  onNavModeChange?: (mode: Exclude<NavMode, 'hidden'>) => void;
  /** Callback genérico de navegación */
  onNavigate: (route: NavRouteRef) => void;
  contextualAction?: SuiteSidebarContextualAction | ReactNode | ((isRail: boolean) => ReactNode);
  /** Acciones secundarias que viven al final del drawer móvil. */
  mobileActions?: ReactNode;

  /** Clase CSS adicional */
  className?: string;
}

export interface SuiteSidebarContextualAction {
  type: 'contextual-action';
  icon: string;
  label: string;
  actionId: string;
  onAction: () => void;
}
