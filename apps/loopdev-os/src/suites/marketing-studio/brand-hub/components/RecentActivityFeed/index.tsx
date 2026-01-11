'use client';

import React from 'react';
import { LpdText, Skeleton, Button } from '@loopdev/ui';
import { AuditEventRow } from '../AuditEventRow';
import { RecentActivityFeedProps } from './types';

/**
 * @component RecentActivityFeed
 * @description List of recent brand events.
 */
export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  events,
  isLoading,
  onEventClick
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
          Recent Activity
        </LpdText>
        <Button variant="ghost" size="sm" className="text-[10px]">View Full Audit</Button>
      </div>

      <div className="flex flex-col gap-1">
        {events.length > 0 ? (
          events.map((event) => (
            <AuditEventRow
              key={event.id}
              event={event}
              onClick={() => onEventClick?.(event)}
            />
          ))
        ) : (
          <div className="py-12 text-center border border-dashed border-border-technical rounded-xl opacity-40">
            <LpdText size="xs" className="font-mono uppercase tracking-widest">
              // No activity recorded
            </LpdText>
          </div>
        )}
      </div>
    </div>
  );
};
