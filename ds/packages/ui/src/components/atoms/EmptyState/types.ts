import React from 'react';

/**
 * @file types.ts
 * @description Contratos para el componente EmptyState.
 */

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps {
  /** Nombre del icono de Material Symbols */
  icon?: string;
  /** Título principal */
  title: string;
  /** Descripción secundaria */
  description: React.ReactNode;
  /** Nodo para acción principal (generalmente un Button) */
  action?: React.ReactNode;
  /** Mini-insignia sobre el icono principal */
  iconBadge?: string;
  /** Variantes de escala */
  size?: EmptyStateSize;
  /** Estilo visual: 'card' (con borde y fondo) o 'ghost' (sin bordes) */
  variant?: 'card' | 'ghost' | 'ai';
  /** Si está en estado de procesamiento (IA) */
  isLoading?: boolean;
  /** Mensajes para el AILoader en modo carga */
  loadingMessages?: string[];
  /** Clase CSS adicional */
  className?: string;
}