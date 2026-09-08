'use client';

import React from 'react';
import { LpdText, TechnicalStatusBadge } from '@loopdev/ui';

interface InspectorHeaderProps {
  bot: {
    id: string;
    pair: string;
    strategyId: string;
    status: string;
  };
}

export const InspectorHeader: React.FC<InspectorHeaderProps> = ({ bot }) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <LpdText
            size="xl"
            weight="black"
            className="text-text-main font-mono leading-none tracking-tighter"
          >
            {bot.pair}
          </LpdText>
          <LpdText
            size="xs"
            weight="black"
            className="text-primary mt-1 uppercase italic tracking-widest opacity-80"
          >
            {bot.id.substring(0, 8)}
            {' // '}
            {bot.strategyId}
          </LpdText>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TechnicalStatusBadge
            label={bot.status.toUpperCase()}
            severity={bot.status === 'active' ? 'success' : 'warning'}
            variant="glass"
            withPulse={bot.status === 'active'}
          />
          <div className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-0.5">
            <span className="bg-status-success h-1 w-1 rounded-full" />
            <LpdText size="nano" className="text-status-success font-mono opacity-80">
              12ms_OK
            </LpdText>
          </div>
        </div>
      </div>
    </section>
  );
};
