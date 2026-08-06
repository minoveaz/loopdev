import React from 'react';
import { useIcon } from './useIcon';

/**
 * @component Icon
 * @description Official LoopDev icon primitive.
 * Supports standard glyphs and 'boxed' technical variants.
 */
export interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'standard' | 'boxed';
  color?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  variant = 'standard', 
  color, 
  className 
}) => {
  const { iconClassName, containerClassName, finalColor } = useIcon({ name, size, variant, color, className });

  if (variant === 'boxed') {
    return (
      <div className={containerClassName}>
        <span className={iconClassName} style={{ color: finalColor }}>{name}</span>
      </div>
    );
  }

  return (
    <span className={iconClassName} style={{ color: finalColor }}>{name}</span>
  );
};
