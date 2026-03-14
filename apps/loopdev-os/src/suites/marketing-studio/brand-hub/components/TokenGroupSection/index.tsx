'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
import { ColorTokenCard } from '../ColorTokenCard';
import { TokenGroupSectionProps } from './types';

/**
 * @component TokenGroupSection
 * @description Composite for a group of color tokens with a semantic header.
 */
export const TokenGroupSection: React.FC<TokenGroupSectionProps> = ({
  title,
  description,
  tokens,
  theme,
  selectedTokenId,
  onTokenClick,
  onCopy
}) => {
  if (tokens.length === 0) return null;

  return (
    <section className="flex flex-col gap-8">
      {/* GROUP HEADER */}
      <div className="flex flex-col gap-2 pb-4 border-b border-border-technical/30">
        <div className="flex items-center justify-between">
          <LpdText size="lg" weight="bold" className="text-text-main uppercase tracking-tight">
            {title}
          </LpdText>
          <LpdText size="nano" className="text-text-muted opacity-60 font-mono">
            {`{ ${tokens.length} tokens }`}
          </LpdText>
        </div>
        {description && (
          <LpdText size="sm" className="text-text-muted max-w-2xl">
            {description}
          </LpdText>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {tokens.map((token) => (
          <ColorTokenCard
            key={token.id}
            token={token}
            theme={theme}
            isActive={selectedTokenId === token.id}
            onClick={() => onTokenClick?.(token)}
            onCopy={onCopy}
          />
        ))}
      </div>
    </section>
  );
};
