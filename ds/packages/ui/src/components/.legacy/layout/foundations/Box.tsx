import React from 'react';
import { cn } from '../../../helpers/cn';

export type BoxSpace = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;
export type BoxRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type BoxBackground = 'none' | 'base' | 'subtle' | 'primary' | 'secondary' | 'inverse';

type Responsive<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export interface BoxProps {
  children?: React.ReactNode;
  padding?: Responsive<BoxSpace>;
  paddingX?: Responsive<BoxSpace>;
  paddingY?: Responsive<BoxSpace>;
  background?: BoxBackground;
  radius?: BoxRadius;
  border?: boolean;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

const getResponsiveClasses = (
  prop: Responsive<BoxSpace> | undefined, 
  prefix: string
): string => {
  if (prop === undefined) return '';
  if (typeof prop === 'number') return `${prefix}-${prop}`;
  
  return cn(
    prop.base !== undefined && `${prefix}-${prop.base}`,
    prop.sm !== undefined && `sm:${prefix}-${prop.sm}`,
    prop.md !== undefined && `md:${prefix}-${prop.md}`,
    prop.lg !== undefined && `lg:${prefix}-${prop.lg}`,
    prop.xl !== undefined && `xl:${prefix}-${prop.xl}`
  );
};

const backgroundMap: Record<BoxBackground, string> = {
  none: '',
  base: 'bg-[var(--lpd-color-bg-base)]',
  subtle: 'bg-[var(--lpd-color-bg-subtle)]',
  primary: 'bg-[var(--lpd-color-brand-primary)] text-[var(--lpd-color-text-on-primary)]',
  secondary: 'bg-[var(--lpd-color-brand-secondary)] text-[var(--lpd-color-text-base)]',
  inverse: 'bg-[var(--lpd-color-text-base)] text-[var(--lpd-color-bg-base)]',
};

const radiusMap: Record<BoxRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-[2.5rem]', // Estandarizado a 40px para look premium
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
  style,
}) => {
  return (
    <Component
      style={style}
      className={cn(
        getResponsiveClasses(padding, 'p'),
        getResponsiveClasses(paddingX, 'px'),
        getResponsiveClasses(paddingY, 'py'),
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