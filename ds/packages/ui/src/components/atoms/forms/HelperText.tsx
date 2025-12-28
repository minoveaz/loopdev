import React from 'react';
import { cn } from '@/helpers/cn';

export interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
}

export const HelperText: React.FC<HelperTextProps> = ({ children, className }) => {
  return (
    <p className={cn("text-[11px] text-[var(--lpd-color-text-muted)] leading-tight", className)}>
      {children}
    </p>
  );
};
