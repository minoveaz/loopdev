import React from 'react';
import { cn } from '@/helpers/cn';

export type BoxSpace = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;
export type BoxRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type BoxBackground = 'none' | 'base' | 'subtle' | 'primary' | 'secondary' | 'inverse';

export interface BoxProps {
  children?: React.ReactNode;
  padding?: BoxSpace;
  paddingX?: BoxSpace;
  paddingY?: BoxSpace;
  background?: BoxBackground;
  radius?: BoxRadius;
  border?: boolean;
  className?: string;
  as?: React.ElementType;
}

const spaceMap: Record<BoxSpace, string> = {
  0: 'p-0', 1: 'p-1', 2: 'p-2', 3: 'p-3', 4: 'p-4', 5: 'p-5', 6: 'p-6',
  8: 'p-8', 10: 'p-10', 12: 'p-12', 16: 'p-16', 20: 'p-20'
};

const xSpaceMap: Record<BoxSpace, string> = {
  0: 'px-0', 1: 'px-1', 2: 'px-2', 3: 'px-3', 4: 'px-4', 5: 'px-5', 6: 'px-6',
  8: 'px-8', 10: 'px-10', 12: 'px-12', 16: 'px-16', 20: 'px-20'
};

const ySpaceMap: Record<BoxSpace, string> = {
  0: 'py-0', 1: 'py-1', 2: 'py-2', 3: 'py-3', 4: 'py-4', 5: 'py-5', 6: 'py-6',
  8: 'py-8', 10: 'py-10', 12: 'py-12', 16: 'py-16', 20: 'py-20'
};

const backgroundMap: Record<BoxBackground, string> = {
  none: '',
  base: 'bg-[var(--lpd-color-bg-base)]',
  subtle: 'bg-[var(--lpd-color-bg-subtle)]',
  primary: 'bg-[var(--lpd-color-primary)] text-white',
  secondary: 'bg-[var(--lpd-color-secondary)] text-white',
  inverse: 'bg-[var(--lpd-color-text-base)] text-[var(--lpd-color-bg-base)]',
};

const radiusMap: Record<BoxRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

export const Box: React.FC<BoxProps> = ({
  children,
  padding,
  paddingX,
  paddingY,
  background = 'none',
  radius = 'none',
  border = false,
  className,
  as: Component = 'div',
}) => {
  return (
    <Component
      className={cn(
        padding !== undefined && spaceMap[padding],
        paddingX !== undefined && xSpaceMap[paddingX],
        paddingY !== undefined && ySpaceMap[paddingY],
        backgroundMap[background],
        radiusMap[radius],
        border && 'border border-[var(--lpd-color-border-subtle)]',
        className
      )}
    >
      {children}
    </Component>
  );
};
