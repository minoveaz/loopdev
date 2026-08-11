import type { ReactNode } from 'react';

export type ModuleContextSidebarWidth = 'narrow' | 'standard' | 'wide';

export interface ModuleContextSidebarProps {
  children: ReactNode;
  footer?: ReactNode;
  label: string;
  width?: ModuleContextSidebarWidth;
  className?: string;
}
