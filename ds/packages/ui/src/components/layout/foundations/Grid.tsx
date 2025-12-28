import React from 'react';
import { cn } from '@/helpers/cn';
import { StackGap } from './Stack';

export interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: StackGap;
  responsive?: 'none' | 'cards' | 'form' | 'content';
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

const colClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const responsivePresets = {
  none: '',
  cards: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  form: 'grid-cols-1 md:grid-cols-2',
  content: 'grid-cols-1 lg:grid-cols-3',
};

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = 6,
  responsive = 'none',
  className,
}) => {
  return (
    <div
      className={cn(
        'grid',
        responsive === 'none' ? colClasses[cols] : responsivePresets[responsive],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};
