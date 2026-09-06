import React from 'react';
import { BadgeSeverity } from '../../../atoms/indicators/TechnicalStatusBadge/types';

export interface BreadcrumbSegment {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  isActive?: boolean;
}

export interface ModuleHeaderProps {
  /** Slot izquierdo: orientación y contexto del módulo. */
  leftSlot?: React.ReactNode;

  /** Slot central: estado o información contextual del módulo. */
  centerSlot?: React.ReactNode;

  /** Slot derecho: acciones propias del módulo. */
  rightSlot?: React.ReactNode;

  /** Ruta de breadcrumbs jerárquicos { SUITE / MODULE / VIEW } */
  segments: BreadcrumbSegment[];

  /** Variante compacta para viewport móvil, normalmente solo el módulo activo. */
  mobileSegments?: BreadcrumbSegment[];

  /** Texto del estado (ej: 'Live') */
  statusLabel?: string;

  /** Severidad del estado */
  statusSeverity?: BadgeSeverity;

  /** Callback al pulsar retorno */
  onBack?: () => void;

  /** Configuración del toggle del sidebar del módulo */
  sidebarToggle?: {
    isOpen: boolean;
    onToggle: () => void;
    ariaLabel?: string;
  };

  /** Número de filas visuales permitidas por el chasis. */
  rows?: 1 | 2;

  /** Clase CSS adicional */
  className?: string;

  /** Nombre accesible del encabezado de módulo. */
  ariaLabel?: string;

  /** Control responsive de visibilidad */
  visibleOnMobile?: boolean;
  visibleOnDesktop?: boolean;
}
