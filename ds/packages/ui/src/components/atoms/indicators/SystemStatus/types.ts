/**
 * @file types.ts
 * @description Contratos de tipado para el indicador de estado del sistema.
 */

export type SystemStatusState = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface SystemStatusProps {
  /** Estado actual del sistema */
  state?: SystemStatusState;
  /** ID técnico o nombre del identificador (ej: Tenant ID) */
  id?: string;
  /** Etiqueta opcional para el ID (por defecto 'ID') */
  label?: string;
  /** Clase CSS adicional */
  className?: string;
}
