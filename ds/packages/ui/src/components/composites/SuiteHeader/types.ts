import { ReactNode } from 'react';
import { LayoutContext } from '@loopdev/contracts';

/**
 * @file types.ts
 * @description Contratos de tipado para el chasis del header global.
 */

export interface SuiteHeaderProps {
  /** Slot para la Cápsula Izquierda (Identidad y Contexto) */
  leftSlot: ReactNode;
  /** Slot para la Cápsula Central (Comando Global) */
  centerSlot: ReactNode;
  /** Slot para la Cápsula Derecha (Estado y Control del Sistema) */
  rightSlot: ReactNode;

  /** Contexto de enfoque actual de la aplicación */
  context?: LayoutContext;
  /** Estado de inercia cuando hay un overlay activo */
  isInert?: boolean;
  
  /** Clase CSS adicional para el contenedor */
  className?: string;
}
