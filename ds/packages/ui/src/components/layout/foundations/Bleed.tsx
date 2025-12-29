import React from 'react';
import { cn } from '../../../helpers/cn';

export interface BleedProps {
  children: React.ReactNode;
  inline?: boolean;
  className?: string;
}

/**
 * Bleed allows a component to "bleed" into the surrounding container's padding.
 * It uses negative margins to break out of the parent's horizontal constraints.
 */
export const Bleed: React.FC<BleedProps> = ({ children, inline = true, className }) => {
  return (
    <div
      className={cn(
        inline && 'mx-[calc(var(--lpd-space-4)*-1)] md:mx-[calc(var(--lpd-space-6)*-1)] lg:mx-[calc(var(--lpd-space-8)*-1)]',
        className
      )}
    >
      {children}
    </div>
  );
};

export interface FullBleedProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FullBleed breaks out of ANY container to touch the viewport edges.
 */
export const FullBleed: React.FC<FullBleedProps> = ({ children, className }) => {
  return (
    <div 
      className={cn(
        'relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen',
        className
      )}
    >
      {children}
    </div>
  );
};
