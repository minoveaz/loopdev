import type React from 'react';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
