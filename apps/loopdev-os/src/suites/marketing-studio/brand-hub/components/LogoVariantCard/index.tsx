'use client';

import React from 'react';
import { LogoVariantCardProps } from './types';
import { LpdText } from '@loopdev/ui';
import { clsx } from 'clsx';

/**
 * @component LogoVariantCard
 * @description A card to display and interact with specific logo lockups or color variants.
 * Supports Light, Dark, and Brand themes for the preview area.
 */
export const LogoVariantCard: React.FC<LogoVariantCardProps> = ({
  logo,
  logoNode,
  label,
  description,
  theme = 'dark'
}) => {
  const isLightTheme = theme === 'light';
  const isBrandTheme = theme === 'brand';

  return (
    <div className="group flex flex-col bg-background-surface border border-border-technical rounded-3xl overflow-hidden shadow-sm transition-all hover:border-primary/30">
      
      {/* PREVIEW STAGE */}
      <div className={clsx(
        "relative h-48 flex items-center justify-center overflow-hidden",
        isLightTheme ? "bg-white" : isBrandTheme ? "bg-primary" : "bg-background-dark"
      )}>
        {/* Grid Background */}
        <div className={clsx(
          "absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(120,120,120,1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,1)_1px,transparent_1px)] bg-[size:20px_20px]",
          isLightTheme && "opacity-[0.05]"
        )}></div>

        {/* The Logo */}
        <div className="relative z-10 p-8 max-w-full max-h-full transition-transform duration-500 group-hover:scale-110">
          {logoNode ? (
            <div className="scale-[1.5]">{logoNode}</div>
          ) : logo?.rawSvg ? (
            <div 
              className={clsx(
                "w-auto h-auto max-h-32",
                isLightTheme ? "text-slate-900 fill-slate-900" : "text-white fill-white"
              )}
              dangerouslySetInnerHTML={{ __html: logo.rawSvg }} 
            />
          ) : logo ? (
            <img 
              src={logo.url} 
              alt={logo.alt || label} 
              className="max-h-32 object-contain"
            />
          ) : null}
        </div>
      </div>

      {/* INFO & ACTIONS */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <LpdText size="sm" weight="bold" className="text-text-main leading-none">
              {label}
            </LpdText>
            {description && (
              <LpdText size="xs" className="text-text-muted italic">
                {description}
              </LpdText>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* SVG Action */}
            <button 
              className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-wide px-2 py-1 rounded border border-primary/20 hover:bg-primary transition-colors"
              onClick={() => {
                if (logo?.rawSvg) {
                  navigator.clipboard.writeText(logo.rawSvg);
                  // Trigger toast notification in a real scenario
                }
              }}
            >
              SVG
            </button>
            <button className="p-1.5 rounded-lg bg-background-subtle hover:bg-background-surface text-text-muted hover:text-primary border border-border-technical transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
