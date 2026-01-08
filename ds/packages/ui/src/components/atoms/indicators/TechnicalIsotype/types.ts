import React from 'react';

export interface TechnicalIsotypeProps {
  /** Icono de Material Symbols */
  icon: string;
  /** Tono semántico */
  tone?: 'primary' | 'energy' | 'innovation' | 'neutral';
  /** Tamaño del isotipo */
  size?: 'sm' | 'md' | 'lg';
  /** Clase CSS adicional */
  className?: string;
}
