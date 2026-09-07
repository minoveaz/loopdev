'use client';

import React from 'react';
import { LpdText, Button } from '@loopdev/ui';
import { AuditEventRowProps } from './types';

/**
 * @component AuditEventRow
 * @description Compact row for audit events.
 */
export const AuditEventRow: React.FC<AuditEventRowProps> = ({ event, onClick }) => {
  const icons: Record<string, string> = {
    publish: 'publish',
    token_change: 'palette',
    rule_change: 'shield',
    override: 'layers',
    metadata_change: 'edit_note'
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="hover:bg-background-subtle group flex w-full items-center gap-4 rounded-lg p-3 text-left transition-colors"
    >
      <div className="bg-background-surface border-border-technical flex h-8 w-8 items-center justify-center rounded-lg border">
        <span className="material-symbols-outlined text-text-muted text-[16px] opacity-60">
          {icons[event.type] || 'event_note'}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <LpdText size="sm" weight="bold" className="text-text-main truncate">
          {event.label}
        </LpdText>
        <div className="flex items-center gap-2">
          <LpdText size="nano" className="text-text-muted font-mono opacity-60">
            {event.actor}
          </LpdText>
          <div className="bg-border-technical h-1 w-1 rounded-full opacity-20" />
          <LpdText size="nano" className="text-text-muted uppercase tracking-tighter opacity-40">
            {event.timestamp}
          </LpdText>
        </div>
      </div>

      {event.hasDiff && (
        <div className="bg-status-success/10 border-status-success/20 rounded border px-2 py-0.5">
          <LpdText size="nano" weight="bold" className="font-mono uppercase text-emerald-500">
            {`{ DIFF }`}
          </LpdText>
        </div>
      )}
    </Button>
  );
};
