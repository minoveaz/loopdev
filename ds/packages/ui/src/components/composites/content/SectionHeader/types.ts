import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  headingAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}