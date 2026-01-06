import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de información técnica Tooltip.
 */

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TechnicalTooltipProps {
  /** Elemento que dispara el tooltip al hacer hover/focus */
  children: ReactNode;
  /** Contenido del tooltip (texto o JSX técnico) */
  content: ReactNode;
  /** Lado donde aparecerá el globo */
  side?: TooltipSide;
  /** Alineación respecto al disparador */
  align?: TooltipAlign;
  /** Tiempo de espera antes de mostrarse (ms) */
  delayDuration?: number;
  /** Forzar estado abierto (opcional) */
  open?: boolean;
  /** Clase CSS adicional para el contenido */
  className?: string;
}
