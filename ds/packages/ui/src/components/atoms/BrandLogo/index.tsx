'use client';

import React from 'react';
import { Icon } from '../Icon';
import { BrandLogoProps } from './types';
import { useBrandLogo } from './useBrandLogo';

/**
 * @component BrandLogo
 * @description Átomo oficial de identidad de marca LoopDev.
 * @category Foundations
 * @phase 1
 */
export const BrandLogo: React.FC<BrandLogoProps> = (props) => {
  const { variant, currentSize, containerClasses, textClasses } = useBrandLogo(props);

  // Path oficial del infinito LoopDev (extraído del sistema generativo)
  const infinityPath = "M31.5,50c-8.5,0-15.5-7-15.5-15.5S23,19,31.5,19c5.2,0,9.8,2.5,12.5,6.5L56,43.5c2.7,4,7.3,6.5,12.5,6.5c8.5,0,15.5-7,15.5-15.5S77,19,68.5,19c-5.2,0-9.8,2.5-12.5,6.5L44,43.5C41.3,47.5,36.7,50,31.5,50z";

  const Isotype = (
    <div className={`${currentSize.box} bg-primary flex items-center justify-center relative overflow-hidden shadow-lg shadow-primary/20 shrink-0`}>
      {/* Micro-grilla técnica (Bloque 0) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4px_4px]"></div>
      
      {/* Isotipo SVG (Infinito) */}
      <svg 
        viewBox="0 0 100 69" 
        className={`${currentSize.icon} w-[70%] h-auto relative z-10`}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={infinityPath} className="text-white" stroke="white" />
      </svg>
    </div>
  );

  const Logotype = (
    <div className={textClasses}>
      <span>loop.dev</span>
    </div>
  );

  return (
    <div className={containerClasses}>
      {(variant === 'full' || variant === 'isotype') && Isotype}
      {(variant === 'full' || variant === 'logotype') && Logotype}
    </div>
  );
};
