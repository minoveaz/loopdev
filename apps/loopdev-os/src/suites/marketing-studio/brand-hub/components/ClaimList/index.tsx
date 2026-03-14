'use client';

import React from 'react';
import { LpdText, cn, TechnicalStatusBadge } from '@loopdev/ui';
import { ClaimListProps } from './types';

/**
 * @component ClaimList
 * @description List of forbidden or regulated brand language.
 */
export const ClaimList: React.FC<ClaimListProps> = ({
  title,
  items,
  type,
  onItemClick,
  className
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
        {title}
      </LpdText>

      {type === 'forbidden' ? (
        <div className="flex flex-wrap gap-2">
          {(items as string[]).map((term, i) => (
            <button
              key={i}
              onClick={() => onItemClick?.(term)}
              className="px-3 py-1 rounded-full bg-red-500/5 border border-red-500/20 text-red-500 text-xs font-mono hover:bg-red-500/10 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {(items as any[]).map((claim) => (
            <button
              key={claim.id}
              onClick={() => onItemClick?.(claim.id)}
              className="flex items-center justify-between p-3 rounded-xl border border-border-technical bg-background-surface hover:border-primary/20 transition-all text-left group"
            >
              <div className="flex flex-col gap-0.5">
                <LpdText size="sm" weight="bold" className="text-text-main group-hover:text-primary transition-colors">
                  {claim.text}
                </LpdText>
                <LpdText size="xs" className="text-text-muted opacity-40">
                  {claim.reason}
                </LpdText>
              </div>
              <div className="flex items-center gap-2">
                <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest opacity-40">
                  {claim.jurisdiction}
                </LpdText>
                <TechnicalStatusBadge 
                  label={claim.severity.toUpperCase()}
                  severity={claim.severity === 'block' ? 'critical' : 'warning'}
                  variant="glass"
                  className="scale-75 origin-right"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
