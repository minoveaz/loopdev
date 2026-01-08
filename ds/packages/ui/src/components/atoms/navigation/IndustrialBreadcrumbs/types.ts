import React from 'react';

export interface BreadcrumbSegment {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  isActive?: boolean;
}

export interface IndustrialBreadcrumbsProps {
  /** Array de segmentos de la ruta */
  segments: BreadcrumbSegment[];
  /** Clase CSS adicional */
  className?: string;
}
