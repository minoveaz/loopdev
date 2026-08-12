import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de información técnica Tooltip.
 */

type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
type TooltipAlign = 'start' | 'center' | 'end';
type TechnicalTooltipVariant = 'technical' | 'popover';

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
  /** Variante visual para tooltips técnicos o ayudas contextuales */
  variant?: TechnicalTooltipVariant;
}
