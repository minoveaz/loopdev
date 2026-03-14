'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
import { ActionCardProps } from './types';

/**
 * @component ActionCard
 * @description Card-based trigger for primary actions.
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  intent = 'neutral',
  onClick
}) => {
  const intentStyles = {
    primary: 'border-primary/20 hover:border-primary/40 bg-primary/5 shadow-sm',
    secondary: 'border-border-technical hover:border-text-muted/40 bg-background-surface shadow-none',
    neutral: 'border-border-technical/50 hover:border-border-technical bg-transparent opacity-80 hover:opacity-100'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
        intentStyles[intent]
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background-surface border border-border-technical shrink-0">
        <span className="material-symbols-outlined text-[20px] text-text-muted opacity-80">
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <LpdText size="sm" weight="bold" className="text-text-main">
          {title}
        </LpdText>
        <LpdText size="xs" className="text-text-muted opacity-60 leading-tight">
          {description}
        </LpdText>
      </div>
    </button>
  );
};
