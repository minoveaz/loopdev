interface BreadcrumbSegment {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  isActive?: boolean;
}

export interface IndustrialBreadcrumbsProps {
  /** Array de segmentos de la ruta */
  segments: BreadcrumbSegment[];
  /** Variante compacta para móvil, normalmente solo el módulo activo */
  mobileSegments?: BreadcrumbSegment[];
  /** Clase CSS adicional */
  className?: string;
}
