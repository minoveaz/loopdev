import { ReactNode } from 'react';
import { 
  NavigationSchema, 
  NavMode, 
  AccessMap, 
  TelemetryMap, 
  NavRouteRef 
} from '@loopdev/contracts';

/**
 * @file types.ts
 * @description Contratos de propiedades para el componente SuiteSidebar.
 */

export interface SuiteSidebarProps {
  /** Esquema completo de navegación de la suite */
  schema: NavigationSchema;
  /** Modo actual del Sidebar (controlado por AppShell) */
  navMode: NavMode;
  /** ID del módulo activo (para Momentum y Focus) */
  activeModuleId?: string;
  /** Mapa de permisos en tiempo real */
  accessMap: AccessMap;
  /** Mapa de telemetría para badges */
  telemetry?: TelemetryMap;
  /** Slot opcional para el perfil de usuario en el footer */
  profileSlot?: ReactNode;
  
  /** Callback para volver al Launchpad (OS) */
  onExitToOS: () => void;
  /** Callback para alternar entre Rail y Expanded */
  onToggleNavMode: () => void;
  /** Callback genérico de navegación */
  onNavigate: (route: NavRouteRef) => void;
  /** Callback para acciones personalizadas (ej: abrir búsqueda) */
  onAction?: (actionId: string) => void;
  
  /** Clase CSS adicional */
  className?: string;
}
