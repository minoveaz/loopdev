import React from 'react';
import { cn } from '../../../helpers/cn';

export interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: number; // e.g. 16/9, 1, 4/3
  className?: string;
}

export const AspectRatio: React.FC<AspectRatioProps> = ({ 
  children, 
  ratio = 16 / 9, 
  className 
}) => {
  return (
    <div 
      className={cn("relative w-full overflow-hidden", className)}
      style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
    >
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
