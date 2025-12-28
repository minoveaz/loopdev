import React from 'react';
import { cn } from '@/helpers/cn';

export interface SafeAreaProps {
  children?: React.ReactNode;
  /** Position to apply the safe area padding */
  top?: boolean;
  bottom?: boolean;
  /** Whether to use padding or margin */
  type?: 'padding' | 'margin';
  as?: React.ElementType;
  className?: string;
}

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  top = false,
  bottom = false,
  type = 'padding',
  as: Component = 'div',
  className,
}) => {
  const style: React.CSSProperties = {};
  
  if (top) {
    const key = type === 'padding' ? 'paddingTop' : 'marginTop';
    style[key] = 'env(safe-area-inset-top, 0px)';
  }
  
  if (bottom) {
    const key = type === 'padding' ? 'paddingBottom' : 'marginBottom';
    style[key] = 'env(safe-area-inset-bottom, 0px)';
  }

  return (
    <Component className={className} style={style}>
      {children}
    </Component>
  );
};
