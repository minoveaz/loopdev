import React from 'react';

interface IllustrationBaseProps {
    children: React.ReactNode;
    className?: string;
    viewBox?: string;
}

// Constantes técnicas oficiales de LoopDev
export const strokeWidth = 8;
export const strokeLinecap: "round" | "butt" | "square" = "round";
export const strokeLinejoin: "round" | "bevel" | "miter" = "round";

export const IllustrationBase: React.FC<IllustrationBaseProps> = ({ 
    children, 
    className = 'w-full h-full', 
    viewBox = "0 0 400 300" 
}) => (
  <svg 
    viewBox={viewBox} 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {children}
  </svg>
);
