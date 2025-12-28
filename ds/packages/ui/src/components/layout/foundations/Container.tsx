import React from 'react';
import { cn } from '@/helpers/cn';

export interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'default' | 'none';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  padding = 'default',
  className,
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeClasses[size],
        padding === 'default' && 'px-4 md:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};
