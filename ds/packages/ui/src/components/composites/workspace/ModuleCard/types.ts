import React from 'react';

export interface ModuleCardProps {
  /** Texto del badge de estado (ej: 'Webinar', 'Active') */
  statusBadge: string;
  /** Tono del badge de estado */
  statusTone?: 'primary' | 'energy' | 'innovation' | 'neutral' | 'success' | 'warning' | 'danger';
  /** Título principal (puede contener saltos de línea con <br/>) */
  title: React.ReactNode;
  /** Contenido del footer (ej: nombre de persona) */
  footerContent: React.ReactNode;
  /** Icono del footer (opcional) */
  footerIcon?: string;
  /** Callback al hacer clic en la tarjeta */
  onClick?: () => void;
  /** Clase CSS adicional */
  className?: string;
}