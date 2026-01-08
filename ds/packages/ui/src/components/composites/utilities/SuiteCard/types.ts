import { ReactNode } from 'react';
import { EngineeringSealStatus } from '../../../atoms';

/**
 * @file types.ts
 * @description Contratos de tipado para el componente SuiteCard.
 */

export interface SuiteCardProps {
  /** Título principal de la suite */
  title: string;
  /** Descripción corta del propósito de la suite */
  description: string;
  /** Ilustración técnica (componente SVG del DS) */
  illustration: ReactNode;
  /** Versión técnica para el sello de ingeniería */
  version: string;
  /** Estado de madurez del módulo */
  status?: EngineeringSealStatus;
  /** Ruta de navegación al hacer clic */
  href: string;
  /** Indica si la suite está bloqueada o en desarrollo */
  isLocked?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
