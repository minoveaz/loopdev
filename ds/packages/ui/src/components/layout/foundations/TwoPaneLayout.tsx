import React from 'react';
import { cn } from '@/helpers/cn';

export interface TwoPaneLayoutProps {
  master: React.ReactNode;
  detail: React.ReactNode;
  masterWidth?: string; // e.g. "320px" or "w-1/3"
  className?: string;
}

export const TwoPaneLayout: React.FC<TwoPaneLayoutProps> = ({ 
  master, 
  detail, 
  masterWidth = "w-full md:w-80 lg:w-96",
  className 
}) => {
  return (
    <div className={cn("flex flex-col md:flex-row h-full w-full overflow-hidden", className)}>
      {/* Master Panel (List/Sidebar) */}
      <div className={cn(
        "shrink-0 border-b md:border-b-0 md:border-r border-[var(--lpd-color-border-subtle)] overflow-y-auto custom-scrollbar",
        masterWidth
      )}>
        {master}
      </div>

      {/* Detail Panel (Content) */}
      <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-[var(--lpd-color-bg-base)]">
        {detail}
      </div>
    </div>
  );
};
