import React from 'react';
import { cn } from '../../helpers/cn';

export interface TagProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ 
  children, 
  icon,
  className 
}) => {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--lpd-color-border-subtle)] bg-[var(--lpd-color-bg-subtle)]/50 text-[10px] font-mono font-bold text-[var(--lpd-color-text-muted)] uppercase tracking-tight",
      className
    )}>
      {icon && <span className="opacity-60">{icon}</span>}
      {children}
    </span>
  );
};
