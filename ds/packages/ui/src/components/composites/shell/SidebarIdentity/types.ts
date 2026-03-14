import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para la cabecera de identidad SidebarIdentity.
 */

export interface SidebarIdentityProps {
  /** Logo oficial (ej: <BrandLogo />) */
  logo: ReactNode;
  /** Nombre de la suite o módulo */
  name: string;
  /** Color de acento para la barra de identidad */
  accentColor?: string;
  /** Indica si está en modo Rail (compacto) */
  isRail?: boolean;
  /** Callback al hacer clic en la identidad */
  onClick?: () => void;
  /** Clase CSS adicional */
  className?: string;
}
