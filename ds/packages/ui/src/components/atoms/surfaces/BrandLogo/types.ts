type BrandLogoVariant = 'full' | 'isotype' | 'logotype';
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BrandLogoProps {
  /** Variante del logo a mostrar */
  variant?: BrandLogoVariant;
  /** Superficie del isotipo */
  surface?: 'solid' | 'plain';
  /** Tamaño del componente */
  size?: BrandLogoSize;
  /** Clase CSS adicional */
  className?: string;
  /** Clase CSS adicional para el isotipo SVG */
  isotypeClassName?: string;
  /** Forzar un modo de color específico (opcional) */
  colorMode?: 'light' | 'dark';
}
