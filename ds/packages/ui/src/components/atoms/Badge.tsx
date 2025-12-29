import React from 'react';
import { cn } from '../../helpers/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'neutral' | 'inverse';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'brand', 
  className = '' 
}) => {
  
  const variants = {
    brand: "bg-[var(--lpd-color-brand-primary)]/10 text-[var(--lpd-color-brand-secondary)]",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    neutral: "bg-[var(--lpd-color-bg-subtle)] text-[var(--lpd-color-text-muted)]",
    inverse: "bg-white/20 text-white backdrop-blur-sm border border-white/30",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
