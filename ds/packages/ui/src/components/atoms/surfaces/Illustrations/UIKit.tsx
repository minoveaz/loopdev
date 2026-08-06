'use client';

import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from './Base';

/**
 * @component UIKitIllustration
 * @description Ilustración técnica que representa el sistema de construcción de UI y Brand Hub.
 */
export const UIKitIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <IllustrationBase className={className}>
    {/* Main Board / Canvas (Usando tokens de LoopDev) */}
    <rect 
      x="60" y="40" width="280" height="220" rx="15" 
      fill="currentColor" fillOpacity="0.05"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}
      className="text-primary/30"
    />
    
    {/* Sidebar Area */}
    <path 
      d="M60 55C60 46.7157 66.7157 40 75 40H110V260H75C66.7157 260 60 253.284 60 245V55Z" 
      fill="currentColor" fillOpacity="0.1"
      stroke="currentColor" strokeWidth={strokeWidth}
      className="text-primary/40"
    />
    
    {/* Color Palette Section (Tokens Vivos) */}
    <g transform="translate(140, 70)">
        <circle cx="20" cy="20" r="15" fill="var(--lpd-color-brand-primary, #135BEC)" />
        <circle cx="60" cy="20" r="15" fill="var(--lpd-color-brand-energy, #FFD025)" />
        <circle cx="100" cy="20" r="15" fill="currentColor" fillOpacity="0.2" className="text-primary" />
    </g>

    {/* Typography Section (Skeleton Lines) */}
    <path d="M140 120H240" stroke="currentColor" strokeWidth={6} strokeLinecap={strokeLinecap} className="text-primary" />
    <path d="M140 140H280" stroke="currentColor" strokeWidth={4} strokeLinecap={strokeLinecap} className="text-primary/30" />
    <path d="M140 155H260" stroke="currentColor" strokeWidth={4} strokeLinecap={strokeLinecap} className="text-primary/30" />

    {/* Components Section */}
    <g transform="translate(140, 190)">
        {/* Button Primary */}
        <rect x="0" y="0" width="80" height="30" rx="8" fill="var(--lpd-color-brand-primary, #135BEC)"/>
        {/* Button Outline */}
        <rect x="90" y="0" width="80" height="30" rx="8" fill="transparent" stroke="currentColor" strokeWidth={3} className="text-primary/40"/>
    </g>

    {/* Floating Technical Tool (Brush/Pen) */}
    <circle cx="300" cy="230" r="40" fill="var(--lpd-color-brand-energy, #FFD025)" fillOpacity="0.2" className="animate-pulse" />
    <path d="M280 250L320 210" stroke="var(--lpd-color-brand-primary, #135BEC)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
