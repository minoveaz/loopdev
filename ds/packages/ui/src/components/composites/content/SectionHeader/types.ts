import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}