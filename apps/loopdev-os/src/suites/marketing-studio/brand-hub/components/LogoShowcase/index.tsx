'use client';

import React from 'react';
import { LogoShowcaseProps } from './types';
import { LpdText } from '@loopdev/ui';
import { clsx } from 'clsx';

/**
 * @component LogoShowcase
 * @description A high-fidelity display for the brand's core symbol (Isotype).
 * Features a technical grid background and support for raw SVG rendering.
 */
export const LogoShowcase: React.FC<LogoShowcaseProps> = ({
  logo,
  logoNode,
  title = "The Isotype",
  description,
  showGrid = true
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-bold text-sm border border-primary/20">
          01
        </span>
        <LpdText size="xl" weight="bold" className="text-text-main tracking-tight">
          {title}
        </LpdText>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN STAGE (Visual) */}
        <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-border-technical bg-background-surface dark:bg-background-laboratory aspect-video lg:aspect-auto min-h-[400px] flex items-center justify-center">
          
          {/* Grid Background */}
          {showGrid && (
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[linear-gradient(rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          )}
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50"></div>

          {/* The Logo */}
          <div className="relative z-10 p-12 transition-transform duration-500 group-hover:scale-105">
            {logoNode ? (
              <div className="scale-[2.5]">{logoNode}</div>
            ) : logo.rawSvg ? (
              <div 
                className="w-48 h-48 text-primary fill-current"
                dangerouslySetInnerHTML={{ __html: logo.rawSvg }} 
              />
            ) : (
              <img 
                src={logo.url} 
                alt={logo.alt || "Brand Isotype"} 
                className="w-48 h-48 object-contain"
              />
            )}
          </div>

          {/* Technical Label */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="px-3 py-1.5 rounded-lg bg-background-surface/80 backdrop-blur border border-border-technical shadow-sm">
              <LpdText size="nano" className="font-mono text-text-muted uppercase tracking-wider">
                FIG. 1.0 — SYMBOL CONSTRUCTION
              </LpdText>
            </div>
            
            <button className="p-2.5 rounded-xl bg-background-surface hover:bg-primary/10 text-text-muted hover:text-primary border border-border-technical transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>
          </div>
        </div>

        {/* SIDEBAR (Context & Specs) */}
        <div className="flex flex-col gap-4">
          
          {/* Description Card */}
          <div className="p-8 rounded-3xl bg-background-surface border border-border-technical flex-1 flex flex-col justify-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <span className="material-symbols-outlined">all_inclusive</span>
            </div>
            <div>
              <LpdText size="lg" weight="bold" className="text-text-main mb-2">Symbol Logic</LpdText>
              <LpdText size="sm" className="text-text-muted leading-relaxed">
                {description || "The core identifier of the brand. Designed for scalability and instant recognition across all mediums, from favicons to billboards."}
              </LpdText>
            </div>
          </div>

          {/* Specs Card */}
          <div className="p-8 rounded-3xl bg-background-surface border border-border-technical flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest">Technical Specs</LpdText>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="block text-[10px] text-text-muted/60 uppercase font-mono mb-1">ASPECT RATIO</span>
                <span className="text-sm font-bold text-text-main">1:1 (Square)</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted/60 uppercase font-mono mb-1">GRID SYSTEM</span>
                <span className="text-sm font-bold text-text-main">Pixel Perfect</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted/60 uppercase font-mono mb-1">STROKE</span>
                <span className="text-sm font-bold text-text-main">Fluid / Solid</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted/60 uppercase font-mono mb-1">TYPE</span>
                <span className="text-sm font-bold text-text-main">Vector Path</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
