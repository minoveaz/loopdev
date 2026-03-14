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
  /** Ruta de breadcrumbs jerárquicos { SUITE / MODULE / VIEW } */
  segments: BreadcrumbSegment[];
  
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

  /** Slot para acciones a la derecha */
  rightSlot?: React.ReactNode;
  
  /** Clase CSS adicional */
  className?: string;
}