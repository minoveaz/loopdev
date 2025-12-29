import React from 'react';
import { cn } from '../../../helpers/cn';

export interface CenterProps {
  children: React.ReactNode;
  inline?: boolean;
  className?: string;
}

/**
 * Center primitive for absolute 2D centering (horizontal and vertical)
 */
export const Center: React.FC<CenterProps> = ({ 
  children, 
  inline = false,
  className 
}) => {
  return (
    <div className={cn(
      "flex items-center justify-center",
      inline ? "inline-flex" : "flex w-full h-full",
      className
    )}>
      {children}
    </div>
  );
};
