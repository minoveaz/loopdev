import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DomainStatus {
  label: 'Draft' | 'Live' | 'Locked' | string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export interface ModuleHeaderProps {
  /** Título principal del módulo */
  title: string;
  
  /** Subtítulo o ID técnico */
  subtitle?: string;
  
  /** Ruta de breadcrumbs jerárquicos */
  breadcrumbs?: BreadcrumbItem[];
  
  /** Mostrar botón de retorno */
  showBack?: boolean;
  
  /** Callback al pulsar retorno */
  onBack?: () => void;

  /** Configuración del toggle del sidebar del módulo */
  sidebarToggle?: {
    isOpen: boolean;
    onToggle: () => void;
    ariaLabel?: string;
  };

  /** Estado del dominio (Pill visual) */
  status?: DomainStatus;

  /** Slot para acciones a la derecha */
  rightSlot?: React.ReactNode;
  
  /** Clase CSS adicional */
  className?: string;
}
