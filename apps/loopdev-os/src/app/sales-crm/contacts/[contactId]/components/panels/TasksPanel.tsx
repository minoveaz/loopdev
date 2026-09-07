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
    <div className="space-y-4 flex-1 flex flex-col min-w-0 w-full">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Tasks & Follow-ups</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Pending action items, internal commitments, and follow-ups.
          </p>
        </div>
        <Link
          href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-primary/90 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          New Task
        </Link>
      </div>

      {displayedTasks.length ? (
        <div className="space-y-2.5 min-w-0 w-full">
          {displayedTasks.map((task) => {
            const isSimulated = Boolean(task.isSimulated);
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between gap-4 p-3.5 rounded-xl transition-all min-w-0 w-full ${
                  isSimulated
                    ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                    : 'border border-border-subtle bg-surface-muted/20 hover:border-border-subtle/80 hover:bg-surface-muted/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      task.status === 'completed'
                        ? 'bg-emerald-500'
                        : task.priority === 'high' || task.priority === 'urgent'
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-amber-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-text-main truncate">{task.title}</p>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    {task.dueAt && (
                      <span className="text-[11px] text-text-muted">
                        Due: {formatDate(task.dueAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
                    className="p-1 text-text-muted hover:text-text-main transition-colors"
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
          icon={<ListTodo className="h-8 w-8 text-text-muted" />}
          title="No pending tasks"
          description={`Keep momentum going by scheduling a follow-up call, email, or meeting with ${name}.`}
          action={
            <Link
              href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-primary/90 transition-all"
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
