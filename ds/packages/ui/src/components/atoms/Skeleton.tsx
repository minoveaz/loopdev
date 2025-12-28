import React from 'react';
import { cn } from '@/helpers/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
}) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 dark:bg-slate-800",
        variant === 'rect' && "rounded-xl",
        variant === 'circle' && "rounded-full",
        variant === 'text' && "rounded-md h-3 w-full",
        className
      )}
    />
  );
};
