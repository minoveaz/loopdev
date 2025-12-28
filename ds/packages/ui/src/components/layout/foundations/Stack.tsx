import React from 'react';
import { cn } from '@/helpers/cn';

export type StackGap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;

export interface StackProps {
  children: React.ReactNode;
  gap?: StackGap;
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

const gapClasses: Record<StackGap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
  16: 'gap-16',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export const Stack: React.FC<StackProps> = ({
  children,
  gap = 4,
  align = 'stretch',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col',
        gapClasses[gap],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};
