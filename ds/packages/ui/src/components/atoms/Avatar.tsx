import React from 'react';
import { cn } from '@/helpers/cn';

export interface AvatarProps {
  src?: string;
  initials?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  initials = 'US', 
  alt = 'Avatar', 
  size = 'md',
  className = '' 
}) => {
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-lg",
  };

  return (
    <div className={cn(
      "relative inline-flex items-center justify-center overflow-hidden rounded-full",
      "bg-[var(--lpd-color-bg-subtle)] border border-[var(--lpd-color-border-subtle)]",
      sizeClasses[size], 
      className
    )}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-[var(--lpd-color-text-muted)] tracking-wider">
          {initials.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
};
