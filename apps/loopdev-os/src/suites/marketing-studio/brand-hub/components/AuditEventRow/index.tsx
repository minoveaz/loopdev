'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
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
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-background-subtle transition-colors group text-left"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background-surface border border-border-technical">
        <span className="material-symbols-outlined text-[16px] text-text-muted opacity-60">
          {icons[event.type] || 'event_note'}
        </span>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <LpdText size="sm" weight="bold" className="text-text-main truncate">
          {event.label}
        </LpdText>
        <div className="flex items-center gap-2">
          <LpdText size="nano" className="text-text-muted font-mono opacity-60">
            {event.actor}
          </LpdText>
          <div className="w-1 h-1 rounded-full bg-border-technical opacity-20" />
          <LpdText size="nano" className="text-text-muted opacity-40 uppercase tracking-tighter">
            {event.timestamp}
          </LpdText>
        </div>
      </div>

      {event.hasDiff && (
        <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          <LpdText size="nano" weight="bold" className="text-emerald-500 font-mono uppercase">
            {`{ DIFF }`}
          </LpdText>
        </div>
      )}
    </button>
  );
};
