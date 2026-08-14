import type { ReactNode } from 'react';

export type ModuleContextSidebarWidth = 'narrow' | 'standard' | 'wide' | 'extra-wide';

export interface ModuleContextSidebarProps {
  children: ReactNode;
  footer?: ReactNode;
  label: string;
  width?: ModuleContextSidebarWidth;
  collapsible?: boolean;
  collapsed?: boolean;
  showCollapsedTrigger?: boolean;
  defaultCollapsed?: boolean;
  collapsedPresentation?: 'rail' | 'trigger' | 'drawer';
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseIcon?: ReactNode;
  expandIcon?: ReactNode;
  className?: string;
}
