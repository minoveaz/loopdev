'use client';

import { Clock } from 'lucide-react';
import { formatDate } from '../types';
import { SimulatedBadge, EmptyState } from '../sharedComponents';
import type { TimelineDisplayItem } from '../customer360DisplayTypes';

interface TimelinePanelProps {
  displayedTimeline: TimelineDisplayItem[];
  isTimelineSimulated?: boolean;
}

export function TimelinePanel({ displayedTimeline }: TimelinePanelProps) {
  return (
    <div className="space-y-6 flex-1 flex flex-col min-w-0 w-full">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Activity Timeline</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time audit log of interactions, system state transitions, and touchpoints.
          </p>
        </div>
        <span className="text-xs font-medium text-text-muted">
          {displayedTimeline.length} events
        </span>
      </div>

      {displayedTimeline.length ? (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle flex-1 min-w-0 w-full">
          {displayedTimeline.map((item, index) => {
            const isSimulated = Boolean(item.isSimulated);
            const key = `${item.source.sourceId}-${index}`;

            return (
              <div key={key} className="relative group min-w-0 w-full">
                <div className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-surface-light dark:border-surface-dark bg-primary ring-4 ring-surface-light dark:ring-surface-dark group-hover:scale-125 transition-transform" />
                <div
                  className={`rounded-xl p-4 transition-all min-w-0 w-full ${
                    isSimulated
                      ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                      : 'border border-border-subtle bg-surface-muted/20 hover:border-border-subtle/80 hover:bg-surface-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-semibold text-text-main capitalize truncate">
                        {item.kind}
                      </span>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    <span className="text-[11px] font-mono text-text-muted shrink-0">
                      {'event' in item && item.event?.occurredAt
                        ? formatDate(item.event.occurredAt)
                        : 'task' in item && item.task?.createdAt
                          ? formatDate(item.task.createdAt)
                          : 'note' in item && item.note?.createdAt
                            ? formatDate(item.note.createdAt)
                            : ''}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed break-words">
                    {'event' in item && item.event?.summary
                      ? item.event.summary
                      : 'task' in item && item.task?.title
                        ? item.task.title
                        : 'note' in item && item.note?.body
                          ? item.note.body
                          : 'Activity logged'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Clock className="h-8 w-8 text-text-muted" />}
          title="No activity yet."
          description="Timeline events and customer interactions will be indexed here automatically."
        />
      )}
    </div>
  );
}
