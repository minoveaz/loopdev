'use client';

import { Clock } from 'lucide-react';
import { Heading } from '@loopdev/ui';
import { formatDate } from '../types';
import { SimulatedBadge, EmptyState } from '../sharedComponents';
import type { TimelineDisplayItem } from '../customer360DisplayTypes';

interface TimelinePanelProps {
  displayedTimeline: TimelineDisplayItem[];
  isTimelineSimulated?: boolean;
}

export function TimelinePanel({ displayedTimeline }: TimelinePanelProps) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col space-y-6">
      <div className="border-border-subtle flex items-center justify-between border-b pb-3">
        <div>
          <Heading as="h3" size="sm" weight="semibold" className="text-text-main">
            Activity Timeline
          </Heading>
          <p className="text-text-muted mt-0.5 text-xs">
            Real-time audit log of interactions, system state transitions, and touchpoints.
          </p>
        </div>
        <span className="text-text-muted text-xs font-medium">
          {displayedTimeline.length} events
        </span>
      </div>

      {displayedTimeline.length ? (
        <div className="before:bg-border-subtle relative w-full min-w-0 flex-1 space-y-6 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5">
          {displayedTimeline.map((item, index) => {
            const isSimulated = Boolean(item.isSimulated);
            const key = `${item.source.sourceId}-${index}`;

            return (
              <div key={key} className="group relative w-full min-w-0">
                <div className="border-surface-light dark:border-surface-dark bg-primary ring-surface-light dark:ring-surface-dark absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 ring-4 transition-transform group-hover:scale-125" />
                <div
                  className={`w-full min-w-0 rounded-xl p-4 transition-all ${
                    isSimulated
                      ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                      : 'border-border-subtle bg-surface-muted/20 hover:border-border-subtle/80 hover:bg-surface-muted/30 border'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-text-main truncate text-xs font-semibold capitalize">
                        {item.kind}
                      </span>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    <span className="text-text-muted shrink-0 font-mono text-[11px]">
                      {'event' in item && item.event?.occurredAt
                        ? formatDate(item.event.occurredAt)
                        : 'task' in item && item.task?.createdAt
                          ? formatDate(item.task.createdAt)
                          : 'note' in item && item.note?.createdAt
                            ? formatDate(item.note.createdAt)
                            : ''}
                    </span>
                  </div>
                  <p className="text-text-muted break-words text-xs leading-relaxed">
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
          icon={<Clock className="text-text-muted h-8 w-8" />}
          title="No activity yet."
          description="Timeline events and customer interactions will be indexed here automatically."
        />
      )}
    </div>
  );
}
