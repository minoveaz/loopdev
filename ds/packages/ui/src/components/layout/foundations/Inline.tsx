import React from 'react';
import { cn } from '@/helpers/cn';
import { StackGap } from './Stack';

export interface InlineProps {
  children: React.ReactNode;
  gap?: StackGap;
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
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
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export const Inline: React.FC<InlineProps> = ({
  children,
  gap = 4,
  align = 'center',
  justify = 'start',
  wrap = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex',
        wrap ? 'flex-wrap' : 'flex-nowrap',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
};
