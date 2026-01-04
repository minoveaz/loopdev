/**
 * @file types.ts
 * @description Contratos de tipado para el sello de ingeniería oficial.
 */

export type EngineeringSealStatus = 'ready' | 'audit' | 'lab';

export interface EngineeringSealProps {
  /** Versión técnica del componente o módulo (ej: 1.0.4) */
  version: string;
  /** Estado de certificación técnica */
  status?: EngineeringSealStatus;
  /** Clase CSS adicional para posicionamiento */
  className?: string;
}
