'use client';

import React from 'react';
import Image from 'next/image';
import { LogoVariantCardProps } from './types';
import { LpdText, Button, IconButton } from '@loopdev/ui';
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
  theme = 'dark',
}) => {
  const isLightTheme = theme === 'light';
  const isBrandTheme = theme === 'brand';

  return (
    <div className="bg-background-surface border-border-technical hover:border-primary/30 group flex flex-col overflow-hidden rounded-3xl border shadow-sm transition-all">
      {/* PREVIEW STAGE */}
      <div
        className={clsx(
          'relative flex h-48 items-center justify-center overflow-hidden',
          isLightTheme ? 'bg-white' : isBrandTheme ? 'bg-primary' : 'bg-background-dark',
        )}
      >
        {/* Grid Background */}
        <div
          className={clsx(
            'pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(120,120,120,1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-[0.03]',
            isLightTheme && 'opacity-[0.05]',
          )}
        ></div>

        {/* The Logo */}
        <div className="relative z-10 max-h-full max-w-full p-8 transition-transform duration-500 group-hover:scale-110">
          {logoNode ? (
            <div className="scale-[1.5]">{logoNode}</div>
          ) : logo?.rawSvg ? (
            <div
              className={clsx(
                'h-auto max-h-32 w-auto',
                isLightTheme ? 'fill-slate-900 text-slate-900' : 'fill-white text-white',
              )}
              dangerouslySetInnerHTML={{ __html: logo.rawSvg }}
            />
          ) : logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt || label}
              width={logo.width ?? 128}
              height={logo.height ?? 128}
              unoptimized
              className="max-h-32 object-contain"
            />
          ) : null}
        </div>
      </div>

      {/* INFO & ACTIONS */}
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-primary hover:text-primary-foreground border-primary/20 hover:bg-primary rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors"
              onClick={() => {
                if (logo?.rawSvg) {
                  navigator.clipboard.writeText(logo.rawSvg);
                  // Trigger toast notification in a real scenario
                }
              }}
            >
              SVG
            </Button>
            <IconButton
              icon="download"
              size="sm"
              aria-label="Descargar variante de logo"
              className="bg-background-subtle hover:bg-background-surface text-text-muted hover:text-primary border-border-technical rounded-lg border p-1.5 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
