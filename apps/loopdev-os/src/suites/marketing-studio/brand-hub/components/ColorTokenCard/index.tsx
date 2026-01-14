'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
import { ColorTokenCardProps } from './types';
import { getContrastRatio, getWCAGStatus, getContrastColor } from '@/utils/color';

/**
 * @component ColorTokenCard
 * @description Molecule for displaying a semantic color token with accessibility metadata.
 */
export const ColorTokenCard: React.FC<ColorTokenCardProps> = ({
  token,
  theme,
  isActive,
  onClick,
  onCopy
}) => {
  const resolvedHex = theme === 'light' ? token.resolvesTo.light : token.resolvesTo.dark;
  
  // For validation, we check contrast against standard white/dark surfaces
  const bgSurface = theme === 'light' ? '#ffffff' : '#0d121b';
  const ratio = getContrastRatio(resolvedHex, bgSurface);
  const wcagStatus = getWCAGStatus(ratio);
  
  const handleHexClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy?.(resolvedHex);
    navigator.clipboard.writeText(resolvedHex);
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex flex-col bg-background-surface rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
        isActive ? "border-primary ring-1 ring-primary shadow-lg" : "border-border-technical hover:border-text-muted/30 shadow-sm"
      )}
    >
      {/* SWATCH AREA */}
      <div 
        className="h-32 w-full relative transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundColor: resolvedHex }}
      >
        <div className="absolute bottom-2 right-2 flex gap-2">
          {/* WCAG BADGE */}
          <div 
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter",
              wcagStatus === 'FAIL' ? "bg-red-500 text-white" : "bg-white/20 backdrop-blur-md text-white border border-white/20"
            )}
          >
            {`{ ${wcagStatus} }`}
          </div>
        </div>
      </div>

      {/* METADATA AREA */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col">
          <LpdText size="xs" weight="bold" className="text-text-main truncate">
            {token.name}
          </LpdText>
          <LpdText size="nano" className="text-text-muted opacity-60 uppercase tracking-widest">
            {token.group}
          </LpdText>
        </div>

        <div className="flex flex-col gap-1.5 font-mono text-[11px] text-text-muted">
          <div 
            onClick={handleHexClick}
            className="flex justify-between border-b border-border-technical/50 pb-1.5 hover:text-text-main transition-colors"
          >
            <span>HEX</span>
            <span className="font-bold">{resolvedHex.toUpperCase()}</span>
          </div>
          <div className="flex justify-between pt-0.5 opacity-40">
            <span>RATIO</span>
            <span>{ratio.toFixed(2)}:1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
