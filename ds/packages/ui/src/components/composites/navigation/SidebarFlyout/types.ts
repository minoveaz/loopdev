import React from 'react';

export interface SidebarFlyoutLink {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface SidebarFlyoutProps {
  /** Título del panel */
  title: string;
  /** Descripción semántica */
  description?: string;
  /** Modo de interacción primario */
  mode?: 'learn' | 'navigate';
  /** Lista de enlaces (Modo Navigate) */
  links?: SidebarFlyoutLink[];
  /** Callback al cerrar */
  onClose?: () => void;
  /** Contenido personalizado (Modo Learn) */
  children?: React.ReactNode;
  /** Clase CSS adicional */
  className?: string;
}
