import type { ReactNode } from 'react';
import type { ModuleContextSidebarWidth } from '../ModuleContextSidebar/types';

export type ModuleContextPanelWidth = ModuleContextSidebarWidth;
export type ModuleContextPanelPresentation = 'inline' | 'overlay';

export interface ModuleContextPanelProps {
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
  /** Tabs o controles adicionales de navegación del panel. */
  headerSlot?: ReactNode;
  /** Controles adicionales del footer. */
  footerSlot?: ReactNode;
  width?: ModuleContextPanelWidth;
  presentation?: ModuleContextPanelPresentation;
  onClose?: () => void;
  className?: string;
}
