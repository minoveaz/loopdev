/**
 * @file types.ts
 * @description Contratos para el sello de ciclo de vida de ingeniería.
 */

export type StampStatus = 'certified' | 'beta' | 'experimental';

export interface CertificationStampProps {
  /** Estado de madurez del componente */
  status?: StampStatus;
  /** Versión del componente (ej: v1.2) */
  version?: string;
  /** Fase del roadmap (ej: Phase 2) */
  phase?: string | number;
  /** Fecha de intervención */
  date?: string;
  /** Clase CSS adicional */
  className?: string;
}