'use client';

import { Clock, Briefcase, ListTodo, FileText } from 'lucide-react';
import type { CustomerTabKey } from './types';

interface CustomerDesktopTabsProps {
  activeTab: CustomerTabKey;
  onSelectTab: (tab: CustomerTabKey) => void;
  timelineCount: number;
  opportunitiesCount: number;
  tasksCount: number;
  notesCount: number;
  isTimelineSimulated?: boolean;
  isOpportunitiesSimulated?: boolean;
  isTasksSimulated?: boolean;
  isNotesSimulated?: boolean;
}

export function CustomerDesktopTabs({
  activeTab,
  onSelectTab,
  timelineCount,
  opportunitiesCount,
  tasksCount,
  notesCount,
  isTimelineSimulated,
  isOpportunitiesSimulated,
  isTasksSimulated,
  isNotesSimulated,
}: CustomerDesktopTabsProps) {
  return (
    <div className="shrink-0 border-b border-border-subtle bg-surface-muted/20 px-4 sm:px-6 hidden lg:block">
      <nav
        className="-mb-px flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar"
        aria-label="Customer workspace tabs"
      >
        <button
          type="button"
          onClick={() => onSelectTab('timeline')}
          className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-muted hover:border-border-subtle hover:text-text-main'
          }`}
        >
          <Clock className="h-4 w-4" />
          Timeline
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isTimelineSimulated
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {timelineCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('opportunities')}
          className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'opportunities'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-muted hover:border-border-subtle hover:text-text-main'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Opportunities
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isOpportunitiesSimulated
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {opportunitiesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('tasks')}
          className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-muted hover:border-border-subtle hover:text-text-main'
          }`}
        >
          <ListTodo className="h-4 w-4" />
          Tasks
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isTasksSimulated
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {tasksCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('notes')}
          className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'notes'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-muted hover:border-border-subtle hover:text-text-main'
          }`}
        >
          <FileText className="h-4 w-4" />
          Notes
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isNotesSimulated
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {notesCount}
          </span>
        </button>
      </nav>
    </div>
  );
}
