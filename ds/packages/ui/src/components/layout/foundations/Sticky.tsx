import React from 'react';
import { cn } from '../../../helpers/cn';

export interface StickyProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  offset?: number;
  background?: boolean;
  className?: string;
}

export const Sticky: React.FC<StickyProps> = ({ 
  children, 
  position = 'top', 
  offset = 0,
  background = true,
  className 
}) => {
  return (
    <div 
      className={cn(
        "sticky z-20 transition-shadow duration-200",
        position === 'top' ? "top-0" : "bottom-0",
        background && "bg-[var(--lpd-color-bg-base)]/80 backdrop-blur-md",
        position === 'top' && background && "border-b border-[var(--lpd-color-border-subtle)] shadow-sm",
        position === 'bottom' && background && "border-t border-[var(--lpd-color-border-subtle)] shadow-[0_-4px_12px_rgba(0,0,0,0.02)]",
        className
      )}
      style={{ 
        [position]: offset,
      }}
    >
      {children}
    </div>
  );
};
