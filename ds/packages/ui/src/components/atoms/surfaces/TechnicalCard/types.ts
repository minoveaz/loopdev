import React from 'react';

export interface TechnicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variante visual de la tarjeta */
  variant?: 'flat' | 'interactive' | 'warning' | 'disabled';
  /** Contenido de la tarjeta */
  children: React.ReactNode;
  /** Clase CSS adicional */
  className?: string;
}
