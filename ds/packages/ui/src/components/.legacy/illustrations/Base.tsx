import React from 'react';

export interface IllustrationProps {
  className?: string;
  viewBox?: string;
  title?: string;
}

interface IllustrationBaseProps extends IllustrationProps {
  children: React.ReactNode;
}

// Common constants for style consistency
export const strokeWidth = 8;
export const strokeLinecap: "round" | "butt" | "square" = "round";
export const strokeLinejoin: "round" | "bevel" | "miter" = "round";

/**
 * IllustrationBase
 * Shared wrapper for all SVG illustrations in the system.
 */
export const IllustrationBase: React.FC<IllustrationBaseProps> = ({ 
  children, 
  className = 'w-full h-full', 
  viewBox = "0 0 400 300",
  title
}) => (
  <svg 
    viewBox={viewBox} 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={!title}
    role={title ? "img" : "presentation"}
  >
    {title && <title>{title}</title>}
    {children}
  </svg>
);
