'use client';

import React from 'react';
import { Heading, LpdText, cn, TechnicalTooltip } from '@loopdev/ui';
import { ColorTokenCardProps } from './types';
import { getContrastRatio, getWCAGStatus } from '@/utils/color';

/**
 * @component ColorTokenCard
 * @description Molecule for displaying a semantic color token with accessibility metadata.
 */
export const ColorTokenCard: React.FC<ColorTokenCardProps> = ({
  token,
  theme,
  isActive,
  onClick,
  onCopy,
}) => {
  const resolvedHex = theme === 'light' ? token.resolvesTo.light : token.resolvesTo.dark;

  // SMART CONTRAST BASELINE
  // If it's a background token, check against text. If it's anything else, check against surface.
  const isBackground = token.role === 'bg';
  const contrastBaseline = isBackground
    ? theme === 'light'
      ? '#0f172a'
      : '#f8fafc' // Check against text
    : theme === 'light'
      ? '#ffffff'
      : '#0d121b'; // Check against surface

  const ratio = getContrastRatio(resolvedHex, contrastBaseline);
  const wcagStatus = getWCAGStatus(ratio);

  // EXPLICIT ROLE-BASED MAPPING
  const statusConfig = {
    AAA: {
      label: isBackground ? 'BG_EXCELLENT' : 'UNIVERSAL',
      class: 'bg-green-500/20 text-green-600 border-green-500/20',
      note: isBackground ? 'Any text color will be legible on this.' : 'Legible at any size.',
    },
    AA: {
      label: isBackground ? 'BG_SAFE' : 'BODY_TEXT',
      class: 'bg-primary/10 text-primary border-primary/20',
      note: isBackground ? 'Dark/Light text is safe here.' : 'Safe for paragraphs.',
    },
    AA_LARGE: {
      label: isBackground ? 'BG_LIMITED' : 'HEADLINES_ONLY',
      class: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      note: 'Use only for large elements.',
    },
    FAIL: {
      label: isBackground ? 'BG_DANGEROUS' : 'FAIL',
      class: 'bg-red-500/10 text-red-600 border-red-500/20',
      note: 'Fails contrast standards.',
    },
  }[wcagStatus];

  const handleHexClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy?.(resolvedHex);
    navigator.clipboard.writeText(resolvedHex);
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  // ROLE HUMANIZER
  const roleLabel =
    {
      bg: 'background',
      text: 'typography',
      border: 'border',
      status: 'status',
    }[token.role || 'ui'] || 'ui_element';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col bg-background-surface rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden',
        isActive
          ? 'border-primary ring-1 ring-primary shadow-lg'
          : 'border-border-technical hover:border-text-muted/30 shadow-sm',
        wcagStatus === 'FAIL' && !isActive && 'border-red-500/30',
      )}
    >
      {/* FAIL SIGNAL (Corner Accent) */}
      {wcagStatus === 'FAIL' && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-8 w-8 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-full -translate-y-1/2 translate-x-1/2 rotate-45 bg-red-500 opacity-20" />
        </div>
      )}

      {/* SWATCH AREA */}
      <div
        className="relative h-32 w-full transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundColor: resolvedHex }}
      >
        <div className="absolute bottom-2 right-2 flex gap-2">
          {/* WCAG BADGE */}
          <TechnicalTooltip content={`${statusConfig.label}: ${statusConfig.note}`}>
            <div
              onClick={handleBadgeClick}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter cursor-help border backdrop-blur-md',
                statusConfig.class,
              )}
            >
              {`{ ${statusConfig.label} }`}
            </div>
          </TechnicalTooltip>
        </div>
      </div>

      {/* METADATA AREA */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <Heading as="h3" size="sm" weight="bold" className="text-text-main truncate">
              {token.name}
            </Heading>
            {/* CATEGORY BADGE */}
            <div
              className={cn(
                'px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border',
                token.group === 'core'
                  ? 'bg-primary/5 border-primary/20 text-primary'
                  : 'bg-background-subtle border-border-technical text-text-muted',
              )}
            >
              {token.group === 'core' ? 'Brand' : 'System'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 opacity-40">
            <LpdText size="nano" className="text-text-muted font-mono italic">
              {`role: ${roleLabel}`}
            </LpdText>
            <TechnicalTooltip content="Contrast is measured against the primary surface or text color to ensure accessibility.">
              <span className="material-symbols-outlined cursor-help text-[10px]">help</span>
            </TechnicalTooltip>
          </div>
        </div>

        <div className="text-text-muted flex flex-col gap-1.5 font-mono text-[11px]">
          <TechnicalTooltip content="Click to copy HEX">
            <div
              onClick={handleHexClick}
              className="border-border-technical/50 hover:text-text-main group/hex flex justify-between border-b pb-1.5 transition-colors"
            >
              <span>HEX</span>
              <span className="group-hover/hex:text-primary font-bold transition-colors">
                {resolvedHex.toUpperCase()}
              </span>
            </div>
          </TechnicalTooltip>
          <TechnicalTooltip
            content={
              ratio > 7
                ? 'High contrast ensures maximum readability for all text sizes.'
                : undefined
            }
          >
            <div className="flex justify-between pt-0.5">
              <span className="uppercase opacity-40">Legibility</span>
              <span
                className={cn(
                  'font-bold',
                  wcagStatus === 'FAIL'
                    ? 'text-red-500'
                    : wcagStatus === 'AA_LARGE'
                      ? 'text-orange-500'
                      : 'text-text-main opacity-60',
                )}
              >
                {ratio.toFixed(2)} : 1
              </span>
            </div>
          </TechnicalTooltip>
        </div>
      </div>
    </div>
  );
};
