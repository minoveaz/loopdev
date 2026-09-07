'use client';

import React from 'react';
import { LpdText, Button, cn } from '@loopdev/ui';
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
    <Button
      variant="secondary"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
        intentStyles[intent]
      )}
    >
      <div className="bg-background-surface border-border-technical flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
        <span className="material-symbols-outlined text-text-muted text-[20px] opacity-80">
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <LpdText size="sm" weight="bold" className="text-text-main">
          {title}
        </LpdText>
        <LpdText size="xs" className="text-text-muted leading-tight opacity-60">
          {description}
        </LpdText>
      </div>
    </Button>
  );
};
