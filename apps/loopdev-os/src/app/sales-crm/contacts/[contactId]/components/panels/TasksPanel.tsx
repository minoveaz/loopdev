'use client';

import Link from 'next/link';
import { ListTodo, Plus, ChevronRight } from 'lucide-react';
import { formatDate } from '../types';
import { SimulatedBadge, EmptyState } from '../sharedComponents';
import type { TaskDisplayItem } from '../customer360DisplayTypes';

interface TasksPanelProps {
  name: string;
  contactId: string;
  displayedTasks: TaskDisplayItem[];
  isTasksSimulated?: boolean;
}

export function TasksPanel({ name, contactId, displayedTasks }: TasksPanelProps) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col space-y-4">
      <div className="border-border-subtle flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-text-main text-sm font-semibold">Tasks & Follow-ups</h3>
          <p className="text-text-muted mt-0.5 text-xs">
            Pending action items, internal commitments, and follow-ups.
          </p>
        </div>
        <Link
          href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
          className="bg-primary shadow-xs hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          New Task
        </Link>
      </div>

      {displayedTasks.length ? (
        <div className="w-full min-w-0 space-y-2.5">
          {displayedTasks.map((task) => {
            const isSimulated = Boolean(task.isSimulated);
            return (
              <div
                key={task.id}
                className={`flex w-full min-w-0 items-center justify-between gap-4 rounded-xl p-3.5 transition-all ${
                  isSimulated
                    ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                    : 'border-border-subtle bg-surface-muted/20 hover:border-border-subtle/80 hover:bg-surface-muted/30 border'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      task.status === 'completed'
                        ? 'bg-emerald-500'
                        : task.priority === 'high' || task.priority === 'urgent'
                          ? 'animate-pulse bg-rose-500'
                          : 'bg-amber-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-text-main truncate text-xs font-medium">{task.title}</p>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    {task.dueAt && (
                      <span className="text-text-muted text-[11px]">
                        Due: {formatDate(task.dueAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      task.priority === 'high' || task.priority === 'urgent'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        : task.priority === 'normal'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          : 'bg-surface-muted text-text-muted'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <Link
                    href={`/sales-crm/tasks/${task.id}`}
                    className="text-text-muted hover:text-text-main p-1 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<ListTodo className="text-text-muted h-8 w-8" />}
          title="No pending tasks"
          description={`Keep momentum going by scheduling a follow-up call, email, or meeting with ${name}.`}
          action={
            <Link
              href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
              className="bg-primary shadow-xs hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-white transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Schedule Task
            </Link>
          }
        />
      )}
    </div>
  );
}
