import { ReactNode } from 'react';

/**
 * @file types.ts
 * @description Contratos de tipado para el sistema de orientación jerárquica.
 */

export interface PathSegment {
  /** ID único del nivel (ej: brandhub) */
  id: string;
  /** Etiqueta visible */
  label: string;
  /** Ruta de navegación opcional */
  href?: string;
  /** Indica si es el nivel activo actualmente */
  isActive?: boolean;
}

export interface ContextPathProps {
  /** Lista ordenada de segmentos desde la raíz hasta la vista actual */
  segments: PathSegment[];
  /** Separador visual entre segmentos */
  separator?: 'slash' | 'chevron';
  /** Límite de segmentos visibles antes de colapsar */
  maxVisible?: number;
  /** Callback al hacer clic en un segmento */
  onNavigate?: (href: string) => void;
  /** Clase CSS adicional */
  className?: string;
}
