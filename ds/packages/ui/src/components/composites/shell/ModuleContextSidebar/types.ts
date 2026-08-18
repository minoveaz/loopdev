import type { ReactNode } from 'react';

export type ModuleContextSidebarWidth = 'narrow' | 'standard' | 'wide' | 'extra-wide';

export interface ModuleContextSidebarProps {
  children: ReactNode;
  footer?: ReactNode;
  label: string;
  /** Permite retirar la zona completa sin desmontar la composición padre. */
  visible?: boolean;
  /** Número máximo de filas visuales del header. */
  headerRows?: 1 | 2 | 3;
  /** Controla si se renderiza el footer. */
  showFooter?: boolean;
  /** Número máximo de filas visuales del footer. */
  footerRows?: 1 | 2 | 3;
  /** Permite controlar el scroll vertical del contenido. */
  contentScrollable?: boolean;
  width?: ModuleContextSidebarWidth;
  /** @deprecated El control de colapso es parte obligatoria del sidebar. */
  collapsible?: boolean;
  collapsed?: boolean;
  showCollapsedTrigger?: boolean;
  defaultCollapsed?: boolean;
  collapsedPresentation?: 'rail' | 'trigger' | 'drawer';
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseIcon?: ReactNode;
  expandIcon?: ReactNode;
  /** Slot opcional para contenido adicional del header. */
  headerSlot?: ReactNode;
  /** Controles adicionales del footer. */
  footerSlot?: ReactNode;
  className?: string;
}
