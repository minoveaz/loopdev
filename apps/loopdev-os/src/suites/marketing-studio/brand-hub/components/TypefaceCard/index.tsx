'use client';

import React from 'react';
import { TypefaceCardProps } from './types';
import { LpdText } from '@loopdev/ui';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @component TypefaceCard
 * @description Industrial-grade display for brand or technical typefaces.
 * Uses semantic tokens for full Dark Mode support.
 */
export const TypefaceCard: React.FC<TypefaceCardProps> = ({
  font,
  variant,
  onClick,
  isSelected
}) => {
  const isBrand = variant === 'brand';
  
  // Base styles for the card container
  const cardStyles = twMerge(
    'relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer group',
    isBrand 
      ? 'bg-background-surface border-border-technical/50 hover:border-primary/30' 
      : 'bg-[#0F1115] border-border-technical hover:border-yellow-500/30', // Technical uses a specific dark terminal shade
    isSelected && (isBrand ? 'border-primary ring-1 ring-primary/20' : 'border-yellow-500 ring-1 ring-yellow-500/20')
  );

  return (
    <div className={cardStyles} onClick={onClick}>
      
      {/* WATERMARK BACKGROUND (Aa or </>) */}
      <div className={clsx(
        "absolute pointer-events-none select-none transition-opacity duration-500",
        isBrand ? "top-4 right-8 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.07]" : "-bottom-8 right-4 opacity-[0.04] group-hover:opacity-[0.08]"
      )}>
        <span className={clsx(
          "font-black leading-none",
          isBrand ? "text-text-main" : "text-white font-mono"
        )} style={{ 
          fontFamily: font.family,
          fontSize: isBrand ? '220px' : '180px'
        }}>
          {isBrand ? 'Aa' : '</>'}
        </span>
      </div>

      <div className="relative p-8 flex flex-col justify-between min-h-[300px] z-10">
        
        {/* HEADER: Metadata & Badges */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className={clsx(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
              isBrand 
                ? "bg-primary/5 border-primary/10 text-primary" 
                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 font-mono"
            )}>
              {font.type} // {font.source}
            </div>
            {font.license && (
              <LpdText size="nano" className={clsx("font-mono italic", isBrand ? "text-text-muted/50" : "text-slate-500")}>
                {font.license}
              </LpdText>
            )}
          </div>
          
          <h3 
            className={clsx(
              "text-5xl md:text-6xl font-bold tracking-tight",
              isBrand ? "text-text-main" : "text-white font-mono"
            )}
            style={{ fontFamily: font.family }}
          >
            {font.family}
          </h3>
          
          <LpdText size="sm" className={clsx(
            "max-w-[240px] leading-relaxed",
            isBrand ? "text-text-muted" : "text-slate-400 font-mono"
          )}>
            {font.description || font.variants[0]?.usage || "No usage rules defined."}
          </LpdText>
        </div>

        {/* FOOTER: Preview Content */}
        <div className="mt-8">
          {isBrand ? (
            <div 
              className="flex gap-2 overflow-hidden text-text-main text-xl font-medium tracking-tight whitespace-nowrap opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ fontFamily: font.family }}
            >
              <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
              <span className="opacity-50">abcdefghijklmnopqrstuvwxyz</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {['{ }', '< >', '( )', '==='].map(sym => (
                 <div key={sym} className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center gap-1 group-hover:border-white/10 transition-colors">
                    <span className="text-xl text-white font-mono" style={{ fontFamily: font.family }}>{sym}</span>
                    <LpdText size="nano" className="text-slate-500 uppercase tracking-tighter">
                      {sym === '{ }' ? 'Braces' : sym === '< >' ? 'Tags' : sym === '( )' ? 'Parens' : 'Logic'}
                    </LpdText>
                 </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
