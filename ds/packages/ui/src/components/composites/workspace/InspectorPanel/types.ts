import React from 'react';

export interface InspectorPanelProps {
  /** Título del panel */
  title?: string;
  
  /** Subtítulo o ID del objeto */
  subtitle?: string;
  
  /** Callback al cerrar el panel */
  onClose: () => void;
  
  /** Slot para contenido personalizado en el header */
  headerSlot?: React.ReactNode;
  
  /** Contenido principal (Propiedades) */
  children: React.ReactNode;
  
  /** Slot para acciones persistentes al pie */
  footerSlot?: React.ReactNode;
  
  /** Clase CSS adicional */
  className?: string;
}
