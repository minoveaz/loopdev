import type { ReactNode } from 'react';
import type { ModuleContextSidebarWidth } from '../ModuleContextSidebar/types';

export type ModuleContextPanelWidth = ModuleContextSidebarWidth;

export interface ModuleContextPanelProps {
  children: ReactNode;
  footer?: ReactNode;
  label: string;
  width?: ModuleContextPanelWidth;
  onClose?: () => void;
  className?: string;
}
