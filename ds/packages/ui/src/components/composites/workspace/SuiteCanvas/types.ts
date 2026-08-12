import type { ReactNode } from 'react';

export type SuiteCanvasMode = 'overview' | 'data' | 'workspace' | 'split' | 'board' | 'full-bleed';

export interface SuiteCanvasProps {
  mode?: SuiteCanvasMode;
  header?: ReactNode;
  toolbar?: ReactNode;
  localNav?: ReactNode;
  tabs?: ReactNode;
  contextAside?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}
