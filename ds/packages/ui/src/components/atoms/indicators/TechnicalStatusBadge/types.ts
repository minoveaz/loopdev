import React from 'react';
import type { SemanticComponentColors } from '../../../shared/types';

export type BadgeSeverity = 'info' | 'warning' | 'danger' | 'success' | 'innovation' | 'neutral' | 'primary';
export type BracketColor = 'blue' | 'yellow' | 'purple' | 'neutral';

export interface TechnicalStatusBadgeProps {
  /** El texto a mostrar dentro de los corchetes */
  label: string;
  /** Determina el color del texto y el aura general */
  severity?: BadgeSeverity;
  /** Color específico de los corchetes { } */
  bracketColor?: BracketColor;
  /** Variante visual de la superficie */
  variant?: 'glass' | 'outline' | 'ghost';
  /** Incluye un punto de pulso a la izquierda del texto */
  withPulse?: boolean;
  /** Clase CSS adicional */
  className?: string;
  colors?: SemanticComponentColors;
}
