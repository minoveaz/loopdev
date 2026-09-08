'use client';

import React from 'react';
import { TypefaceCardProps } from './types';
import { Heading, LpdText } from '@loopdev/ui';
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
  isSelected,
}) => {
  const isBrand = variant === 'brand';

  // Base styles for the card container
  const cardStyles = twMerge(
    'relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer group',
    isBrand
      ? 'bg-background-surface border-border-technical/50 hover:border-primary/30'
      : 'bg-lpd-bg-dark border-border-technical hover:border-yellow-500/30',
    isSelected &&
      (isBrand
        ? 'border-primary ring-1 ring-primary/20'
        : 'border-yellow-500 ring-1 ring-yellow-500/20'),
  );

  return (
    <div className={cardStyles} onClick={onClick}>
      {/* WATERMARK BACKGROUND (Aa or </>) */}
      <div
        className={clsx(
          'pointer-events-none absolute select-none transition-opacity duration-500',
          isBrand
            ? 'right-8 top-4 opacity-[0.03] group-hover:opacity-[0.07] dark:opacity-[0.05]'
            : '-bottom-8 right-4 opacity-[0.04] group-hover:opacity-[0.08]',
        )}
      >
        <span
          className={clsx(
            'font-black leading-none',
            isBrand ? 'text-text-main' : 'font-mono text-white',
          )}
          style={{
            fontFamily: font.family,
            fontSize: isBrand ? '220px' : '180px',
          }}
        >
          {isBrand ? 'Aa' : '</>'}
        </span>
      </div>

      <div className="relative z-10 flex min-h-[300px] flex-col justify-between p-8">
        {/* HEADER: Metadata & Badges */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div
              className={clsx(
                'rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest',
                isBrand
                  ? 'bg-primary/5 border-primary/10 text-primary'
                  : 'border-yellow-500/20 bg-yellow-500/10 font-mono text-yellow-500',
              )}
            >
              {font.type} {'//'} {font.source}
            </div>
            {font.license && (
              <LpdText
                size="nano"
                className={clsx(
                  'font-mono italic',
                  isBrand ? 'text-text-muted/50' : 'text-slate-500',
                )}
              >
                {font.license}
              </LpdText>
            )}
          </div>

          <Heading
            as="h3"
            size="2xl"
            className={clsx(
              'text-5xl font-bold tracking-tight md:text-6xl',
              isBrand ? 'text-text-main' : 'font-mono text-white',
            )}
            style={{ fontFamily: font.family }}
          >
            {font.family}
          </Heading>

          <LpdText
            size="sm"
            className={clsx(
              'max-w-[240px] leading-relaxed',
              isBrand ? 'text-text-muted' : 'font-mono text-slate-400',
            )}
          >
            {font.description || font.variants[0]?.usage || 'No usage rules defined.'}
          </LpdText>
        </div>

        {/* FOOTER: Preview Content */}
        <div className="mt-8">
          {isBrand ? (
            <div
              className="text-text-main flex gap-2 overflow-hidden whitespace-nowrap text-xl font-medium tracking-tight opacity-40 transition-opacity group-hover:opacity-60"
              style={{ fontFamily: font.family }}
            >
              <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
              <span className="opacity-50">abcdefghijklmnopqrstuvwxyz</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {['{ }', '< >', '( )', '==='].map((sym) => (
                <div
                  key={sym}
                  className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/5 p-3 transition-colors group-hover:border-white/10"
                >
                  <span
                    className="font-mono text-xl text-white"
                    style={{ fontFamily: font.family }}
                  >
                    {sym}
                  </span>
                  <LpdText size="nano" className="uppercase tracking-tighter text-slate-500">
                    {sym === '{ }'
                      ? 'Braces'
                      : sym === '< >'
                        ? 'Tags'
                        : sym === '( )'
                          ? 'Parens'
                          : 'Logic'}
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
