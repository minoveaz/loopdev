'use client';

import React from 'react';
import Image from 'next/image';
import { LogoShowcaseProps } from './types';
import { Heading, LpdText, IconButton } from '@loopdev/ui';

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
        <span className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded border text-sm font-bold">
          01
        </span>
        <Heading as="h2" size="xl" weight="bold" className="text-text-main tracking-tight">
          {title}
        </Heading>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* MAIN STAGE (Visual) */}
        <div className="border-border-technical bg-background-surface dark:bg-background-laboratory group relative flex aspect-video min-h-[400px] items-center justify-center overflow-hidden rounded-3xl border lg:col-span-2 lg:aspect-auto">
          
          {/* Grid Background */}
          {showGrid && (
            <div className="bg-background-subtle/30 pointer-events-none absolute inset-0 bg-[size:40px_40px] opacity-30"></div>
          )}
          
          {/* Glow Effect */}
          <div className="from-primary/5 absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-50"></div>

          {/* The Logo */}
          <div className="relative z-10 p-12 transition-transform duration-500 group-hover:scale-105">
            {logoNode ? (
              <div className="scale-[2.5]">{logoNode}</div>
            ) : logo.rawSvg ? (
              <div 
                className="text-primary h-48 w-48 fill-current"
                dangerouslySetInnerHTML={{ __html: logo.rawSvg }} 
              />
            ) : (
              logo.url ? (
                <Image
                  src={logo.url}
                  alt={logo.alt || 'Brand Isotype'}
                  width={logo.width ?? 192}
                  height={logo.height ?? 192}
                  unoptimized
                  className="h-48 w-48 object-contain"
                />
              ) : null
            )}
          </div>

          {/* Technical Label */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="bg-background-surface/80 border-border-technical rounded-lg border px-3 py-1.5 shadow-sm backdrop-blur">
              <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-wider">
                FIG. 1.0 — SYMBOL CONSTRUCTION
              </LpdText>
            </div>
            
            <IconButton icon="download" size="sm" aria-label="Descargar logo" className="bg-background-surface hover:bg-primary/10 text-text-muted hover:text-primary border-border-technical rounded-xl border p-2.5 shadow-sm transition-colors" />
          </div>
        </div>

        {/* SIDEBAR (Context & Specs) */}
        <div className="flex flex-col gap-4">
          
          {/* Description Card */}
          <div className="bg-background-surface border-border-technical flex flex-1 flex-col justify-center gap-4 rounded-3xl border p-8">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
               <span className="material-symbols-outlined">all_inclusive</span>
            </div>
            <div>
              <Heading as="h3" size="lg" weight="bold" className="text-text-main mb-2">Symbol Logic</Heading>
              <LpdText size="sm" className="text-text-muted leading-relaxed">
                {description || "The core identifier of the brand. Designed for scalability and instant recognition across all mediums, from favicons to billboards."}
              </LpdText>
            </div>
          </div>

          {/* Specs Card */}
          <div className="bg-background-surface border-border-technical flex flex-1 flex-col justify-center rounded-3xl border p-8">
            <div className="mb-6 flex items-center justify-between">
              <Heading as="h3" size="sm" weight="bold" className="text-text-muted uppercase tracking-widest">Technical Specs</Heading>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <span className="text-text-muted/60 mb-1 block font-mono text-[10px] uppercase">ASPECT RATIO</span>
                <span className="text-text-main text-sm font-bold">1:1 (Square)</span>
              </div>
              <div>
                <span className="text-text-muted/60 mb-1 block font-mono text-[10px] uppercase">GRID SYSTEM</span>
                <span className="text-text-main text-sm font-bold">Pixel Perfect</span>
              </div>
              <div>
                <span className="text-text-muted/60 mb-1 block font-mono text-[10px] uppercase">STROKE</span>
                <span className="text-text-main text-sm font-bold">Fluid / Solid</span>
              </div>
              <div>
                <span className="text-text-muted/60 mb-1 block font-mono text-[10px] uppercase">TYPE</span>
                <span className="text-text-main text-sm font-bold">Vector Path</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
