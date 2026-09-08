'use client';

import React from 'react';
import { Heading, LpdText } from '@loopdev/ui';
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
  onCopy,
}) => {
  if (tokens.length === 0) return null;

  return (
    <section className="flex flex-col gap-8">
      {/* GROUP HEADER */}
      <div className="border-border-technical/30 flex flex-col gap-2 border-b pb-4">
        <div className="flex items-center justify-between">
          <Heading
            as="h2"
            size="lg"
            weight="bold"
            className="text-text-main uppercase tracking-tight"
          >
            {title}
          </Heading>
          <LpdText size="nano" className="text-text-muted font-mono opacity-60">
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
